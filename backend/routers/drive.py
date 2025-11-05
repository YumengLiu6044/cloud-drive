import io
import uuid
from datetime import datetime, timezone
from typing import Annotated, Mapping
from urllib.parse import unquote
from zipfile import ZipFile, ZIP_DEFLATED
from pathlib import Path
from bson import ObjectId
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request, Query
)
from pydantic import EmailStr
from pymongo.errors import DuplicateKeyError
from starlette.responses import StreamingResponse

from core.database import mongo
from core.file_utils import get_mime_type, get_file_from_db, verify_parent_folder, move_files_to_trash, \
    verify_deletion_request
from core.security import security_manager
from models.db_models import DriveModel
from models.drive_models import CreateFolderRequest, DeleteFilesRequest, MoveFilesRequest, DownloadFilesRequest

drive_router = APIRouter(prefix="/drive", tags=["drive"])


@drive_router.get("/list-content/{parent_id}")
async def list_content(
    parent_record: Annotated[Mapping, Depends(verify_parent_folder)],
):
    requested_parent = str(parent_record["_id"])

    # Query for all files
    all_files_request = {"parent_id": requested_parent}
    result = []
    async for file_row in mongo.files.find(all_files_request):
        file_row["_id"] = str(file_row["_id"])
        result.append(file_row)

    return {"result": result}

@drive_router.post("/create-folder")
async def create_folder(
    param: CreateFolderRequest,
    current_user: Annotated[EmailStr, Depends(security_manager.get_current_user)]
):
    requested_parent = param.parent_id
    await get_file_from_db(requested_parent, current_user, mongo.files)

    new_folder = DriveModel(
        parent_id=param.parent_id,
        is_folder=True,
        name=param.name,
        owner=current_user,
        last_modified=int(datetime.now(timezone.utc).timestamp()),
        type="Folder"
    )
    try:
        insertion_result = await mongo.files.insert_one(new_folder.__dict__)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="File of the same name already exists")

    if not insertion_result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to create folder")

    return {"new_folder": str(insertion_result.inserted_id)}


@drive_router.get("/list-trash-content")
async def list_trash_content(
    current_user: Annotated[EmailStr, Depends(security_manager.get_current_user)]
):
    records = []
    trash_query = {"owner": current_user}
    async for trash_file_row in mongo.trash.find(trash_query):
        trash_file_row["_id"] = str(trash_file_row["_id"])
        records.append(trash_file_row)

    return {"result": records}

@drive_router.post("/upload-file/{parent_id}")
async def upload_file(
    parent_record: Annotated[Mapping, Depends(verify_parent_folder)],
    current_user: Annotated[EmailStr, Depends(security_manager.get_current_user)],
    file_name: Annotated[str, Query(...)],
    request: Request
):
    bucket = mongo.file_bucket
    parent_id = str(parent_record.get("_id"))
    file_name = unquote(file_name)
    file_mime_type = get_mime_type(file_name)

    # Insert file document
    new_record = DriveModel(
        parent_id=parent_id,
        is_folder=False,
        name=file_name,
        type=file_mime_type,
        owner=current_user,
        last_modified=int(datetime.now(timezone.utc).timestamp()),
    )

    try:
        inserted_record = await mongo.files.insert_one(new_record.__dict__)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="File of the same name already exists")

    # Upload file and update fields
    metadata = {"contentType": file_mime_type}
    file_size = 0
    try:
        async with bucket.open_upload_stream(file_name, metadata=metadata) as upload_stream:
            async for chunk in request.stream():
                await upload_stream.write(chunk)
                file_size += len(chunk)
            file_id = upload_stream._id
    except Exception as e:
        # Remove file record if uploading fails
        await mongo.files.delete_one({"_id": inserted_record.inserted_id})
        raise e

    await mongo.files.update_one(
        {"_id": inserted_record.inserted_id},
        {"$set": {"uri": str(file_id), "size": file_size}},
    )

    # Return
    return {
        "result": str(inserted_record.inserted_id),
        "file_uri": str(file_id),
    }


@drive_router.post("/move-to-trash")
async def move_files_to_trash_route(
    param: Annotated[DeleteFilesRequest, Depends(verify_deletion_request)],
    _: Annotated[EmailStr, Depends(security_manager.get_current_user)]
):
    await move_files_to_trash(param.files, permanent=False)
    return {"message": "Moved files to trash"}


@drive_router.post("/delete-from-trash")
async def delete_files_from_trash_route(
    param: Annotated[DeleteFilesRequest, Depends(verify_deletion_request)],
    _: Annotated[EmailStr, Depends(security_manager.get_current_user)],
):
    await move_files_to_trash(param.files, permanent=True)
    return {"message": "Deleted files from trash"}


@drive_router.post("/move-directory")
async def move_files_to_new_folder_route(
    param: MoveFilesRequest,
    current_user: Annotated[EmailStr, Depends(security_manager.get_current_user)],
):
    parent_record = await verify_parent_folder(param.new_parent_id, current_user)
    file_id_set = set(param.files)

    # Verify that the new parent_id isn't a child of the files
    next_parent_id = parent_record.get("parent_id")
    while next_parent_id:
        if next_parent_id in file_id_set:
            raise HTTPException(status_code=409, detail="The new parent can't be a child of itself")
        next_parent_record = await mongo.files.find_one({"_id": ObjectId(next_parent_id)})
        if next_parent_record:
            next_parent_id = next_parent_record["parent_id"]
        else:
            next_parent_id = None

    for file_id in file_id_set:
        await mongo.files.update_one(
            {"_id": ObjectId(file_id)},
            {"$set": {"parent_id": param.new_parent_id}},
        )

    return {"message": "Moved files to new folder"}


@drive_router.post("/download-files")
async def download_files(
    param: DownloadFilesRequest,
    current_user: Annotated[EmailStr, Depends(security_manager.get_current_user)],
):
    # Load file records
    file_records = []
    for file_id in param.files:
        file_record = await get_file_from_db(file_id, current_user, mongo.files)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        file_records.append(file_record)

    # Verify downloading from same folder
    if set(file_record.get("parent_id") for file_record in file_records).__len__() != 1:
        raise HTTPException(status_code=404, detail="Must be from the same folder")

    # Traverse and construct in-memory zip file
    io_stream = io.BytesIO()
    id_path_mapping = {}

    with ZipFile(io_stream, "w", ZIP_DEFLATED) as zip_file:
        while len(file_records) > 0:
            current_top = file_records.pop(-1)
            current_top_path = id_path_mapping.get(
                current_top["_id"],
                Path(current_top["name"])
            )

            if current_top.get("is_folder", False):
                # Retrieve children and push to stack
                current_top_id = str(current_top.get("_id"))
                async for child in mongo.files.find({"parent_id": current_top_id}):
                    file_records.append(child)
                    id_path_mapping[child["_id"]] = current_top_path / child["name"]
            else:
                # Download and write to zip_file
                file_uri = current_top.get("uri", None)
                if not file_uri:
                    raise HTTPException(status_code=404, detail="File uri not found")

                file_obj = await mongo.file_bucket.open_download_stream(ObjectId(file_uri))
                zip_file.writestr(current_top_path.as_posix(), await file_obj.read())
    io_stream.seek(0)

    # Return a Streaming Response
    file_name = f"{uuid.uuid4()}.zip"
    return StreamingResponse(
        io_stream,
        media_type="application/zip",
        headers={
            'Access-Control-Expose-Headers': 'Content-Disposition',
            'Content-Disposition': f'attachment; filename={file_name}',
        }
    )
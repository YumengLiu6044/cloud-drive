from datetime import datetime, timezone
from typing import Annotated, Mapping
from urllib.parse import unquote
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request, Query
)
from pydantic import EmailStr
from pymongo.errors import DuplicateKeyError
from core.database import mongo
from core.file_utils import get_mime_type, get_file_from_db, verify_parent_folder
from core.security import security_manager
from models.db_models import DriveModel
from models.drive_models import CreateFolderRequest, ListContentModel, DeleteFilesRequest

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
    await get_file_from_db(requested_parent, current_user)

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


@drive_router.post("/move-to-trash")
async def move_files_to_trash(
    param: DeleteFilesRequest,
    current_user: Annotated[EmailStr, Depends(security_manager.get_current_user)]
):
    # Load records from DB
    requested_records = []
    for requested_file in param.files:
        record = await get_file_from_db(requested_file, current_user)
        requested_records.append(record)

    # Move records to trash using DFS
    while len(requested_records) > 0:
        current_top = requested_records.pop(-1)
        current_top_id = current_top.get("_id")

        find_children_query = {"parent_id": str(current_top_id), "owner": current_user}
        async for file_row in mongo.files.find(find_children_query):
            requested_records.append(file_row)

        delete_response = await mongo.files.delete_one({"_id": current_top_id})
        if not delete_response.deleted_count:
            raise HTTPException(status_code=404, detail="Folder Not found")

        await mongo.trash.insert_one(current_top)

    return {"message": "Moved files to trash"}


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

    # Upload file and update uri field
    metadata = {"contentType": file_mime_type}
    try:
        async with bucket.open_upload_stream(file_name, metadata=metadata) as upload_stream:
            async for chunk in request.stream():
                await upload_stream.write(chunk)
            file_id = upload_stream._id
    except Exception as e:
        await mongo.files.delete_one({"_id": inserted_record.inserted_id})
        raise e

    await mongo.files.update_one(
        {"_id": inserted_record.inserted_id},
        {"$set": {"uri": str(file_id)}},
    )

    # Return
    return {"result": str(file_id)}

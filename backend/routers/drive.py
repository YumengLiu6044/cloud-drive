from datetime import datetime, timezone
from typing import Annotated, List
from bson import ObjectId
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from pydantic import EmailStr
from pymongo.errors import DuplicateKeyError
from core.database import mongo
from core.security import security_manager
from models.db_models import DriveModel
from models.drive_models import CreateFolderRequest, ListContentModel, DeleteFilesRequest

drive_router = APIRouter(prefix="/drive", tags=["drive"])

async def get_file_from_db(
    file_id: str,
    current_user: EmailStr
):
    # Check if the requested folder belongs to current_user
    find_owner_request = {"_id": ObjectId(file_id)}
    find_owner_response = await mongo.files.find_one(find_owner_request)
    if find_owner_response is None:
        raise HTTPException(status_code=404, detail="Folder Not found")
    if find_owner_response["owner"] != current_user:
        raise HTTPException(status_code=403, detail="Not authorized")

    return find_owner_response


@drive_router.post("/list-content")
async def list_content(
    param: ListContentModel,
    current_user: Annotated[EmailStr, Depends(security_manager.get_current_user)]
):
    requested_parent = param.parent_id
    await get_file_from_db(requested_parent, current_user)

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
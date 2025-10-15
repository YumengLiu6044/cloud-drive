from datetime import datetime
from typing import Annotated
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
from models.drive_models import CreateFolderRequest, ListContentModel

drive_router = APIRouter(prefix="/drive", tags=["drive"])

async def verify_parent_id(
    parent_id: str,
    current_user: EmailStr
) -> None:
    # Check if the requested folder belongs to current_user
    find_owner_request = {"_id": ObjectId(parent_id)}
    find_owner_response = await mongo.files.find_one(find_owner_request)
    if find_owner_response is None:
        raise HTTPException(status_code=404, detail="Folder Not found")
    if find_owner_response["owner"] != current_user:
        raise HTTPException(status_code=403, detail="Not authorized")

@drive_router.post("/list-content")
async def list_content(
    param: ListContentModel,
    current_user: Annotated[EmailStr, Depends(security_manager.get_current_user)]
):
    requested_parent = param.parent_id
    await verify_parent_id(requested_parent, current_user)

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
    await verify_parent_id(requested_parent, current_user)

    new_folder = DriveModel(
        parent_id=param.parent_id,
        is_folder=True,
        name=param.name,
        owner=current_user,
        last_modified=datetime.now(),
        type="Folder"
    )
    try:
        insertion_result = await mongo.files.insert_one(new_folder.__dict__)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="File of the same name already exists")

    if not insertion_result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to create folder")

    return {"new_folder": str(insertion_result.inserted_id)}
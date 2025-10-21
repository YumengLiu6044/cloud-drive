import mimetypes
from typing import Annotated
from bson import ObjectId
from fastapi import HTTPException, Depends
from pydantic import EmailStr
from core.database import mongo
from core.security import security_manager


def get_mime_type(filename: str) -> str:
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type or "application/octet-stream"


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


async def verify_parent_folder(
    parent_id: str,
    current_user: Annotated[EmailStr, Depends(security_manager.get_current_user)],
):
    parent_record = await get_file_from_db(parent_id, current_user)
    if not parent_record.get("is_folder"):
        raise HTTPException(status_code=404, detail="Folder not found")
    return parent_record

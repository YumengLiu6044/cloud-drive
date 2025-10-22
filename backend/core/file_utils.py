import mimetypes
from datetime import datetime, timezone
from typing import Annotated, List, Set
from bson import ObjectId
from fastapi import HTTPException, Depends
from gridfs import NoFile
from pydantic import EmailStr
from pymongo.asynchronous.collection import AsyncCollection

from core.database import mongo
from core.security import security_manager
from models.drive_models import DeleteFilesRequest


def get_mime_type(filename: str) -> str:
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type or "application/octet-stream"


async def get_file_from_db(
    file_id: str,
    current_user: EmailStr,
    collection: AsyncCollection
):
    # Check if the requested folder belongs to current_user
    find_owner_request = {"_id": ObjectId(file_id)}
    find_owner_response = await collection.find_one(find_owner_request)
    if find_owner_response is None:
        raise HTTPException(status_code=404, detail="Folder Not found")
    if find_owner_response["owner"] != current_user:
        raise HTTPException(status_code=403, detail="Not authorized")

    return find_owner_response


async def verify_parent_folder(
    parent_id: str,
    current_user: Annotated[EmailStr, Depends(security_manager.get_current_user)],
):
    parent_record = await get_file_from_db(parent_id, current_user, mongo.files)
    if not parent_record.get("is_folder"):
        raise HTTPException(status_code=404, detail="Folder not found")
    return parent_record

async def move_files_to_trash(
    files_to_delete: List[str],
    permanent=False
) -> None:
    if permanent:
        collection = mongo.trash
    else:
        collection = mongo.files

    # Load records from DB
    deleted_record_ids: Set[str] = set()

    # Delete records using DFS
    while len(files_to_delete) > 0:
        current_top = files_to_delete.pop(-1)
        current_top_id = ObjectId(current_top)

        # Push children to stack
        find_children_query = {"parent_id": str(current_top_id)}
        async for file_row in collection.find(find_children_query):
            child_file_id = str(file_row["_id"])
            if child_file_id not in deleted_record_ids:
                files_to_delete.append(child_file_id)

        # Delete current top from the collection
        delete_response = await collection.find_one_and_delete({"_id": current_top_id})
        if delete_response:
            deleted_record_ids.add(str(current_top_id))

            if permanent:
                if file_uri := delete_response.get("uri"):
                    try:
                        await mongo.file_bucket.delete(ObjectId(file_uri))
                    except NoFile:
                        ...
            else:
                delete_response["time_trashed"] = int(datetime.now(timezone.utc).timestamp())
                await mongo.trash.insert_one(delete_response)


def verify_deletion_request(param: DeleteFilesRequest):
    if not param.files or len(param.files) == 0:
        raise HTTPException(status_code=404, detail="File not found")

    return param
import mimetypes
from datetime import datetime, timezone
from typing import Annotated, List
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
    current_user: EmailStr,
    permanent=False
) -> None:
    if permanent:
        collection = mongo.trash
    else:
        collection = mongo.files

    # Load records from DB
    requested_records = []
    global_parent = None
    for requested_file in files_to_delete:
        record = await get_file_from_db(requested_file, current_user, collection)
        if global_parent:
            if record["parent_id"] != global_parent:
                raise HTTPException(status_code=400, detail="Must delete from the same parent folder")
        else:
            global_parent = record["parent_id"]

        requested_records.append(record)

    # Delete records using DFS
    while len(requested_records) > 0:
        current_top = requested_records.pop(-1)
        current_top_id = current_top.get("_id")

        # Push children to stack
        find_children_query = {"parent_id": str(current_top_id)}
        async for file_row in collection.find(find_children_query):
            requested_records.append(file_row)

        # Delete current top from the collection
        await collection.delete_one({"_id": current_top_id})

        if permanent:
            if file_uri := current_top.get("uri"):
                try:
                    await mongo.file_bucket.delete(ObjectId(file_uri))
                except NoFile:
                    ...
        else:
            current_top["time_trashed"] = int(datetime.now(timezone.utc).timestamp())
            await mongo.trash.insert_one(current_top)


def verify_deletion_request(param: DeleteFilesRequest):
    if not param.files or len(param.files) == 0:
        raise HTTPException(status_code=404, detail="File not found")

    return param
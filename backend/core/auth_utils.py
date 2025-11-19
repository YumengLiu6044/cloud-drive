from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError
from core.database import mongo
from models.db_models import UserModel, DriveModel


async def create_user(new_user: UserModel):
    try:
        insertion_result = await mongo.users.insert_one(new_user.__dict__)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="User already exists")

    root_folder = DriveModel(
        owner=new_user.email,
        parent_id="",
        name="My Drive",
        is_folder=True
    )
    root_insertion = await mongo.files.insert_one(root_folder.__dict__)
    if root_row_id := root_insertion.inserted_id:
        await mongo.users.update_one(
            {"email": new_user.email},
            {"$set": {"drive_root_id": str(root_row_id)}}
        )
    else:
        raise HTTPException(status_code=500, detail="Failed to create root folder")

    return insertion_result

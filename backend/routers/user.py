from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import FileResponse, StreamingResponse
from gridfs import NoFile

from core.constants import PROFILE_PICTURES_TEMPLATE, FALLBACK_PROFILE_PICTURE
from core.database import mongo
from core.file_utils import get_mime_type
from core.security import security_manager
from models.db_models import UserModel
from models.user_models import UserChangeNameRequest

user_router = APIRouter(prefix="/user", tags=["user"])

@user_router.post("/")
async def read_users_me(param: Annotated[str, Depends(security_manager.get_current_user)]):
    user_record = await mongo.users.find_one({"email": param})
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")

    user_obj = UserModel(**user_record)
    returned_user = user_obj.__dict__
    returned_user.pop("password")
    return returned_user

@user_router.post("/change-username")
async def change_username(
    param: UserChangeNameRequest,
    current_user: Annotated[str, Depends(security_manager.get_current_user)]
):
    user_email = current_user
    update_result = await mongo.users.update_one(
        {"email": user_email},
        {"$set": {"username": param.new_name}}
    )
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Username not found")

    return {
        "message": "Username changed successfully",
        "new_name": param.new_name
    }


@user_router.post("/upload-profile")
async def upload_profile(
    file: UploadFile,
    current_user: Annotated[str, Depends(security_manager.get_current_user)]
):
    bucket = mongo.profile_bucket
    bucket_file_name = PROFILE_PICTURES_TEMPLATE.format(current_user)

    # Find and remove existing profile picture
    user_record = await mongo.users.find_one({"email": current_user})
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")
    user_obj = UserModel(**user_record)
    if user_obj.profile_image_id:
        try:
            await bucket.delete(ObjectId(user_obj.profile_image_id))
        except NoFile:
            ...

    media_type = get_mime_type(file.filename)

    async with bucket.open_upload_stream(bucket_file_name, metadata={"contentType": media_type}) as stream:
        await stream.write(file.file)
        file_id = stream._id

    await mongo.users.update_one(
        {"email": current_user},
        {"$set": {"profile_image_id": str(file_id)}},
    )
    return {"message": "Profile uploaded successfully"}


@user_router.get("/profile/{file_id}")
async def get_profile_picture(
    file_id: str,
    current_user: Annotated[str, Depends(security_manager.get_current_user)]
):
    # Make sure the current_user owns the file
    user_record = await mongo.users.find_one({"email": current_user})
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")
    user_obj = UserModel(**user_record)
    if user_obj.profile_image_id != file_id:
        return FileResponse(FALLBACK_PROFILE_PICTURE, media_type=get_mime_type(FALLBACK_PROFILE_PICTURE))

    # Retrieve the file
    bucket = mongo.profile_bucket
    try:
        download_stream = await bucket.open_download_stream(ObjectId(file_id))
    except NoFile:
        return FileResponse(FALLBACK_PROFILE_PICTURE, media_type=get_mime_type(FALLBACK_PROFILE_PICTURE))

    return StreamingResponse(download_stream, media_type=download_stream.metadata["contentType"])

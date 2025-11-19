from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi_mail import MessageSchema, MessageType, FastMail
from core.auth_utils import create_user
from core.constants import JwtTokenScope, MAIL_CONFIG, jinja_env, TEMPLATE_NAME, \
    COMMON_TEMPLATE_VARIABLES, PASSWORD_RESET_TEMPLATE
from core.database import mongo
from core.file_utils import move_files_to_trash
from core.security import security_manager
from models.auth_models import (
    AuthLoginModel, Token,
    AuthRegisterModel, AuthForgotPasswordModel,
    AuthResetPasswordModel
)
from models.db_models import UserModel
from bson import ObjectId

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@auth_router.post("/login")
async def login_user(param: AuthLoginModel):
    user_record = await mongo.users.find_one({"email": param.email})
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")

    user_obj = UserModel(**user_record)
    if user_obj.is_google_account:
        raise HTTPException(status_code=403, detail="Please login using Google account")
    if not security_manager.verify_password(param.password, user_obj.password):
        raise HTTPException(status_code=401, detail="Password incorrect")

    token = security_manager.create_access_token(user_obj.email, JwtTokenScope.auth)
    return Token(access_token=token, scope=JwtTokenScope.auth)

@auth_router.post("/register")
async def register_user(param: AuthRegisterModel):
    hashed_password = security_manager.hash_password(param.password)
    inserted = UserModel(**param.model_dump())
    inserted.password = hashed_password
    insertion_result = await create_user(inserted)

    if insertion_result.inserted_id:
        token = security_manager.create_access_token(param.email, JwtTokenScope.auth)
        return Token(access_token=token, scope=JwtTokenScope.auth)
    else:
        raise HTTPException(status_code=500, detail="Failed to create user")

@auth_router.post("/forgot-password")
async def forgot_password(
    param: AuthForgotPasswordModel,
    background_tasks: BackgroundTasks
):
    user_email = param.email
    user_record = await mongo.users.find_one({"email": user_email})
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")
    elif user_record.get("is_google_account"):
        raise HTTPException(status_code=403, detail="Cannot reset password using Google account")

    forgot_token = security_manager.create_access_token(
        user_email,
        JwtTokenScope.password_reset
    )
    reset_link = PASSWORD_RESET_TEMPLATE.format(forgot_token)
    template = jinja_env.get_template(TEMPLATE_NAME)
    html_content = template.render(
        **COMMON_TEMPLATE_VARIABLES,
        email=user_email,
        reset_link=reset_link,
        year=datetime.now().year
    )
    message = MessageSchema(
        recipients=[user_email],
        body=html_content,
        subject="Reset your Cloud Drive password",
        subtype=MessageType.html
    )
    fm = FastMail(MAIL_CONFIG)
    background_tasks.add_task(fm.send_message, message)
    return {"message": "Password reset email sent"}

@auth_router.post("/reset-password")
async def reset_password(
    param: AuthResetPasswordModel,
    current_user_email: Annotated[str, Depends(security_manager.verify_reset_token)]
):
    new_hashed_password = security_manager.hash_password(param.new_password)
    result = await mongo.users.update_one(
        {"email": current_user_email},
        {"$set": {"password": new_hashed_password}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Password reset successful"}


@auth_router.post("/delete-account")
async def delete_account(
    current_user_email: Annotated[str, Depends(security_manager.get_current_user)]
):
    user_record = await mongo.users.find_one({"email": current_user_email})
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete user files
    drive_root_id = user_record.get("drive_root_id")
    await move_files_to_trash([drive_root_id], permanent=False)
    await move_files_to_trash([drive_root_id], permanent=True)

    # Delete user data
    deleted_record = await mongo.users.find_one_and_delete({"email": current_user_email})
    if profile_id := deleted_record.get("profile_image_id", None):
        await mongo.profile_bucket.delete(ObjectId(profile_id))

    return {"message": "Account deleted successfully"}
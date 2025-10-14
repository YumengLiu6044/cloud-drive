from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi_mail import MessageSchema, MessageType, FastMail
from pymongo.errors import DuplicateKeyError
from core.constants import JwtTokenScope, MAIL_CONFIG, jinja_env, TEMPLATE_NAME, \
    COMMON_TEMPLATE_VARIABLES, PASSWORD_RESET_TEMPLATE
from core.database import mongo
from core.security import security_manager
from models.auth_models import (
    AuthLoginModel, Token,
    AuthRegisterModel, AuthForgotPasswordModel,
    AuthResetPasswordModel
)
from models.db_models import UserModel, FileModel

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
    if not await mongo.users.find_one({"email": user_email}):
        raise HTTPException(status_code=404, detail="User not found")

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


async def create_user(new_user: UserModel):
    try:
        insertion_result = await mongo.users.insert_one(new_user.__dict__)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="User already exists")

    root_folder = FileModel(
        owner=new_user.email,
        parent_id="",
        file_name="My Drive",
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
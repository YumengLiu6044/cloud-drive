from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends
from fastapi_mail import MessageSchema, MessageType, FastMail
from pymongo.errors import DuplicateKeyError
from core.constants import JwtTokenScope, FRONTEND_URL, MAIL_CONFIG
from core.database import mongo
from core.security import security_manager
from models.auth_models import (
    AuthLoginModel, Token,
    AuthRegisterModel, AuthForgotPasswordModel,
    AuthResetPasswordModel
)
from models.db_models import UserModel

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
        raise HTTPException(status_code=404, detail="Password incorrect")

    token = security_manager.create_access_token(user_obj.email, scope=JwtTokenScope.auth)
    return Token(access_token=token, scope=JwtTokenScope.auth)

@auth_router.post("/register")
async def register_user(param: AuthRegisterModel):
    hashed_password = security_manager.hash_password(param.password)
    inserted = UserModel(**param.model_dump())
    inserted.password = hashed_password
    try:
        insertion_result = await mongo.users.insert_one(inserted.__dict__)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="User already exists")

    if insertion_result.inserted_id:
        token = security_manager.create_access_token(param.email, scope=JwtTokenScope.auth)
        return Token(access_token=token, scope=JwtTokenScope.auth)

    else:
        raise HTTPException(status_code=404, detail="Failed to create user")

@auth_router.post("/forgot-password")
async def forgot_password(param: AuthForgotPasswordModel):
    user_email = param.email
    forgot_token = security_manager.create_access_token(
        user_email,
        scope=JwtTokenScope.password_reset
    )
    reset_link = f"{FRONTEND_URL}/reset-password?token={forgot_token}"
    message = MessageSchema(
        recipients=[user_email],
        body=f"<p>Click <a href={reset_link}>this link</a> to reset your password</p>",
        subject="Reset your Cloud Drive password",
        subtype=MessageType.html
    )
    fm = FastMail(MAIL_CONFIG)
    await fm.send_message(message)
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

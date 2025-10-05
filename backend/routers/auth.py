from typing import Annotated
from fastapi import APIRouter, Query, HTTPException
from core.constants import USER_FIELDS
from core.database import mongo
from core.security import security_manager
from models.auth import AuthRegisterModel, AuthLoginModel

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@auth_router.post("/login")
async def login_user(param: Annotated[AuthLoginModel, Query()]):
    user_record = await mongo.users.find_one({"email": param.email})
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")

    password_on_file = user_record[USER_FIELDS.PASSWORD]
    if security_manager.verify_password(param.password, password_on_file):
        return {"message": "User logged in"}

    else:
        raise HTTPException(status_code=404, detail="Password incorrect")

@auth_router.post("/register")
async def register_user(param: Annotated[AuthRegisterModel, Query()]):
    if await mongo.users.find_one(param.email):
        return {"message": "User already registered"}

    hashed_password = security_manager.hash_password(param.password)
    inserted_data = {
        **param.model_dump(),
        USER_FIELDS.PASSWORD: hashed_password
    }
    insertion_result = await mongo.users.insert_one(inserted_data)

    if insertion_result.inserted_id:
        return {"message": "User registered"}
    else:
        raise HTTPException(status_code=400, detail="Failed to create user")

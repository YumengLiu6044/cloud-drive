from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError

from core.constants import USER_FIELDS
from core.database import mongo
from core.security import security_manager
from models.auth import AuthRegisterModel, AuthLoginModel

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@auth_router.post("/login")
async def login_user(param: AuthLoginModel):
    user_record = await mongo.users.find_one({"email": param.email})
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")

    password_on_file = user_record[USER_FIELDS.PASSWORD]
    if security_manager.verify_password(param.password, password_on_file):
        return {"message": "User logged in"}

    else:
        raise HTTPException(status_code=404, detail="Password incorrect")

@auth_router.post("/register")
async def register_user(param: AuthRegisterModel):
    hashed_password = security_manager.hash_password(param.password)
    inserted_data = param.model_dump()
    inserted_data[USER_FIELDS.PASSWORD] = hashed_password
    try:
        insertion_result = await mongo.users.insert_one(inserted_data)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="User already exists")

    if insertion_result.inserted_id:
        return {"message": "User registered"}
    else:
        raise HTTPException(status_code=404, detail="Failed to create user")
from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError
from core.database import mongo
from core.security import security_manager
from models.auth import UserModel, AuthLoginModel, Token, AuthRegisterModel

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@auth_router.post("/login")
async def login_user(param: AuthLoginModel):
    user_record = await mongo.users.find_one({"email": param.email})
    user_obj = UserModel(**user_record)
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")

    if not security_manager.verify_password(param.password, user_obj.password):
        raise HTTPException(status_code=404, detail="Password incorrect")

    token = security_manager.create_access_token(user_obj.email)
    return Token(access_token=token, token_type="bearer")

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
        token = security_manager.create_access_token(param.email)
        return Token(access_token=token, token_type="bearer")

    else:
        raise HTTPException(status_code=404, detail="Failed to create user")
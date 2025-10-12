from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from core.database import mongo
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
    return {
        "email": user_obj.email,
        "name": user_obj.username,
    }

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

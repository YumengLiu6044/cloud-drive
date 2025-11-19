from fastapi import APIRouter, HTTPException
from starlette.requests import Request
from authlib.integrations.starlette_client import OAuth
from fastapi.responses import RedirectResponse
from core.auth_utils import create_user
from core.constants import (
    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
    GOOGLE_SERVER_METADATA, GOOGLE_SCOPE, JwtTokenScope, FRONTEND_URL)
from core.database import mongo
from core.security import security_manager
from models.db_models import UserModel
from urllib.parse import quote

google_auth_router = APIRouter(
    prefix="/google-auth",
    tags=["google"]
)

oauth = OAuth()
google = oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url=GOOGLE_SERVER_METADATA,
    client_kwargs={"scope": " ".join(GOOGLE_SCOPE)},
)

@google_auth_router.get("/login")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await google.authorize_redirect(request, redirect_uri)

@google_auth_router.get("/test")
async def test_route():
    return {"message": "Google login test"}

@google_auth_router.get("/callback")
async def google_callback(request: Request):
    redirect_path = f"{FRONTEND_URL}/google-callback?"
    try:
        token = await google.authorize_access_token(request)
    except Exception as e:
        error_message = str(e)
        return RedirectResponse(url=redirect_path + f"error={quote(error_message)}", status_code=302)

    user_info = token.get("userinfo", {})
    user_data = {
        "email": user_info.get("email"),
        "username": user_info.get("name"),
        "password": "",
        "google_profile_url": user_info.get("picture"),
        "is_google_account": True,
    }
    user_record = await mongo.users.find_one({"email": user_data["email"]})
    if user_record:
        if not user_record.get("is_google_account"):
            error_message = "Please use password to login instead of Google account."
            return RedirectResponse(url=redirect_path + f"error={quote(error_message)}", status_code=302)
    else:
        try:
            await create_user(UserModel(**user_data))
        except HTTPException:
            error_message = "Failed to create user. Please try again later."
            return RedirectResponse(url=redirect_path + f"error={quote(error_message)}", status_code=302)

    jwt_token = security_manager.create_access_token(user_data["email"], JwtTokenScope.auth)
    return RedirectResponse(url=redirect_path + f"token={jwt_token}", status_code=302)
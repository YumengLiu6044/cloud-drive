from pydantic import BaseModel, Field, EmailStr

from core.constants import PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH

class AuthRegisterModel(BaseModel):
    email: EmailStr = Field(default=EmailStr, description="Email address")
    username: str = Field(default=None, description="Username")
    password: str = Field(
        default=str,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH
    )

class AuthLoginModel(BaseModel):
    email: EmailStr = Field(default=EmailStr, description="Email address")
    password: str = Field(default=str, description="Password")

class Token(BaseModel):
    access_token: str
    token_type: str

class UserModel(BaseModel):
    email: EmailStr = Field(default=EmailStr, description="Email address")
    username: str = Field(default=None, description="Username")
    password: str = Field(default=None, description="Password")
from typing import Annotated

from pydantic import BaseModel, Field, EmailStr, StringConstraints
from core.constants import PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH

class AuthRegisterModel(BaseModel):
    email: EmailStr = Field(default=EmailStr, description="Email address")
    username: str = Field(default=None, description="Username")
    password: Annotated[
        str,
        StringConstraints(
            min_length=PASSWORD_MIN_LENGTH,
            max_length=PASSWORD_MAX_LENGTH
        )
    ]


class AuthLoginModel(BaseModel):
    email: EmailStr = Field(default=EmailStr, description="Email address")
    password: Annotated[str, StringConstraints(min_length=1)]


class AuthForgotPasswordModel(BaseModel):
    email: EmailStr = Field(default=EmailStr, description="Email address")


class AuthResetPasswordModel(BaseModel):
    new_password: Annotated[
        str,
        StringConstraints(
            min_length=PASSWORD_MIN_LENGTH,
            max_length=PASSWORD_MAX_LENGTH
        )
    ]


class Token(BaseModel):
    access_token: str
    scope: str

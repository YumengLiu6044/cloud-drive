from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserModel(BaseModel):
    email: EmailStr = Field(default=EmailStr, description="Email address")
    username: str = Field(default=None, description="Username")
    password: str = Field(default=None, description="Password")
    drive_root_id: str = Field(default=None, description="Drive root folder ID")
    profile_image_id: str | None = Field(default=None, description="Profile image id")

class DriveModel(BaseModel):
    parent_id: str = Field(default=None, description="Parent ID")
    owner: EmailStr = Field(default=EmailStr, description="Owner")
    name: str = Field(default=None, description="File name")
    is_folder: bool = Field(default=False, description="Is folder")
    uri: str = Field(default=None, description="File URI")
    size: int = Field(default=None, description="Resource Size")
    last_modified: datetime = Field(default=None, description="The time that the resource was last modified")
    type: str = Field(default=None, description="The type of the file")
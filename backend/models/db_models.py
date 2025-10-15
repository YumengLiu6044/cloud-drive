from pydantic import BaseModel, EmailStr, Field


class UserModel(BaseModel):
    email: EmailStr = Field(default=EmailStr, description="Email address")
    username: str = Field(default=None, description="Username")
    password: str = Field(default=None, description="Password")
    drive_root_id: str = Field(default=None, description="Drive root folder ID")


class FileModel(BaseModel):
    parent_id: str = Field(default=None, description="Parent ID")
    owner: EmailStr = Field(default=EmailStr, description="Owner")
    name: str = Field(default=None, description="File name")
    is_folder: bool = Field(default=False, description="Is folder")
    uri: str = Field(default=None, description="File URI")
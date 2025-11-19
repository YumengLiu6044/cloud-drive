from pydantic import BaseModel, EmailStr, Field


class UserModel(BaseModel):
    email: EmailStr = Field(default=EmailStr, description="Email address")
    username: str = Field(default=None, description="Username")
    password: str = Field(default=None, description="Password")
    drive_root_id: str = Field(default=None, description="Drive root folder ID")
    profile_image_id: str | None = Field(default=None, description="Profile image id")
    is_google_account: bool = Field(default=False, description="Is Google account")
    google_profile_url: str | None = Field(default=None, description="Google profile url")


class DriveModel(BaseModel):
    parent_id: str = Field(default=None, description="Parent ID")
    owner: EmailStr = Field(default=EmailStr, description="Owner")
    name: str = Field(default=None, description="File name")
    is_folder: bool = Field(default=False, description="Is folder")
    uri: str | None = Field(default=None, description="File URI")
    size: int | None = Field(default=None, description="Resource Size")
    last_modified: int | None = Field(default=None, description="The UNIX timestamp that the resource was last modified")
    type: str | None = Field(default=None, description="The type of the file")

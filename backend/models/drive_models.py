from typing import List
from pydantic import BaseModel, Field


class ListContentModel(BaseModel):
    parent_id: str = Field(default=None, description="Parent ID")


class CreateFolderRequest(BaseModel):
    parent_id: str
    name: str


class DeleteFilesRequest(BaseModel):
    files: List[str] = Field(default_factory=list)


class MoveFilesRequest(BaseModel):
    files: List[str] = Field(default_factory=list)
    new_parent_id: str
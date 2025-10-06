from pydantic import BaseModel


class UserChangeNameRequest(BaseModel):
    new_name: str
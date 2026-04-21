from typing import Literal, Optional
from pydantic import BaseModel, field_validator, ConfigDict
from fastapi import Form

class UserBase(BaseModel):
    username: str
    full_name: str
    role: Literal["Admin", "Editor", "User"]
    is_active: bool
    profile_image: Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Username is required")
        if len(value) < 3:
            raise ValueError("Username must be at least 3 characters")
        if " " in value:
            raise ValueError("Username should not contain spaces")

        return value

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Full name is required")

        return value

class UserCreate(UserBase):
    password: Optional[str] = None

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserOut(UserCreate):
    id:int

    model_config = ConfigDict(from_attributes=True)


class LoginSchema(BaseModel):
    username: str
    password: str

class UserForm:
    def __init__(
        self,
        username: str = Form(...),
        full_name: str = Form(...),
        role: str = Form(...),
        is_active: bool = Form(...),
    ):
        self.username = username
        self.full_name = full_name
        self.role = role
        self.is_active = is_active

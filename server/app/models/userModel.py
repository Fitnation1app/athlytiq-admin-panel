from pydantic import BaseModel
from enum import Enum
from typing import Optional

class StatusEnum(str, Enum):
    active = "active"
    suspended = "suspended"

class Profile(BaseModel):
    profile_picture_url: Optional[str]
    display_name: Optional[str]

class User(BaseModel):
    id: str
    username: str
    email: str
    role: str
    status: StatusEnum
    phone_no: Optional[str]
    profile: Optional[Profile]

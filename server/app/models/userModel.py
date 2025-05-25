from pydantic import BaseModel
from enum import Enum

class StatusEnum(str, Enum):
    active = "active"
    suspended = "suspended"
class User(BaseModel):
    id: str
    username: str
    email: str
    role: str
    status: StatusEnum
    phone_no: str
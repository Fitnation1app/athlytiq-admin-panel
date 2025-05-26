from pydantic import BaseModel
from typing import Optional

class Community(BaseModel):
    id: str
    name: str
    image_url: str
    member_count: int
    creator_name: str
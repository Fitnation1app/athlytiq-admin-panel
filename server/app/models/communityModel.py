from pydantic import BaseModel
from typing import Optional

class Community(BaseModel):
    id: str
    name: str
    image_url: Optional[str] = None
    member_count: int
    community_status: str
    creator_name: str
    creator_phone: Optional[str] = None
    creator_email: Optional[str] = None  
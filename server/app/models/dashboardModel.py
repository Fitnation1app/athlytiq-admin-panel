from pydantic import BaseModel
from typing import List

class MonthlyPostCount(BaseModel):
    month: str
    post_count: int

class PostOverviewResponse(BaseModel):
    year: int
    post_overview: List[MonthlyPostCount]

from pydantic import BaseModel 
from typing import Optional
import uuid 

class Workout(BaseModel):
    id: str 
    name: str 
    description: str 
    imageUrl: str 
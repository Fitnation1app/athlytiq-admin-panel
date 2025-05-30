from pydantic import BaseModel
from uuid import UUID

class ReportedPost(BaseModel):
    reported_post_id: UUID    
    reported_userid: UUID       
    reportedby_userid: UUID      

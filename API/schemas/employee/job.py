from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowJob(BaseModel):
    id:str
    job_title:str
    job_desc: Optional[str]
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
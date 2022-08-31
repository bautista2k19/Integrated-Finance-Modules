from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowUserType(BaseModel):
    id:str
    user_type:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    #employee: ShowEmployee = []

    class Config:
        orm_mode = True
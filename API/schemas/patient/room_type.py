from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowRoomType(BaseModel):
    id : str
    name: str
    description: str
    fee: float
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
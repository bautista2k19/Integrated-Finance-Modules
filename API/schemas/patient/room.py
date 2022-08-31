from datetime import date, datetime, time
from typing import List, Optional
from API.schemas.patient.room_type import ShowRoomType

from pydantic import BaseModel

class ShowRoom(BaseModel):
    id : str
    room_number: str
    room_type_id: str
    description: str
    location:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    room_room_type: ShowRoomType = []

    class Config:
        orm_mode = True

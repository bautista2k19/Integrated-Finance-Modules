from datetime import date, datetime, time
from typing import List, Optional

from API.schemas.patient.room import ShowRoom
from API.schemas.patient.inpatient import ShowInpatient

from pydantic import BaseModel

class ShowRoomAdmission(BaseModel):
    id : str
    inpatient_id: str
    room_id: str
    admission_date: date
    discharge_date: date #this is date
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    room_admission_inpatient: ShowInpatient = []
    room_admission_room: ShowRoom = []
    
    class Config:
        orm_mode = True
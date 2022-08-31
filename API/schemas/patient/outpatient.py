from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

from API.schemas.patient.patient import ShowPatient

class ShowOutpatient(BaseModel):
    id : str
    outpatient_no: str
    patient_id: str
    walk_in_date: date
    purpose:str
    tests:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    
    outpatient_patient: ShowPatient = []
    
    class Config:
        orm_mode = True
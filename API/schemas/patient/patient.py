from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel


class ShowPatient(BaseModel):
    id:str
    first_name:str
    middle_name:Optional[str]
    last_name:str
    sex:str
    birthdate:date
    weight:str
    height:str
    blood_type:str
    guardian:str
    address:str
    contact_number:str
    patient_type:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
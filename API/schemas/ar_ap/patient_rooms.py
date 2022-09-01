from datetime import date, datetime, timedelta,time
# from time import time
from typing import List, Optional
from pydantic import BaseModel



class PatientRoom(BaseModel):  
    id:str
    room_number:str
    admission_id:str
    datetime_admitted:datetime

    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowPatientRoom(PatientRoom):
    class Config():
        orm_mode = True


class CreatePatientRoom(BaseModel):
    room_number:str
    admission_id:str
    datetime_admitted:datetime

    
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdatePatientRoom(BaseModel):
     
    room_number:str
    admission_id:str
    datetime_admitted:datetime

    updated_by: Optional[str] = None

    class Config():
        orm_mode = True

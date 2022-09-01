from datetime import date, datetime, timedelta
from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class Doctor_profile(BaseModel):
    doctor_id:str
    photo:Optional[str] = None
    label:str
    doctor_first_name:str
    doctor_middle_name:Optional[str] = None
    doctor_last_name:str
    doctor_home_address:Optional[str] = None
    doctor_location:Optional[str] = None
    doctor_mobile:Optional[str] = None
    doctor_schedule:Optional[str] = None
    specialization_id:str
  
 
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowDoctor_profile(Doctor_profile):
    class Config():
        orm_mode = True


class CreateDoctor_profile(BaseModel):
    photo:Optional[str] = None
    doctor_first_name:str
    doctor_middle_name:Optional[str] = None
    doctor_last_name:str
    doctor_home_address:Optional[str] = None
    doctor_location:Optional[str] = None
    doctor_mobile:Optional[str] = None
    doctor_schedule:Optional[str] = None
    specialization_id:str
 
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateDoctor_profile(BaseModel):
    doctor_first_name:str
    doctor_middle_name:Optional[str] = None
    doctor_last_name:str
    doctor_home_address:Optional[str] = None
    doctor_location:Optional[str] = None
    doctor_mobile:Optional[str] = None
    doctor_schedule:Optional[str] = None
    specialization_id:str

    updated_by : str

    class Config():
        orm_mode = True

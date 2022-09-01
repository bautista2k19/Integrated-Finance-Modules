from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel

from API.repository.ar_ap.inpatient_bills import update


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


class Treatment_type(BaseModel):
    id:str
    treatment_type_name:str
    description:str
    
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class TreatmentServiceName(BaseModel):
    id:str
    treatment_service_name:str
    treatment_types_id:str
    unit_price:float

    status : str
    created_by : str
    created_at : Optional[datetime] 
    updated_by : Optional[str]
    updated_at : Optional[datetime]  
    treatment_type_info:Treatment_type

    class Config():
        orm_mode = True


class Treatment(BaseModel):
    id:str
    treatment_no:str
    patient_id:str
    treatment_service_name_id:str
    doctor_profile_id:str
    description:Optional[str] = None
    quantity:float
    cancellation_return:Optional[float]
    room:Optional[str] = None
    session_no:Optional[str] = None
    session_datetime:datetime
    drug:Optional[str] = None
    dose:Optional[str] = None
    next_schedule:Optional[datetime] = None
    comments:Optional[str] = None
    status:str
    is_active:str
    created_at:datetime
    updated_at:Optional[datetime]

    physician: Doctor_profile
    treatment_name: TreatmentServiceName

    class Config():
        orm_mode = True


class ShowTreatment(Treatment):
    class Config():
        orm_mode = True


class CreateTreatment(BaseModel):
    patient_id:str
    treatment_service_name_id:str
    doctor_profile_id:str
    description:Optional[str] = None
    quantity:float
    room:Optional[str] = None
    session_no:Optional[str] = None
    session_datetime:datetime
    drug:Optional[str] = None
    dose:Optional[str] = None
    next_schedule:Optional[datetime] = None
    comments:Optional[str] = None
    status:str
    is_active:str

    created_at:datetime


    class Config():
        orm_mode = True

class UpdateTreatment(BaseModel):
    patient_id:str
    treatment_service_name_id:str
    doctor_profile_id:str
    description:Optional[str] = None
    quantity:float
    updated_at:datetime
  
    class Config():
        orm_mode = True

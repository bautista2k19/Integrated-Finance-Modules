from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class PatientRegistration(BaseModel):
    patient_id:str
    first_name:str
    middle_name:Optional[str]  #NEW1
    last_name:str
    sex:str
    birthday:date
    weight:str
    height:str
    blood_type:str
    guardian:str
    address:str
    contact_number:str
    medical_history_number:str
    dp_id:Optional[str] = None
    insurance_id:Optional[str] = None
    patient_type:str
    created_at:datetime
    updated_at:Optional[datetime]
   
    # status : str
    # created_by : str
    # created_at : datetime
    # updated_by : Optional[str]
    # updated_at : Optional[datetime]
   

    class Config():
        orm_mode = True


class ShowPatientRegistration(PatientRegistration):
    class Config():
        orm_mode = True


class CreatePatientRegistration(BaseModel):
    first_name:str
    middle_name:str
    last_name:str
    sex:str
    birthday:date
    weight:str
    height:str
    blood_type:str
    guardian:str
    address:str
    contact_number:str
    medical_history_number:str
    dp_id:Optional[str] = None
    insurance_id:Optional[str] = None
    patient_type:str
    created_at:datetime 



    # created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdatePatientRegistration(BaseModel):
    first_name:str
    middle_name:str
    last_name:str
    sex:str
    birthday:date
    weight:str
    height:str
    blood_type:str
    guardian:str
    address:str
    contact_number:str
    medical_history_number:str
    dp_id:Optional[str] = None
    insurance_id:Optional[str] = None
    patient_type:str


    class Config():
        orm_mode = True

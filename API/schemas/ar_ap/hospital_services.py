from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class HospitalServices(BaseModel):
    id:str
    patient_id:str
    hospital_service_name_id:str
    quantity:float
    date:date
    total_amount:float

    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime]  

    class Config():
        orm_mode = True


class ShowHospitalServices(HospitalServices):
    class Config():
        orm_mode = True


class CreateHospitalServices(BaseModel):
    patient_id:str
    hospital_service_name_id:str
    quantity:float
    date:date
    # total_amount:float

    created_by:str 
    created_at :datetime

    class Config():
        orm_mode = True

class UpdateHospitalServices(BaseModel):
    patient_id:str
    hospital_service_name_id:str
    quantity:float
    date:date
    total_amount:float

    updated_by:str

    class Config():
        orm_mode = True

from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class HospitalServiceName(BaseModel):
    id:str
    description_name:str
    unit_price:float
    
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowHospitalServiceName(HospitalServiceName):
    class Config():
        orm_mode = True


class CreateHospitalServiceName(BaseModel):
    description_name:str
    unit_price:float

    created_by:str 
    created_at :datetime

    class Config():
        orm_mode = True

class UpdateHospitalServiceName(BaseModel):
    description_name:str
    unit_price:float
    updated_by:str

    class Config():
        orm_mode = True

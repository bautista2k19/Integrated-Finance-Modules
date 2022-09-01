from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class TreatmentServiceName(BaseModel):
    id:str
    treatment_service_name:str
    treatment_types_id:str
    unit_price:float

    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowTreatmentServiceName(TreatmentServiceName):
    class Config():
        orm_mode = True


class CreateTreatmentServiceName(BaseModel):
    treatment_service_name:str
    treatment_types_id:str
    unit_price:float

    created_at : datetime
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateTreatmentServiceName(BaseModel):
    treatment_service_name:str
    treatment_types_id:str
    unit_price:float

    
    updated_by: Optional[str] = None
    updated_at :datetime

    class Config():
        orm_mode = True

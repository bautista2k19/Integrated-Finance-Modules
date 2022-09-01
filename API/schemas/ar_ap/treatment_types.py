from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



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


class ShowTreatment_type(Treatment_type):
    class Config():
        orm_mode = True


class CreateTreatment_type(BaseModel):
    treatment_type_name:str
    description:str
    
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateTreatment_type(BaseModel):
    treatment_type_name:str
    description:str
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True

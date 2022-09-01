from datetime import date, datetime, timedelta
from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class Specialization(BaseModel):
    specialization_id:str
    specialization_name:str
 
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowSpecialization(Specialization):
    class Config():
        orm_mode = True


class CreateSpecialization(BaseModel):
    specialization_name:str
 
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateSpecialization(BaseModel):
    specialization_name:str
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True

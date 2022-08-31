from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class TreatmentType(BaseModel):
    id : str
    name: str
    description: str
    fee: float
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowTreatmentType(TreatmentType):
    class Config():
        orm_mode = True


class CreateTreatmentType(BaseModel):
    name: str
    description: str
    fee: float
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateTreatmentType(BaseModel):
    name: str
    description: str
    fee: float
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True

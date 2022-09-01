from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class LabServiceName(BaseModel):
    id:str
    lab_service_name:str
    lab_test_types_id:str
    unit_price:float
       
    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str] = None
    update_at:Optional[datetime] = None
   
    class Config():
        orm_mode = True


class ShowLabServiceName(LabServiceName):
    class Config():
        orm_mode = True


class CreateLabServiceName(BaseModel):
    lab_service_name:str
    lab_test_types_id:str
    unit_price:float

    created_by: Optional[str] = None
    created_at:datetime

    class Config():
        orm_mode = True

class UpdateLabServiceName(BaseModel):
    lab_service_name:str
    lab_test_types_id:str
    unit_price:float
   
    updated_by:Optional[str] = None
    update_at:Optional[datetime] = None

    class Config():
        orm_mode = True

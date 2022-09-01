from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel


class Lab_test_type(BaseModel):
    id:str
    lab_test_type_name:str
    description:str
    
    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str] 
    updated_at:Optional[datetime]
   
    class Config():
        orm_mode = True


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
   
    lab_test_types_id_info:Lab_test_type

    class Config():
        orm_mode = True


class LabRequest(BaseModel):
    id:str
    lab_test_id:str
    patient_id:str
    lab_request_no:str
    quantity:float
    cancellation_return:Optional[float]

    is_active:str
    status:str
    created_at:datetime
    updated_at:Optional[datetime]

    lab_test_id_info:LabServiceName

    class Config():
        orm_mode = True


class ShowLabRequest(LabRequest):
    class Config():
        orm_mode = True


class CreateLabRequest(BaseModel):
    lab_test_id:str
    patient_id:str
    quantity:float

   
    created_at:datetime

    class Config():
        orm_mode = True

class UpdateLabRequest(BaseModel):
    lab_test_id:str
    patient_id:str
    lab_request_no:str

    updated_at:datetime
  
    class Config():
        orm_mode = True

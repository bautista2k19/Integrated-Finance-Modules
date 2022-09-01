from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel


class LabRequestBill(BaseModel):
    id:str
    invoice_no:str
    invoice_date:datetime
    inpatient_bill_id:Optional[str] 
    lab_requests_id:str
    total_amount:float
    cancellation_return:Optional[float]  

    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime] 


    class Config():
        orm_mode = True


class ShowLabRequestBill(LabRequestBill):
    class Config():
        orm_mode = True


class CreateLabRequestBill(BaseModel):

    lab_requests_id:str
    total_amount:float
    cancellation_return:Optional[float]  
    class Config():
        orm_mode = True


       

class UpdateLabRequestBill(BaseModel):
    invoice_date:datetime
    inpatient_bill_id:Optional[str] 
    lab_requests_id:str
    total_amount:float
    cancellation_return:Optional[float]  

    updated_by:str
    updated_at:datetime

    class Config():
        orm_mode = True

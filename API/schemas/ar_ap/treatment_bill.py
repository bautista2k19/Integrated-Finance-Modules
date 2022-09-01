from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel


class TreatmentBill(BaseModel):
    id:str
    invoice_no:str
    invoice_date:datetime
    inpatient_bill_id:Optional[str]  
    treatment_id:str
    total_amount:float
    cancellation_return:Optional[float] 


    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime] 


    class Config():
        orm_mode = True


class ShowTreatmentBill(TreatmentBill):
    class Config():
        orm_mode = True


class CreateTreatmentBill(BaseModel):
    # id: str
    treatment_id:str
    total_amount:float
    cancellation_return:Optional[float] 
    

    class Config():
        orm_mode = True

class UpdateTreatmentBill(BaseModel):
    # id:str
    # invoice_date:datetime
    # inpatient_bill_id:Optional[str]  
    treatment_id:str
    total_amount:float
    cancellation_return:Optional[float] 

    updated_by:str
    # updated_at:datetime

    class Config():
        orm_mode = True

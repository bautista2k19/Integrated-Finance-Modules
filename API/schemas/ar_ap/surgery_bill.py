from datetime import date, datetime, timedelta
from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class SurgeryBill(BaseModel):
    id: str
    invoice_no: str
    invoice_date:datetime
    inpatient_bill_id: Optional[str]
    surgery_id: str
    total_amount:float
    cancellation_return:Optional[float]
   
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowSurgeryBill(SurgeryBill):
    class Config():
        orm_mode = True


class CreateSurgeryBill(BaseModel):
    # invoice_no: str
    invoice_date: datetime
    inpatient_bill_id: Optional[str]
    surgery_id: str
    total_amount:float
    cancellation_return:Optional[float]
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateSurgeryBill(BaseModel):
    invoice_date: datetime
    inpatient_bill_id: Optional[str]
    surgery_id: str
    total_amount:float
    cancellation_return:float
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True

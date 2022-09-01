from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel


class RoomBill(BaseModel):
    id:str
    invoice_no:str
    invoice_date:datetime
    admission_id:str
    inpatient_bill_id:Optional[str] = None
    total_amount:float
  
    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime] 
 
    class Config():
        orm_mode = True


class ShowRoomBill(RoomBill):
    class Config():
        orm_mode = True


class CreateRoomBill(BaseModel):
    admission_id:str
    
    class Config():
        orm_mode = True

class UpdateRoomBill(BaseModel):
    invoice_date:datetime
    admission_id:str
    inpatient_bill_id:Optional[str] = None
    total_amount:float
    
    updated_by:str
    updated_at:datetime

    class Config():
        orm_mode = True

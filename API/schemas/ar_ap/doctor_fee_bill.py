from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel


class DoctorFeeBill(BaseModel):
    id:str
    invoice_no:str
    invoice_date:datetime
    inpatient_bill_id:Optional[str] 
    # doctor_fee_id:str
    actual_pf:float
    sc_pwd_discount:Optional[float] 
    philhealth:Optional[float] 
    discount:Optional[float] 
    hmo:Optional[float] 
    patient_due:float

    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime] 
 
    class Config():
        orm_mode = True


class ShowDoctorFeeBill(DoctorFeeBill):
    class Config():
        orm_mode = True


class CreateDoctorFeeBill(BaseModel):
    # invoice_date:datetime
    # inpatient_bill_id:Optional[str] 
    # doctor_id:str
    actual_pf:float
    sc_pwd_discount:Optional[float] 
    philhealth:Optional[float] 
    discount:Optional[float] 
    hmo:Optional[float] 
    patient_due:float
     
    # created_by:str 
    # created_at :datetime

    class Config():
        orm_mode = True

class UpdateDoctorFeeBill(BaseModel):
    invoice_date:datetime
    inpatient_bill_id:Optional[str] 
    # doctor_fee_id:str
    actual_pf:float
    sc_pwd_discount:Optional[float] 
    philhealth:Optional[float] 
    discount:Optional[float] 
    hmo:Optional[float] 
    
    updated_by:str
    updated_at:datetime

    class Config():
        orm_mode = True

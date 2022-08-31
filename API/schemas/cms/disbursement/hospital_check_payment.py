from datetime import date, datetime, time
from typing import List, Optional
from pydantic import BaseModel

class HospitalCheckPaymentBase(BaseModel):
    check_no: str
    check_date: date
    account_name: str
    account_no: str
    rt_number: str
    payee_name: str
    amount: float
    bank_name: str
    bank_address: str
    description: str

    class Config():
        orm_mode = True

class ShowHospitalCheckPayment(HospitalCheckPaymentBase):
    id: str
    check_status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class CreateHospitalCheckPayment(HospitalCheckPaymentBase):
    created_by : str
    class Config():
        orm_mode = True
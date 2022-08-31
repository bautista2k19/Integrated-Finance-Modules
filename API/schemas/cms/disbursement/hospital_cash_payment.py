from datetime import date, datetime, time
from typing import List, Optional
from pydantic import BaseModel


class HospitalCashPaymentBase(BaseModel):
    amount: Optional[float]
    class Config():
        orm_mode = True

class ShowHospitalCashPayment(HospitalCashPaymentBase):
    id: str
    cash_payment_no: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class CreateHospitalCashPayment(HospitalCashPaymentBase):
    created_by : str
    class Config():
        orm_mode = True
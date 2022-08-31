from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class PaymentTerm(BaseModel):
    id : str
    term_name: str
    description: Optional[str]
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowPaymentTerm(PaymentTerm):
    class Config():
        orm_mode = True


class CreatePaymentTerm(BaseModel):
    term_name: str
    description: Optional[str]
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdatePaymentTerm(BaseModel):
    term_name: str
    description: Optional[str]
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True

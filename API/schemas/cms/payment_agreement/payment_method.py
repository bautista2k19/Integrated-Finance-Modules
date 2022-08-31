from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class PaymentMethod(BaseModel):
    id : str
    method_name: str
    description: Optional[str]
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowPaymentMethod(PaymentMethod):
    class Config():
        orm_mode = True


class CreatePaymentMethod(BaseModel):
    method_name: str
    description: Optional[str]
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdatePaymentMethod(BaseModel):
    method_name: str
    description: Optional[str]
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True

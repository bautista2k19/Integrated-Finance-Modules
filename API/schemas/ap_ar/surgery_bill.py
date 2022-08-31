from datetime import date, datetime, time
from typing import List, Optional

from API.schemas.treatment.surgery import ShowSurgery
from API.schemas.ap_ar.inpatient_bill import ShowInpatientBill

from pydantic import BaseModel

class ShowSurgeryBill(BaseModel):
    id: str
    surgery_bill_no: str
    surgery_id: str
    inpatient_bill_id: str
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    surgery_bill_surgery: ShowSurgery = []
    surgery_bill_inpatient_bill: ShowInpatientBill = []

    class Config():
        orm_mode = True

    
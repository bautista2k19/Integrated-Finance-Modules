from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

from API.schemas.treatment.lab_request import ShowLabRequest
from API.schemas.ap_ar.inpatient_bill import ShowInpatientBill

class ShowLabRequestBill(BaseModel):
    id: str
    lab_request_bill_no: str
    lab_request_id: str
    inpatient_bill_id: str
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    request_bill_lab_request : ShowLabRequest = []
    request_bill_inpatient_bill: ShowInpatientBill = []

    class Config():
        orm_mode = True
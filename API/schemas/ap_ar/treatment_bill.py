from datetime import date, datetime, time
from typing import List, Optional

from API.schemas.treatment.treatment import ShowTreatment
from API.schemas.ap_ar.inpatient_bill import ShowInpatientBill

from pydantic import BaseModel

class ShowTreatmentBill(BaseModel):
    id: str
    treatment_bill_no: str
    treatment_id: str
    inpatient_bill_id: str
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    treatment_bill_treatment: ShowTreatment = []
    treatment_bill_inpatient_bill: ShowInpatientBill = []


    class Config():
        orm_mode = True
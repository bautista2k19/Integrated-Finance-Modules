from datetime import date, datetime, time
from typing import List, Optional
from API.schemas.patient.inpatient import ShowInpatient

from pydantic import BaseModel
from API.schemas.ap_ar.inpatient_bill import ShowInpatientBill



class ShowPrescriptionBill(BaseModel):
    id: str
    prescription_bill_no: str
    inpatient_bill_id: str
    inpatient_id: str
    billing_date: date
    medicine_amount: float
    medical_amount: float
    sub_total:float
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    prescription_bill_inpatient_bill: ShowInpatientBill = []
    prescription_bill_inpatient: ShowInpatient = []
   

    class Config():
        orm_mode = True
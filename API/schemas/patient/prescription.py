from datetime import date, datetime, time
from typing import List, Optional
 

from pydantic import BaseModel

from API.schemas.patient.medical_supply_prescription import ShowMedicalSuppPrescription
from API.schemas.patient.medicine_prescription import ShowMedicinePrescription

class ShowPrescription(BaseModel):
    id : str
    prescription_no: str
    inpatient_id: Optional[str]
    outpatient_id: Optional[str]
    date_prescribed: date
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    prescription_medicine_prescription : Optional[List[ShowMedicinePrescription]] = []
    prescription_medical_prescription : Optional[List[ShowMedicalSuppPrescription]] = []

    class Config:
        orm_mode = True
from datetime import date, datetime, time
from typing import List, Optional
from API.schemas.patient.outpatient import ShowOutpatient
from API.schemas.treatment.treatment_in_charge import ShowTreatmentInCharge

from API.schemas.treatment.treatment_type import ShowTreatmentType
from pydantic import BaseModel

class ShowTreatment(BaseModel):
    id: str
    treatment_no: str
    inpatient_id: Optional[str]
    outpatient_id: Optional[str]
    treatment_type_id: str
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]
    
    treatment_treatment_type: ShowTreatmentType = []
    treatment_outpatient: Optional[ShowOutpatient] = []
    treatment_treatment_in_charge: Optional[List[ShowTreatmentInCharge]] = []

    class Config():
        orm_mode = True
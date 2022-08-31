from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel
from API.schemas.patient.outpatient import ShowOutpatient

from API.schemas.treatment.lab_test_type import ShowLabTestType

class ShowLabRequest(BaseModel):
    id : str
    lab_request_no: str
    lab_test_type_id: str
    inpatient_id: Optional[str]
    outpatient_id: Optional[str]
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    lab_request_lab_test_type: ShowLabTestType = []
    lab_request_outpatient: Optional[ShowOutpatient] = []

    class Config():
        orm_mode = True
from datetime import date, datetime, time
from typing import List, Optional
from API.schemas.treatment.surgery_in_charge import ShowSurgeryInCharge

from API.schemas.treatment.surgery_type import ShowSurgeryType
from pydantic import BaseModel

class ShowSurgery(BaseModel):
    id: str
    surgery_no: str
    inpatient_id: str
    start_time: time
    end_time: time
    surgery_type_id:str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    surgery_surgery_type: ShowSurgeryType = []
    surgery_surgery_in_charge: Optional[List[ShowSurgeryInCharge]] = []

    class Config():
        orm_mode = True
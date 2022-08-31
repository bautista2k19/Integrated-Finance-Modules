from datetime import date, datetime, time
from typing import List, Optional

from API.schemas.patient.room_admission import ShowRoomAdmission
from API.schemas.ap_ar.inpatient_bill import ShowInpatientBill
from pydantic import BaseModel

class ShowRoomBill(BaseModel):
    id: str
    room_bill_no: str
    room_admission_id: str
    inpatient_bill_id: str
    no_of_days: int
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    room_bill_room_admission: ShowRoomAdmission = []
    room_bill_inpatient_bill: ShowInpatientBill = []

    class Config():
        orm_mode = True
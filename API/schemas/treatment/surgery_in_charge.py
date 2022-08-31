from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

from API.schemas.employee.employee import ShowEmployee

class ShowSurgeryInCharge(BaseModel):
    id: str
    surgery_id: str
    employee_id: str
    professional_fee: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    surgery_in_charge_employee : ShowEmployee = []

    class Config():
        orm_mode = True
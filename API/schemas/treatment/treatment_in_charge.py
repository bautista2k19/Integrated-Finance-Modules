from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

from API.schemas.employee.employee import ShowEmployee

class ShowTreatmentInCharge(BaseModel):
    id: str
    treatment_id: str
    employee_id: str
    professional_fee: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    treatment_in_charge_employee : ShowEmployee = []

    class Config():
        orm_mode = True
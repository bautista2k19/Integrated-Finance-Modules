from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowPurchaseRequisition(BaseModel):
    id: str
    purchase_requisition_number: str
    purpose: str
    date_requested: date
    department_id: str
    approved_by: str
    reason: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
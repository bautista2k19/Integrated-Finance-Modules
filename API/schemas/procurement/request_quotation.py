from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowRequestQuotation(BaseModel):
    id: str
    request_quotation_number: str
    vendor_id: str
    purchase_requisition_id: str
    message: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
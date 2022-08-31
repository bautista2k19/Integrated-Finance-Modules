from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowVendorProposal(BaseModel):
    id: str
    subtotal: Optional[str]
    discount: Optional[float]
    tax: Optional[float]
    total_amount: Optional[str]
    message: Optional[str]
    request_quotation_id: Optional[str]
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
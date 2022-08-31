from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowPurchaseRequisitionDetail(BaseModel):
    id: str
    purchase_requisition_id: str
    new_product_category: str
    new_product_name: str
    product_id: str
    quantity: int
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
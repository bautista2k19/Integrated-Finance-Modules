from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowPurchaseOrderDetail(BaseModel):
    id: str
    purchase_order_id: str
    product_name: str
    product_category: str
    quantity: int
    product_price: float
    total_cost: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowPurchaseOrder(BaseModel):
    id: str
    purchase_order_number: str
    vendor_bidding_item_id: Optional[str]
    order_date: date
    expected_delivery_date: date
    payment_method: str
    shipping_method: str
    notes: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowVendorBiddingItem(BaseModel):
    id: str
    product_name: Optional[str]
    quantity: Optional[int]
    product_category: Optional[str]
    product_bidding_price: Optional[str]
    total_cost: Optional[str]
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
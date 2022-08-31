from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowProduct(BaseModel):
    id: str
    product_category_id: str
    product_pic: str
    product_name: str
    product_details: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
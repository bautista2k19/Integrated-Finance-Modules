from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowSales(BaseModel):
    id: str
    product_name: str
    date: date
    gross_margin: float
    total_amount: float 
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
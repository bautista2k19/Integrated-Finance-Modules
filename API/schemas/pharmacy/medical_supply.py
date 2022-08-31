from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowMedicalSupply(BaseModel):
    id: str
    ms_product_name: str
    ms_quantity: int
    ms_manufactured_date: date
    ms_import_date: date
    ms_expire_date: date
    ms_manufacturer: str
    ms_batch_number: int
    ms_unit_price: float
    ms_tax: float
    ms_purpose: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowMedicine(BaseModel):
    id: str
    med_product_name: str
    med_quantity: int
    med_manufactured_date: date
    med_import_date: date
    med_expiration_date: date
    med_manufacturer: str
    med_batch_number: int
    med_unit_price: float
    med_tax: float
    med_purpose: str
    dosage: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
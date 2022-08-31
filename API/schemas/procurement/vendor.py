from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowVendor(BaseModel):
    id: str
    vendor_name: str
    region: str
    city: str
    street: str
    industry: str
    contact_person: str
    contact_number: str
    email: str
    password: str
    blacklist_reason: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
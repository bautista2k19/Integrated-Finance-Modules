from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowProductCategory(BaseModel):
    id: str
    category_name: str
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
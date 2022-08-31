from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowDischarge(BaseModel):
    id : str
    discharge_no: str
    inpatient_id: str
    discharge_date: date
    discharge_diagnosis:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
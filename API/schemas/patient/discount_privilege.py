from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

class ShowDiscountPrivilege(BaseModel):
    id : str
    patient_id: str
    phil_health_id: str
    end_of_validity: date
    senior_citizen_id: str
    municipality:str
    senior_citizen_id:str
    type_of_disability:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
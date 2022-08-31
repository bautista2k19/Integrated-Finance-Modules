from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

from API.schemas.pharmacy.medical_supply import ShowMedicalSupply

class ShowMedicalSuppPrescription(BaseModel):
    id : str
    medical_supply_prescription_no: str
    prescription_id: str
    medical_supply_id: str
    quantity: int
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
    medical_prescription_medical: ShowMedicalSupply = []
    class Config:
        orm_mode = True
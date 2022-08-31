from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

from API.schemas.pharmacy.medicine import ShowMedicine
class ShowMedicinePrescription(BaseModel):
    id : str
    medicine_prescription_no: str
    prescription_id: str
    medicine_id: str
    quantity: int
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
    medicine_prescription_medicine: ShowMedicine = []

    class Config:
        orm_mode = True


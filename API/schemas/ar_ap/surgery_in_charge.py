from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class SurgeryInCharge(BaseModel):
    id:str
    dr_in_charge_id:str
    head_surgeon_id:str
    nurse_charge_id:Optional[str] = None
    surgery_id:str

    status:str
    updated_at:datetime

    class Config():
        orm_mode = True


class ShowSurgeryInCharge(SurgeryInCharge):
    class Config():
        orm_mode = True


class CreateSurgeryInCharge(BaseModel):
    dr_in_charge_id:str
    head_surgeon_id:str
    nurse_charge_id:Optional[str] = None
    surgery_id:str

    updated_at:datetime

    class Config():
        orm_mode = True

class UpdateSurgeryInCharge(BaseModel):
    dr_in_charge_id:str
    head_surgeon_id:str
    nurse_charge_id:Optional[str] = None
    surgery_id:str

    status:str
    updated_at:datetime

    class Config():
        orm_mode = True

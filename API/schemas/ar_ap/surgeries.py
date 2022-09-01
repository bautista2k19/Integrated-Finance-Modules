from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class Surgery(BaseModel):
    id:str
    surgery_no:str
    patient_id:str
    room:Optional[str] = None
    surgery_type_id:str
    start_time:datetime
    end_time:datetime
    description:Optional[str] = None
    is_active:str
    status:str
    created_at:datetime
    updated_at:datetime

    class Config():
        orm_mode = True


class ShowSurgery(Surgery):
    class Config():
        orm_mode = True


class CreateSurgery(BaseModel):
    patient_id:str
    room:Optional[str] = None
    surgery_type_id:str
    start_time:datetime
    end_time:datetime
    description:Optional[str] = None
    is_active:str
    status:str
    created_at:datetime
    

    class Config():
        orm_mode = True

class UpdateSurgery(BaseModel):
    patient_id:str
    room:Optional[str] = None
    surgery_type:str
    start_time:datetime
    end_time:datetime
    description:Optional[str] = None
    is_active:str
    status:str
    
    updated_at:datetime

    class Config():
        orm_mode = True

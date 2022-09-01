from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class Surgery_type(BaseModel):
    id:str
    surgery_type_name:str
    description:str
    
    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str] 
    updated_at:Optional[datetime]
   
    class Config():
        orm_mode = True


class ShowSurgery_type(Surgery_type):
    class Config():
        orm_mode = True


class CreateSurgery_type(BaseModel):
    surgery_type_name:str
    description:str
    
    created_at:datetime
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateSurgery_type(BaseModel):
    surgery_type_name:str
    description:str
    status:str
   
    updated_by:Optional[str] = None
    update_at:Optional[datetime] = None

    class Config():
        orm_mode = True

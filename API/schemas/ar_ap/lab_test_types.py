from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class Lab_test_type(BaseModel):
    id:str
    lab_test_type_name:str
    description:str
    
    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str] 
    updated_at:datetime
   
    class Config():
        orm_mode = True


class ShowLab_test_type(Lab_test_type):
    class Config():
        orm_mode = True


class CreateLab_test_type(BaseModel):
    lab_test_type_name:str
    description:str
    status:str
    
    created_at:datetime
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateLab_test_type(BaseModel):
    lab_test_type_name:str
    description:str
    status:str
   
    updated_by:Optional[str] = None
    update_at:Optional[datetime] = None

    class Config():
        orm_mode = True

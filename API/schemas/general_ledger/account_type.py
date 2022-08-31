#Module
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

#recruitment_management
from API.schemas.employee.user import CreatorUpdater

class AccountTypeBase(BaseModel):
    name: str
    code: str
    description: str
        
class AccountTypeGet(AccountTypeBase):
    id: str
    status: str

    class Config():
        orm_mode = True
        
class AccountTypeGetAll(AccountTypeBase):
    id: str
    status: str
    created_at: datetime 
    updated_at: Optional[datetime]       
    created_by: str
    at_created_by: CreatorUpdater        
    at_updated_by: Optional[CreatorUpdater] 

    class Config():
        orm_mode = True

class AccountTypeGetForTable(BaseModel):
    draw: int
    recordsTotal: int
    recordsFiltered: int
    data: List[AccountTypeGet] = []

    class Config():
        orm_mode = True
        
class AccountTypeGetForSelect(BaseModel):
    id: str
    text: str
    code: str
           
    class Config():
        orm_mode = True
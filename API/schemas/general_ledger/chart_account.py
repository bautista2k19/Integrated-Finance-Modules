#Module
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

#recruitment_management
from API.schemas.employee.user import CreatorUpdater

class ChartAccountBase(BaseModel):
    account_title: str
    account_type: str
    account_number: str
    description: str

class ChartAccountGet(ChartAccountBase):
    id: str
    status: str

    class Config():
        orm_mode = True

class AccountTypeGet(BaseModel):
    id: str
    name: str
    code: str

    class Config():
        orm_mode = True

class ChartAccountGetAll(ChartAccountBase):
    id: str
    ca_account_type: AccountTypeGet
    status: str
    created_at: datetime 
    updated_at: Optional[datetime] 
    created_by: str      
    ca_created_by: CreatorUpdater        
    ca_updated_by: Optional[CreatorUpdater] 

    class Config():
        orm_mode = True

class ChartAccountGetForTable(BaseModel):
    draw: int
    recordsTotal: int
    recordsFiltered: int
    data: List[ChartAccountGet] = []

    class Config():
        orm_mode = True
        
class ChartAccountGetForSelect(BaseModel):
    id: str
    text: str
           
    class Config():
        orm_mode = True
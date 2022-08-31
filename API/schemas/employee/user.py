from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

from API.schemas.employee.employee import ShowEmployee, EmployeeCreatorUpdater
from API.schemas.employee.user_type import ShowUserType

class UserBase(BaseModel):

    email: str
    user_type_id: str
    employee_id: str

class CreateUser(UserBase):

    password: str

class User(UserBase):
    id: str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    user_type: ShowUserType = []
    employee: ShowEmployee = []
    
    class Config:
        orm_mode = True
        
class ShowUser(User):
    class Config:
        orm_mode = True

class UpdateUser(BaseModel):
    employee_id: str
    password: Optional[str] = None
    email: str
    user_type_id: str
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True
class UpdateEmail(BaseModel):
    password: str
    email: str
    updated_by: Optional[str] = None
    class Config():
        orm_mode = True

class UpdatePassword(BaseModel):
    password: str
    new_password:str
    updated_by: Optional[str] = None
    class Config():
        orm_mode = True

class CreatorUpdater(BaseModel):
    id: str
    employee: EmployeeCreatorUpdater = []

    class Config():
        orm_mode = True

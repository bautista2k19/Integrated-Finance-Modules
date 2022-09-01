from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID


class EmployeeInformation(BaseModel):
    id: str
    photo: str
    first_name: str
    middle_name: Optional[str]
    last_name: str
    extension_name: Optional[str]
    birthdate: date
    birthplace: str
    gender: str
    civil_status: str
    house_number: Optional[str]
    street: Optional[str]
    barangay: str
    city: str
    province: str
    country: str
    contact_number: str
    email: str
    department: str
    job: str
    hire_date: date
    manager: str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    class Config():
        orm_mode = True


class User(BaseModel):
    id: str
    employee_id: str
    #email: str
    username: str
    user_type: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    status:str
    employee_information: EmployeeInformation = []

    class Config():
        orm_mode = True


class ShowUser(User):
    class Config():
        orm_mode = True


class CreateUser(BaseModel):
    employee_id: str
    #email: str
    username: str
    password: str
    user_type: str
    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateUser(BaseModel):
    #email: str
    employee_id: str
    username: str
    password: Optional[str] = None
    user_type: str
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True
class UpdateUsername(BaseModel):
    password: str
    username: str
    updated_by: Optional[str] = None
    class Config():
        orm_mode = True

class UpdatePassword(BaseModel):
    password: str
    new_password:str
    updated_by: Optional[str] = None
    class Config():
        orm_mode = True
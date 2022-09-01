from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel
from fastapi import File, UploadFile


class UserCredentials(BaseModel):
    id: str
    username: str
    user_type: str

    class Config():
        orm_mode = True


class Employee(BaseModel):
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
    user_credentials: List[UserCredentials] = []

    class Config():
        orm_mode = True


class ShowEmployee(Employee):
    class Config():
        orm_mode = True


class CreateEmployee(BaseModel):
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
    created_by: Optional[str]

    class Config():
        orm_mode = True


class UpdateEmployee(BaseModel):
    first_name: str
    middle_name: str
    last_name: str
    extension_name: str
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
    updated_by: str

    class Config():
        orm_mode = True


class DeleteEmployee(BaseModel):
    updated_by: str

    class Config():
        orm_mode = True

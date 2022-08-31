from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

from API.schemas.employee.department import ShowDepartment
from API.schemas.employee.job import ShowJob


class EmployeeBase(BaseModel):
    photo: Optional[str]
    first_name: str
    middle_name: Optional[str]
    last_name: str
    extension_name: Optional[str]
    birth_date: date
    gender: str
    civil_status: str
    house_number: Optional[str]
    street: Optional[str]
    barangay: str
    city: str
    province: str
    region:str
    zip_code:str
    contact_number: str
    department_id: str
    job_id: str
    employee_type_id: str
    hire_date: date

    class Config:
        orm_mode = True

class ShowEmployee(EmployeeBase):
    id: str
    leave_balance:float
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    department: ShowDepartment = []
    job: ShowJob = []

    class Config:
        orm_mode = True


class CreateEmployee(EmployeeBase):
    created_by: Optional[str] = None

    class Config:
        orm_mode = True

class UpdateEmployee(EmployeeBase):
    created_by: Optional[str] = None

    class Config:
        orm_mode = True

class EmployeeCreatorUpdater(BaseModel):
    id: str
    first_name: str
    last_name: str
    middle_name: Optional[str]

    class Config():
        orm_mode = True

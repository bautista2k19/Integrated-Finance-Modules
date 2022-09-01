from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel
from fastapi import File, UploadFile

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

class Purchase_order(BaseModel):
    id: str
    purchase_order_number: str
    total_bill: float
    order_date: date
    expected_delivery_date: date
    payment_method: str
    notes: str
    status: str

  
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    updated_by_info: Optional[User]
    class Config():
        orm_mode = True


class ShowPurchase_order(Purchase_order):
    class Config():
        orm_mode = True


class CreatePurchase_order(BaseModel):
    id: str
    purchase_order_number: str
    total_bill: float
    order_date: date
    expected_delivery_date: date
    payment_method: str
    notes: str
     
 
    created_by: Optional[str] = None
 

    class Config():
        orm_mode = True


class UpdatePurchase_order(BaseModel):
    id: str
    purchase_order_number: str
    total_bill: float
    order_date: date
    expected_delivery_date: date
    payment_method: str
    notes: str
    status: str
     
 
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config():
        orm_mode = True


class DeletePurchase_order(BaseModel):
    updated_by: str

    class Config():
        orm_mode = True

class ApprovedPurchase_order(BaseModel):
    updated_by: str
    updated_at: Optional[datetime] = None

    class Config():
        orm_mode = True
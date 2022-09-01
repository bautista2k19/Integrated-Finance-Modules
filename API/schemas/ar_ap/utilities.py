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




class Utilities(BaseModel):
    id: str
    utility_type: str
    utility_name: str
    utility_bill: float
    due_date: date 
    payment_method: str
    notes: str
    status: str
 
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    user_credentials: List[UserCredentials] = []

    class Config():
        orm_mode = True


class ShowUtilities(Utilities):
    class Config():
        orm_mode = True


class CreateUtilities(BaseModel):

    id: str
    utility_type: str
    utility_name: str
    utility_bill: float
    due_date: date 
    payment_method: str
    notes: str
  
    created_by: Optional[str] = None
 

    class Config():
        orm_mode = True


class UpdateUtilities(BaseModel):

    id: str
    utility_type: str
    utility_name: str
    utility_bill: float
    due_date: date 
    payment_method: str
    notes: str
    status: str
      
    updated_by: Optional[str] = None
  
    class Config():
        orm_mode = True


class DeleteUtilities(BaseModel):
    updated_by: str

    class Config():
        orm_mode = True

class ApprovedUtilities(BaseModel):
    updated_by: str

    class Config():
        orm_mode = True
from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class Insurance(BaseModel):
    insurance_id:str
    policy_holder:Optional[str] = None
    policy_number:Optional[str] = None
    company_phone:Optional[str] = None
    company_address:Optional[str] = None
    remarks:Optional[str] = None
    created_at:Optional[datetime] = None
    updated_at:Optional[datetime] = None
   
    # status : str
    # created_by : str
    # created_at : datetime
    # updated_by : Optional[str]
    # updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowInsurance(Insurance):
    class Config():
        orm_mode = True


class CreateInsurance(BaseModel):
    policy_holder:Optional[str] = None
    policy_number:Optional[str] = None
    company_phone:Optional[str] = None
    company_address:Optional[str] = None
    remarks:Optional[str] = None
    created_at:Optional[datetime]= None
    updated_at:Optional[datetime]= None


    # created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateInsurance(BaseModel):
    remarks:Optional[str] = None
    updated_at:Optional[datetime]= None


    class Config():
        orm_mode = True

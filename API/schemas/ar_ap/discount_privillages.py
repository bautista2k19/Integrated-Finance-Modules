from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class Discount(BaseModel):
    dp_id:str
    ph_id:Optional[str] = None
    end_of_validity:Optional[str] = None
    sc_id:Optional[str] = None
    municipality:Optional[str] = None
    pwd_id:Optional[str] = None
    type_of_disability:Optional[str] = None

    created_at:Optional[datetime]= None
    updated_at:Optional[datetime]= None
   
    # status : str
    # created_by : str
    # created_at : datetime
    # updated_by : Optional[str]
    # updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowDiscount(Discount):
    class Config():
        orm_mode = True


class CreateDiscount(BaseModel):
    ph_id:Optional[str] = None
    end_of_validity:Optional[str] = None
    sc_id:Optional[str] = None
    municipality:Optional[str] = None
    pwd_id:Optional[str] = None
    type_of_disability:Optional[str] = None

    created_at: Optional[datetime] = None            ###created_by

    class Config():
        orm_mode = True

class UpdateDiscount(BaseModel):
    sc_id:Optional[str] = None
    municipality: Optional[str] = None
    pwd_id:Optional[str] = None


    updated_at: Optional[str] = None       ##update_by

    class Config():
        orm_mode = True

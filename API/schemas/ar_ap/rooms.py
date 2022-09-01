from datetime import date, datetime, timedelta
from lib2to3.pgen2.token import OP
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import Integer


class Room_type(BaseModel):
    id:str
    room_type_name:str
    description:str
    amount:float
    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str] = None
    update_at:Optional[datetime] = None
   
    class Config():
        orm_mode = True




class Room(BaseModel):
    room_id:str
    room_number:str
    date_admitted:datetime
    admission_id:str
    room_type_id:str
    location:Optional[str]
    room_count:Optional[int]
    room_status:str
    active_status:str
    created_at:datetime
    updated_at:Optional[datetime]

    room_type_info:Room_type

    class Config():
        orm_mode = True


class ShowRoom(Room):
    class Config():
        orm_mode = True


class CreateRoom(BaseModel):
    date_admitted:datetime
    admission_id:str
    room_type_id:str
    location:str
    room_count:int
    room_status:str
    active_status:str
    created_at:datetime

    class Config():
        orm_mode = True

class UpdateRoom(BaseModel):
    room_number:str
    room_type_id:Optional[str] = None
    room_status:str
    active_status:str
    updated_at:datetime

    class Config():
        orm_mode = True

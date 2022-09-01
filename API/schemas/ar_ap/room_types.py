from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



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


class ShowRoom_type(Room_type):
    class Config():
        orm_mode = True


class CreateRoom_type(BaseModel):
    room_type_name:str
    description:str
    amount:float
    status:str

    created_by: Optional[str] = None

    class Config():
        orm_mode = True

class UpdateRoom_type(BaseModel):
    room_type_name:str
    description:str
    amount:float
    status:str
   
    updated_by:Optional[str] = None
    update_at:Optional[datetime] = None

    class Config():
        orm_mode = True

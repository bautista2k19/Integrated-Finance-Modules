from datetime import date, datetime, time
from typing import List, Optional
from pydantic import BaseModel

class CountTotalPayment(BaseModel):
   

    class Config():
        orm_mode = True
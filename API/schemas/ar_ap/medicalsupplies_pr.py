from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



class MedicalSupplies_PR(BaseModel):
    medicsupp_prid:str
    ms_no:int
    medical_id:Optional[str] 
    quantity:int
    prescription_id:Optional[str] 

    status:str
    created_by:Optional[str]  
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime]  
  


    class Config():
        orm_mode = True


class ShowMedicalSupplies_PR(MedicalSupplies_PR):
    class Config():
        orm_mode = True


class CreateMedicalSupplies_PR(BaseModel):
    medical_id:Optional[str] 
    quantity:int
    prescription_id:Optional[str] 
   
    created_by:Optional[str]  
    created_at:datetime

    class Config():
        orm_mode = True

class UpdateMedicalSupplies_PR(BaseModel):
    medical_id:Optional[str] 
    quantity:int
    prescription_id:Optional[str] 

    updated_by:Optional[str]  
    updated_at:Optional[datetime]   

    
  
    class Config():
        orm_mode = True

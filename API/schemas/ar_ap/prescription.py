from datetime import date, datetime, timedelta
from turtle import st
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID

from starlette import status


class Medicine(BaseModel):
    id:str
    med_product_name : str
    med_quantity : int
    med_manufacturer : Optional[str]  
    med_manufactured_date : date
    med_import_date : date
    med_expiration_date : date
    med_batch_number: int
    med_unit_price: float
    med_tax: int
    med_purpose: str
    dosage:int
    condition: str 
    status: str  
    created_by: Optional[str]  
    created_at: datetime
    updated_by: Optional[str] 
    updated_at: Optional[datetime]  
    
    class Config():
        orm_mode = True




class Medicine_PR(BaseModel):
    medpr_id:str
    medicine_no:int
    medicine_id:Optional[str]  
    quantity:int
    prescription_id:Optional[str]  
    cancellation_return: float   #NEW1

    intake:Optional[str] 
    frequency:Optional[str] 
    dosage:Optional[str] 
    doctor_prescribed:Optional[str] 
    prescription_id:Optional[str] 
    med_pres_status:Optional[str] 


    created_by:Optional[str]  
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime]

    medicine_info:Medicine 
  
    class Config():
        orm_mode = True




class Prescription(BaseModel):
    prescription_id:str
    prescription_no:str
    admission_id:str
    outpatient_id:Optional[str] 
    date_prescribed:date
    patient_status:Optional[str] 
    status: str
    created_by: Optional[str]  
    created_at: datetime
    updated_by: Optional[str]  
    updated_at: Optional[datetime]  

    medicines_prescription:  Optional[List[Medicine_PR]]
   
    class Config():
        orm_mode = True

class ShowPrescription(Prescription):
    class Config():
        orm_mode = True

class CreatePrescription(BaseModel):
    admission_id:str
    date_prescribed:date
    status: str = "Unpaid"

    created_by : str
    created_at: datetime

    class Config():
        orm_mode = True

class UpdatePrescription(BaseModel):
    admission_id:str
    date_prescribed:date
    status: str = "Unpaid"


    updated_by : str
    updated_at: Optional[datetime] 
    class Config():
        orm_mode = True
    

class DeletePrescription(BaseModel):
   updated_by: str
   class Config():
        orm_mode = True




from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel



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

    # medicines_prescription:  Optional[List[Medicine_PR]]
   
    class Config():
        orm_mode = True




class Medicine(BaseModel):
    id:str
    med_product_name : str
    med_quantity : int
    med_manufacturer : Optional[str] = None
    med_manufactured_date : date
    med_import_date : date
    med_expiration_date : date
    med_batch_number: int
    med_unit_price: float
    med_tax: int
    med_purpose: str
    dosage:int
    condition: str = "No issue"
    status: str = "High"
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    # manufacturer_information: ManufacturerInformation = []
    # invoice_info: List[InvoiceInformation] = []
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

    prescription_info: Prescription 
    medicine_info:Medicine
  


    class Config():
        orm_mode = True


class ShowMedicine_PR(Medicine_PR):
    class Config():
        orm_mode = True


class CreateMedicine_PR(BaseModel):
    medicine_id:Optional[str]  
    quantity:int
    prescription_id:Optional[str]  
   
    created_by:Optional[str]  
    created_at:datetime

    class Config():
        orm_mode = True

class UpdateMedicine_PR(BaseModel):
    medicine_id:Optional[str]  
    quantity:int
    prescription_id:Optional[str] 

    updated_by:Optional[str]  
    updated_at:Optional[datetime]   

    
  
    class Config():
        orm_mode = True

from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID

from starlette import status

class ManufacturerInformation(BaseModel):
    id: str
    manufacturer_name : str
    mfg_license : str
    email_address : str
    contact_num : str
    manufacturer_address : str
    status: str 
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    class Config():
        orm_mode = True

class InvoiceInformation(BaseModel):
    id:str
    
  
   
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
    manufacturer_information: ManufacturerInformation = []
    invoice_info: List[InvoiceInformation] = []
    class Config():
        orm_mode = True

class ShowMedicine(Medicine):
    class Config():
        orm_mode = True

class CreateMedicine(BaseModel):
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
    created_by : str
    class Config():
        orm_mode = True

class UpdateMedicine(BaseModel):
    med_product_name : str
    med_quantity : int
    med_manufacturer : str
    med_manufactured_date : date
    med_import_date : date
    med_expiration_date : date
    med_batch_number: int
    med_unit_price: float
    med_tax: int
    med_purpose: str
    dosage:int
    status: str = "High"
    condition: str = "No issue"
    updated_by : str
    class Config():
        orm_mode = True
    

class DeleteMedicine(BaseModel):
   updated_by: str
   class Config():
        orm_mode = True




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


class MedicalSupplies(BaseModel):
    id:str
    ms_product_name : str
    ms_quantity : int
    ms_manufacturer : Optional[str] = None
    ms_manufactured_date : date
    ms_import_date : date
    ms_expiration_date : date
    ms_batch_number: int
    ms_unit_price: float
    ms_tax: int
    ms_purpose: str
    #dosage:int
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

class ShowMedicalSupplies(MedicalSupplies):
    class Config():
        orm_mode = True

class CreateMedicalSupplies(BaseModel):
    ms_product_name : str
    ms_quantity : int
    ms_manufacturer : Optional[str] = None
    ms_manufactured_date : date
    ms_import_date : date
    ms_expiration_date : date
    ms_batch_number: int
    ms_unit_price: float
    ms_tax: int
    ms_purpose: str
   # dosage:int
    condition: str = "No issue"
    status: str = "High"
    created_by : str
    class Config():
        orm_mode = True

class UpdateMedicalSupplies(BaseModel):
    ms_product_name : str
    ms_quantity : int
    ms_manufacturer : str
    ms_manufactured_date : date
    ms_import_date : date
    ms_expiration_date : date
    ms_batch_number: int
    ms_unit_price: float
    ms_tax: int
    ms_purpose: str
    #dosage:int
    status: str = "High"
    condition: str = "No issue"
    updated_by : str
    class Config():
        orm_mode = True
    

class DeleteMedicalSupplies(BaseModel):
   updated_by: str
   class Config():
        orm_mode = True




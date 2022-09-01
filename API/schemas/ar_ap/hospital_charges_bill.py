from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel


class HospitalServices(BaseModel):
    id:str
    patient_id:str
    hospital_service_name_id:str
    quantity:float
    date:date
    total_amount:float

    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime]  

    class Config():
        orm_mode = True

class HospitalChargesBill(BaseModel):
    id:str
    invoice_no:str
    invoice_date:datetime
    inpatient_bill_id:Optional[str] = None
    hospital_services_id:str
    total_amount:float
    cancellation_return:Optional[float] = None 

    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime] 

    hospital_charges_id_info: HospitalServices

    class Config():
        orm_mode = True


class ShowHospitalChargesBill(HospitalChargesBill):
    class Config():
        orm_mode = True


class CreateHospitalChargesBill(BaseModel):
    invoice_date:datetime
    cancellation_return:Optional[float] = None 

    class Config():
        orm_mode = True

class UpdateHospitalChargesBill(BaseModel):
    invoice_date:datetime
    inpatient_bill_id:Optional[str] = None
    hospital_services_id:str
    total_amount:float
    cancellation_return:Optional[float] = None 


    updated_by:str

    class Config():
        orm_mode = True

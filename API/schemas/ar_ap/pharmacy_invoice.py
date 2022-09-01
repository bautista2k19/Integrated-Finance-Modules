from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID

from starlette import status


#Medical SUpplies Prescription

class MedicalSuppliesInfo(BaseModel):
    id:str
    ms_product_name: str
    ms_unit_price: float
    class Config():
        orm_mode = True

class MedicalSuppliesPR(BaseModel):
    medicsupp_prid:str
    ms_no: int
    prescription_id : str
    medical_id: str
    quantity: int
    medical_info: MedicalSuppliesInfo = []
    class Config():
        orm_mode = True

#Medicine Prescription

class MedicineInfo(BaseModel):
    id:str
    med_product_name: str
    med_unit_price: float
    class Config():
        orm_mode = True

class MedicinePR(BaseModel):
    medpr_id:str
    medicine_no: int
    prescription_id : str
    medicine_id: str
    quantity: int
    
    medicine_info: MedicineInfo = []
    class Config():
        orm_mode = True



#Prescriptions
class Prescription(BaseModel):
    prescription_id:str
    prescription_no : str
    admission_id : str
    date_prescribed: date
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    medicines_prescription: List[MedicinePR] = []
    medical_prescription:  List[MedicalSuppliesPR] = []
    
    class Config():
        orm_mode = True

class ShowPrescription(Prescription):
    class Config():
        orm_mode = True

class CreatePrescription(BaseModel):
    admission_id : str
    created_by: Optional[str] = None
    created_at: datetime
   

    class Config():
        orm_mode = True

#Patient Info (for testing)
class PatientInfo(BaseModel):
    patient_id:str
    full_name: str
    class Config():
        orm_mode = True

#Inaptient Info (testing)
class InpatientInfo(BaseModel):
    admission_id:str
    inpatient_no:str
    patient_id : str
    date_admitted: date
    status:str
    patient_info: PatientInfo = []
    my_prescriptions: List[Prescription] = []
   
    class Config():
        orm_mode = True

#INPATIENT PRESCRIPTIONS
class InpatientPrescription(BaseModel):
    id:str
    inpatient_prescription_no : str
    admission_id : str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
    inpatient_prescriptions: InpatientInfo = []
    # invoice_info : List[PharmacyInvoice] = []
    class Config():
        orm_mode = True

#CREATE INPATIENT PRESCRIPTION FOR PHARMACY RECORDS
class CreateInpatientPrescription(BaseModel): 
    # invoice_no : str
    admission_id: str
    created_by: Optional[str] = None
    created_at: datetime
    class Config():
        orm_mode = True


#INPATIENT INVOICE PRESCRIPTION
class PharmacyInvoice(BaseModel): 
    id:str
    invoice_no : str
    admission_id : str
    invoice_date : date
    medicine_amount: float
    medical_amount : float
    subtotal: float
    total_amount:float
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    inpatient_info: InpatientInfo = []

    class Config():
        orm_mode = True

class CreateInvoice(BaseModel): 
    # invoice_no : str
    admission_id : str
    invoice_date : date
    medicine_amount: float
    medical_amount : float
    subtotal: float
    total_amount:float
    created_by: Optional[str] = None
    created_at: datetime
    class Config():
        orm_mode = True

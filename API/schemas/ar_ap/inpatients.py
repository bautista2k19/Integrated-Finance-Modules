from datetime import date, datetime, timedelta,time
from lib2to3.pgen2.token import OP
from typing import List, Optional
from pydantic import BaseModel
# import time
from . import inpatient_bills

 
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













class Doctor_profile(BaseModel):
    doctor_id:str
    photo:Optional[str] = None
    label:str
    doctor_first_name:str
    doctor_middle_name:Optional[str] = None
    doctor_last_name:str
    doctor_home_address:Optional[str] = None
    doctor_location:Optional[str] = None
    doctor_mobile:Optional[str] = None
    doctor_schedule:Optional[str] = None
    specialization_id:str
  
 
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class Treatment_type(BaseModel):
    id:str
    treatment_type_name:str
    description:str
    
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class TreatmentServiceName(BaseModel):
    id:str
    treatment_service_name:str
    treatment_types_id:str
    unit_price:float

    status : str
    created_by : str
    created_at : Optional[datetime] 
    updated_by : Optional[str]
    updated_at : Optional[datetime]  
    treatment_type_info:Treatment_type

    class Config():
        orm_mode = True

class Treatment(BaseModel):
    id:str
    treatment_no:str
    patient_id:str
    treatment_service_name_id:str
    doctor_profile_id:str
    description:Optional[str] = None
    quantity:float
    cancellation_return:Optional[float]
    room:Optional[str] = None
    session_no:Optional[str] = None
    session_datetime:datetime
    drug:Optional[str] = None
    dose:Optional[str] = None
    next_schedule:Optional[datetime] = None
    comments:Optional[str] = None
    status:str
    is_active:str
    created_at:datetime
    updated_at:Optional[datetime]

    physician: Doctor_profile
    treatment_name: TreatmentServiceName

    class Config():
        orm_mode = True

class PatientRegistration(BaseModel):
    patient_id:str
    first_name:str
    middle_name:Optional[str] 
    last_name:str
    sex:str
    birthday:date
    weight:str
    height:str
    blood_type:str
    guardian:str
    address:str
    contact_number:str
    medical_history_number:str
    dp_id:Optional[str] = None
    insurance_id:Optional[str] = None
    patient_type:str
    created_at:datetime
    updated_at:Optional[datetime]

    treatments:List[Treatment] =[]

    class Config():
        orm_mode = True


class TreatmentBill(BaseModel):
    id:str
    invoice_no:str
    invoice_date:datetime
    inpatient_bill_id:Optional[str]  
    treatment_id:str
    total_amount:float
    cancellation_return:Optional[float] 


    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime] 

    treatment_id_info:Treatment

    class Config():
        orm_mode = True

class DoctorFeeBill(BaseModel):
    id:str
    invoice_no:str
    invoice_date:datetime
    inpatient_bill_id:Optional[str] 
    doctor_id:str
    actual_pf:float
    sc_pwd_discount:Optional[float] 
    philhealth:Optional[float] 
    discount:Optional[float] 
    hmo:Optional[float] 
    patient_due:float

    status:str
    created_by:str
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime] 
 
    class Config():
        orm_mode = True

class InpatientBill(BaseModel):
    id:str
    inpatient_bill_no:str
    admission_id:str
    inpatient_payment_id:Optional[str]
    date_of_billing:date
    due_date:date
    balance_due:float
  
    status:str
    created_by:Optional[str]  
    created_at:datetime
    updated_by:Optional[str]  
    updated_at:Optional[datetime] 
 
    bill_doctor_fee:List[DoctorFeeBill]=[]
    bill_treatments:List[TreatmentBill]=[]

 
    class Config():
        orm_mode = True

class DischargeManagement(BaseModel):
    discharge_id:str
    discharge_no:str
    patient_id:Optional[str] 
    admission_id: Optional[str]  
    reason_of_admittance:str
    diagnosis_at_admittance:str
    date_admitted:datetime
    treatment_summary:str
    discharge_date:Optional[datetime]  
    physician_approved:str
    discharge_diagnosis:str
    further_treatment_plan:str
    next_check_up_date:Optional[date] 
    client_consent_approval:str

    active_status:Optional[str] 
    created_at:datetime
    updated_at:Optional[datetime]

    # discharge_managementFk:Optional[InpatientDischarge]

    class Config():
        orm_mode = True


class Inpatient(BaseModel):
    admission_id:str
    inpatient_no:str
    patient_id:Optional[str] = None
    # room_number:Optional[str] 
    date_admitted:datetime
    reason_of_admittance:Optional[str] = None
    department:Optional[str] = None
    diagnosis:Optional[str] = None
    tests:Optional[str] = None
    treatments:Optional[str] = None
    surgery:Optional[str] = None
    patient_status:Optional[str] = None
    created_at:datetime
    updated_at:Optional[datetime]

    admission_info:List[Room]=[] 
    patient_info:Optional[PatientRegistration]
    inpatient_bill_info:List[InpatientBill]

    
    # discharge_management_info:Optional [DischargeManagement]= None
   

    class Config():
        orm_mode = True


class ShowInpatient(Inpatient):
    class Config():
        orm_mode = True


class CreateInpatient(BaseModel):

    patient_id:Optional[str] = None
    # room_number:Optional[str] 
    # room_transfer_id:Optional[str] = None
    date_admitted:datetime
    reason_of_admittance:Optional[str] = None
    department:Optional[str] = None
    diagnosis:Optional[str] = None
    tests:Optional[str] = None
    treatments:Optional[str] = None
    surgery:Optional[str] = None
    patient_status:Optional[str] = None

    # inpatient_bill_info:inpatient_bills.CreateInpatientBill

    # created_by: Optional[datetime] = None

    class Config():
        orm_mode = True

class UpdateInpatient(BaseModel):
    patient_id:Optional[str] = None
    # room_number:Optional[str] 
    # room_transfer_id:Optional[str] = None
    date_admitted:datetime
    reason_of_admittance:Optional[str] = None
    department:Optional[str] = None
    diagnosis:Optional[str] = None
    tests:Optional[str] = None
    
    class Config():
        orm_mode = True

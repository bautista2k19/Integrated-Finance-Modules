from datetime import date, datetime
from lib2to3.pgen2.token import OP
from typing import List, Optional
from pydantic import BaseModel
from fastapi import File, UploadFile, datastructures
from sqlalchemy.sql.sqltypes import Date




class InpatientDischarge(BaseModel):
    patient_id:str
    first_name:str
    middle_name:str
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

    discharge_managementFk:Optional[InpatientDischarge]

    class Config():
        orm_mode = True


class ShowDischargeManagement(DischargeManagement):
    class Config():
        orm_mode = True


class CreateDischargeManagement(BaseModel):
    patient_id:Optional[str] 
    admission_id: Optional[str]  
    reason_of_admittance:str
    diagnosis_at_admittance:str
    # date_admitted:datetime
    treatment_summary:str
    discharge_date:Optional[datetime]  
    physician_approved:str
    discharge_diagnosis:str
    further_treatment_plan:str
    next_check_up_date:Optional[date] 
    client_consent_approval:str

    created_at:datetime

    class Config():
        orm_mode = True


class UpdateDischargeManagement(BaseModel):

    patient_id:Optional[str] 
    admission_id: Optional[str]  
    reason_of_admittance:str
    diagnosis_at_admittance:str
    # date_admitted:datetime
    treatment_summary:str
    discharge_date:Optional[datetime]  
    physician_approved:str
    discharge_diagnosis:str
    further_treatment_plan:str
    next_check_up_date:Optional[date] 
    client_consent_approval:str

    active_status:Optional[str] 
    # created_at:datetime
    updated_at:datetime



    class Config():
        orm_mode = True


class DeleteDischargeManagement(BaseModel):
    updated_by: str

    class Config():
        orm_mode = True

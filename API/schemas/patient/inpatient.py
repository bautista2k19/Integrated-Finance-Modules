from datetime import date, datetime, time
from typing import List, Optional

from API.schemas.patient.patient import ShowPatient
# from cms_sys.API.schemas.patient.room_admission import ShowRoomAdmission
# from cms_sys.API.schemas.ap_ar.inpatient_bill import ShowInpatientBill


from pydantic import BaseModel

from API.schemas.patient.prescription import ShowPrescription
class ShowPrescriptionBillInpatient(BaseModel):
    id: str
    prescription_bill_no: str
    inpatient_bill_id: str
    inpatient_id: str
    billing_date: date
    medicine_amount: float
    medical_amount: float
    sub_total:float
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowInpatient(BaseModel):
    id : str
    inpatient_no: str
    patient_id: str
    date_admitted: date
    reason_admittance:str
    department:str
    diagnosis:str
    tests:str
    treatment:str
    surgery:str
    patient_status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    inpatient_patient: ShowPatient = []
    inpatient_prescription: Optional[List[ShowPrescription]] = []

    class Config:
        orm_mode = True

class ShowInpatientPrescriptionBill(ShowInpatient):
    inpatient_prescription_bill: List[ShowPrescriptionBillInpatient] 
    
    class Config:
        orm_mode = True

#Show Inpatient Bill with room bill
class ShowRoomBill(BaseModel):
    id: str
    room_bill_no: str
    room_admission_id: str
    inpatient_bill_id: str
    no_of_days: int
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    # room_bill_room_admission: ShowRoomAdmission = []
    # room_bill_inpatient_bill: ShowInpatientBill = []

    class Config():
        orm_mode = True


class ShowLabRequestBill(BaseModel):
    id: str
    lab_request_bill_no: str
    lab_request_id: str
    inpatient_bill_id: str
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    # request_bill_lab_request : ShowLabRequest = []
    # request_bill_inpatient_bill: ShowInpatientBill = []

    class Config():
        orm_mode = True

class ShowTreatmentBill(BaseModel):
    id: str
    treatment_bill_no: str
    treatment_id: str
    inpatient_bill_id: str
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    # treatment_bill_treatment: ShowTreatment = []
    # treatment_bill_inpatient_bill: ShowInpatientBill = []


    class Config():
        orm_mode = True

class ShowSurgeryBill(BaseModel):
    id: str
    surgery_bill_no: str
    surgery_id: str
    inpatient_bill_id: str
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    # surgery_bill_surgery: ShowSurgery = []
    # surgery_bill_inpatient_bill: ShowInpatientBill = []

    class Config():
        orm_mode = True

class ShowInpatientBill(BaseModel):
    id: str
    inpatient_id: str
    inpatient_bill_no: str
    total_professional_fee: float
    total_prescription_fee: float
    total_lab_test_fee: float
    total_treatment_fee: float
    total_surgery_fee: float
    total_room_fee: float
    total_discounts: float
    total_bill: float
    remaining_balance:float
    date_of_billing: date
    due_date: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    inpatient_bill_room_bill: List[ShowRoomBill] = []
    inpatient_bill_request_bill: List[ShowLabRequestBill] = []
    inpatient_bill_treatment_bill: List[ShowTreatmentBill] = []
    inpatient_bill_surgery_bill: List[ShowSurgeryBill] = []
    class Config():
        orm_mode = True


class ShowInpatientInpatientBill(ShowInpatient):
    inpatient_inpatient_bill: List[ShowInpatientBill] 
    
    class Config:
        orm_mode = True

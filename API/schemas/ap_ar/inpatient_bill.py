from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

from API.schemas.patient.inpatient import ShowInpatient
from API.schemas.treatment.lab_request import ShowLabRequest
from API.schemas.patient.room_admission import ShowRoomAdmission
from API.schemas.treatment.treatment import ShowTreatment
from API.schemas.treatment.surgery import ShowSurgery

class ShowPatientCashPayment(BaseModel):
    id: str
    cash_payment_no: str
    amount: Optional[float]
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPatientCheckPayment(BaseModel):
    id: str
    check_no: str
    check_date: date
    account_name: str
    account_no: str
    rt_number: str
    payee_name: str
    amount: float
    bank_name: str
    bank_address: str
    description: str
    check_status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True


class ShowPaymentMethod(BaseModel):
    id : str
    method_name: str
    description: Optional[str]
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]
    class Config():
        orm_mode = True

class ShowInpatientPrescriptionPayment(BaseModel):
    id: str
    or_no: Optional[str]
    inpatient_payment_id: str
    prescription_bill_id: str
    payment_method_id: str
    amount_paid: float
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    # #in_prescription_payment_in_payment
    # in_prescription_payment_in_prescription_bill: ShowPrescriptionBill = []
    in_prescription_payment_patient_cash: Optional[ShowPatientCashPayment] = []
    in_prescription_payment_patient_check: Optional[ShowPatientCheckPayment] = []
    in_prescription_payment_method: ShowPaymentMethod = []

    class Config():
        orm_mode = True

class ShowPrescriptionBill(BaseModel):
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

    # prescription_bill_inpatient_bill: ShowInpatientBill = []
    prescription_bill_inpatient: ShowInpatient = []
    in_prescription_bill_in_prescription_payment: List[ShowInpatientPrescriptionPayment] = []

    class Config():
        orm_mode = True


class ShowInpatientLabRequestPayment(BaseModel):
    id: str
    or_no: Optional[str]
    inpatient_payment_id: str
    lab_request_bill_id: str
    payment_method_id: str
    amount_paid: float
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    #in_request_payment_in_request_bill: ShowLabRequestBill = []
    in_request_payment_patient_cash: Optional[ShowPatientCashPayment] = []
    in_request_payment_patient_check: Optional[ShowPatientCheckPayment] = []
    in_request_payment_method: ShowPaymentMethod = []

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

    request_bill_lab_request : ShowLabRequest = []
    # request_bill_inpatient_bill: ShowInpatientBill = []
    in_request_bill_in_request_payment : List[ShowInpatientLabRequestPayment] = []

    class Config():
        orm_mode = True

class ShowInpatientRoomPayment(BaseModel):
    id: str
    or_no: Optional[str]
    inpatient_payment_id: str
    room_bill_id: str
    payment_method_id: str
    amount_paid: float
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    in_room_payment_patient_cash: Optional[ShowPatientCashPayment] = []
    in_room_payment_patient_check: Optional[ShowPatientCheckPayment] = []
    in_room_payment_method: ShowPaymentMethod = []

    class Config():
        orm_mode = True

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

    room_bill_room_admission: ShowRoomAdmission = []
    # room_bill_inpatient_bill: ShowInpatientBill = []
    in_room_bill_in_room_payment : List[ShowInpatientRoomPayment] = []

    class Config():
        orm_mode = True

class ShowInpatientTreatmentPayment(BaseModel):
    id: str
    or_no: Optional[str]
    inpatient_payment_id: str
    treatment_bill_id: str
    payment_method_id: str
    amount_paid: float
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    in_treatment_payment_patient_cash: Optional[ShowPatientCashPayment] = []
    in_treatment_payment_patient_check: Optional[ShowPatientCheckPayment] = []
    in_treatment_payment_method: ShowPaymentMethod = []

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

    treatment_bill_treatment: ShowTreatment = []
    # treatment_bill_inpatient_bill: ShowInpatientBill = []
    in_treatment_bill_in_treatment_payment : List[ShowInpatientTreatmentPayment] = []

    class Config():
        orm_mode = True    
    
class ShowInpatientSurgeryPayment(BaseModel):
    id: str
    or_no: Optional[str]
    inpatient_payment_id: str
    surgery_bill_id: str
    payment_method_id: str
    amount_paid: float
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    in_surgery_payment_patient_cash: Optional[ShowPatientCashPayment] = []
    in_surgery_payment_patient_check: Optional[ShowPatientCheckPayment] = []
    in_surgery_payment_method: ShowPaymentMethod = []

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

    surgery_bill_surgery: ShowSurgery = []
    # surgery_bill_inpatient_bill: ShowInpatientBill = []
    in_surgery_bill_in_surgery_payment : List[ShowInpatientSurgeryPayment] = []

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

    inpatient_bill_inpatient: ShowInpatient = []
    inpatient_bill_prescription_bill: Optional[List[ShowPrescriptionBill]] = []
    inpatient_bill_room_bill: Optional[List[ShowRoomBill]] = []
    inpatient_bill_request_bill: Optional[List[ShowLabRequestBill]] = []
    inpatient_bill_treatment_bill: Optional[List[ShowTreatmentBill]] = []
    inpatient_bill_surgery_bill: Optional[List[ShowSurgeryBill]] = []

    class Config():
        orm_mode = True
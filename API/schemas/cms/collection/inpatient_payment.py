from datetime import date, datetime, time
from typing import List, Optional

from API.schemas.ap_ar.inpatient_bill import ShowInpatientBill
from API.schemas.cms.payment_agreement.payment_term import ShowPaymentTerm
from API.schemas.cms.payment_agreement.payment_method import ShowPaymentMethod
from API.schemas.cms.collection.patient_cash_payment import ShowPatientCashPayment, CreatePatientCashPayment
from API.schemas.cms.collection.patient_check_payment import ShowPatientCheckPayment, CreatePatientCheckPayment

from pydantic import BaseModel

class InpatientPaymentBase(BaseModel):
    inpatient_bill_id: str
    total_amount_paid: float
    payment_term_id: str
    payment_method_id:str

class ShowInpatientPayment(InpatientPaymentBase):
    id: str
    or_no: str
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    date_of_payment: datetime
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    inpatient_payment_inpatient_bill: ShowInpatientBill = []
    inpatient_payment_payment_term: ShowPaymentTerm = []
    in_payment_patient_cash: Optional[ShowPatientCashPayment] = []
    in_payment_patient_check: Optional[ShowPatientCheckPayment] = []
    in_payment_method: ShowPaymentMethod = []

    class Config():
        orm_mode = True

class CreateInpatientPayment(InpatientPaymentBase):
    created_by : str
    patient_cash_payment: Optional[CreatePatientCashPayment] 
    patient_check_payment: Optional[CreatePatientCheckPayment]

    class Config():
        orm_mode = True

class UpdateInpatientPayment(InpatientPaymentBase):
    date_of_payment: datetime
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    status: str
    updated_by : str
    patient_cash_payment: Optional[CreatePatientCashPayment] 
    patient_check_payment: Optional[CreatePatientCheckPayment]

    class Config():
        orm_mode = True

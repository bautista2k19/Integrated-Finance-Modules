from datetime import date, datetime, time
from typing import List, Optional
from pydantic import BaseModel

from API.schemas.treatment.lab_request import ShowLabRequest
from API.schemas.cms.payment_agreement.payment_method import ShowPaymentMethod
from API.schemas.cms.payment_agreement.payment_term import ShowPaymentTerm
from API.schemas.cms.collection.patient_cash_payment import ShowPatientCashPayment, CreatePatientCashPayment
from API.schemas.cms.collection.patient_check_payment import ShowPatientCheckPayment, CreatePatientCheckPayment

class OutpatientLabRequestPaymentBase(BaseModel):
    
    lab_request_id: str
    payment_method_id: str
    payment_term_id: str
    amount_paid: float
    
    class Config():
        orm_mode = True

class ShowOutpatientLabRequestPayment(OutpatientLabRequestPaymentBase):
    id: str
    or_no: Optional[str]
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    out_request_payment_out_request: ShowLabRequest = []
    out_request_payment_patient_cash: Optional[ShowPatientCashPayment] = []
    out_request_payment_patient_check:  Optional[ShowPatientCheckPayment] = []
    out_request_payment_method: ShowPaymentMethod = []
    out_request_payment_term: ShowPaymentTerm = []

    class Config():
        orm_mode = True

class CreateOutpatientLabRequestPayment(OutpatientLabRequestPaymentBase):
    created_by : str
    patient_cash_payment: Optional[CreatePatientCashPayment] 
    patient_check_payment: Optional[CreatePatientCheckPayment]

    class Config():
        orm_mode = True

class UpdateOutpatientLabRequestPayment(OutpatientLabRequestPaymentBase):
    date_of_payment: date
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    status: str
    updated_by : str
    patient_cash_payment: Optional[CreatePatientCashPayment] 
    patient_check_payment: Optional[CreatePatientCheckPayment]

    class Config():
        orm_mode = True

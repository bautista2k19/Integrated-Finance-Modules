from datetime import date, datetime, time
from typing import List, Optional

from API.schemas.ap_ar.lab_request_bill import ShowLabRequestBill
from API.schemas.cms.payment_agreement.payment_method import ShowPaymentMethod
from API.schemas.cms.collection.patient_cash_payment import ShowPatientCashPayment, CreatePatientCashPayment
from API.schemas.cms.collection.patient_check_payment import ShowPatientCheckPayment, CreatePatientCheckPayment

from pydantic import BaseModel

class InpatientLabRequestPaymentBase(BaseModel):
    
    lab_request_bill_id: str
    payment_method_id: str
    amount_paid: float
    
    class Config():
        orm_mode = True

class ShowInpatientLabRequestPayment(InpatientLabRequestPaymentBase):
    id: str
    or_no: Optional[str]
    inpatient_payment_id: str
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    in_request_payment_in_request_bill: ShowLabRequestBill = []
    in_request_payment_patient_cash: Optional[ShowPatientCashPayment] = []
    in_request_payment_patient_check: Optional[ShowPatientCheckPayment] = []
    in_request_payment_method: ShowPaymentMethod = []

    class Config():
        orm_mode = True


class CreateInpatientLabRequestPayment(InpatientLabRequestPaymentBase):
    created_by : str
    patient_cash_payment: Optional[CreatePatientCashPayment] 
    patient_check_payment: Optional[CreatePatientCheckPayment]

    class Config():
        orm_mode = True

class UpdateInpatientLabRequestPayment(InpatientLabRequestPaymentBase):
    date_of_payment: date
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    status: str
    updated_by : str
    patient_cash_payment: Optional[CreatePatientCashPayment] 
    patient_check_payment: Optional[CreatePatientCheckPayment]

    class Config():
        orm_mode = True

from datetime import date, datetime, time
from typing import List, Optional

from API.schemas.ap_ar.treatment_bill import ShowTreatmentBill
from API.schemas.cms.payment_agreement.payment_method import ShowPaymentMethod
from API.schemas.cms.collection.patient_cash_payment import ShowPatientCashPayment, CreatePatientCashPayment
from API.schemas.cms.collection.patient_check_payment import ShowPatientCheckPayment, CreatePatientCheckPayment

from pydantic import BaseModel

class InpatientTreatmentPaymentBase(BaseModel):
    
    treatment_bill_id: str
    payment_method_id: str
    amount_paid: float
    
    class Config():
        orm_mode = True

class ShowInpatientTreatmentPayment(InpatientTreatmentPaymentBase):
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

    in_treatment_payment_in_treatment_bill: ShowTreatmentBill = []
    in_treatment_payment_patient_cash: Optional[ShowPatientCashPayment] = []
    in_treatment_payment_patient_check: Optional[ShowPatientCheckPayment] = []
    in_treatment_payment_method: ShowPaymentMethod = []

    class Config():
        orm_mode = True


class CreateInpatientTreatmentPayment(InpatientTreatmentPaymentBase):
    created_by : str
    patient_cash_payment: Optional[CreatePatientCashPayment] 
    patient_check_payment: Optional[CreatePatientCheckPayment]

    class Config():
        orm_mode = True

class UpdateInpatientTreatmentPayment(InpatientTreatmentPaymentBase):
    date_of_payment: date
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    status: str
    updated_by : str
    patient_cash_payment: Optional[CreatePatientCashPayment] 
    patient_check_payment: Optional[CreatePatientCheckPayment]

    class Config():
        orm_mode = True

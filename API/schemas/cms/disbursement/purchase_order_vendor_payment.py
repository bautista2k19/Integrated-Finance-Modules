from datetime import date, datetime, time
from typing import List, Optional
from pydantic import BaseModel

from API.schemas.ap_ar.purchase_order_vendor_bill import ShowPurchaseOrderVendorBill
from API.schemas.cms.payment_agreement.payment_term import ShowPaymentTerm
from API.schemas.cms.payment_agreement.payment_method import ShowPaymentMethod
from API.schemas.cms.disbursement.hospital_cash_payment import ShowHospitalCashPayment, CreateHospitalCashPayment
from API.schemas.cms.disbursement.hospital_check_payment import ShowHospitalCheckPayment, CreateHospitalCheckPayment

class PurchaseOrderVendorPaymentBase(BaseModel):
    purchase_order_vendor_bill_id: str
    total_amount_paid: float
    payment_term_id: str
    payment_method_id:str

class ShowPurchaseOrderVendorPayment(BaseModel):
    id: str
    or_no: Optional[str]
    total_amount_paid:float
    date_of_payment: date
    hospital_cash_payment_id: Optional[str]
    hospital_check_payment_id: Optional[str]
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    order_vendor_payment_order_vendor_bill: ShowPurchaseOrderVendorBill = []
    order_vendor_payment_payment_term: ShowPaymentTerm = []
    order_vendor_payment_hospital_cash: Optional[ShowHospitalCashPayment] = []
    order_vendor_payment_hospital_check: Optional[ShowHospitalCheckPayment] = []
    order_vendor_payment_method: ShowPaymentMethod = []

    class Config():
        orm_mode = True


class CreatePurchaseOrderVendorPayment(PurchaseOrderVendorPaymentBase):
    created_by : str
    hospital_cash_payment: Optional[CreateHospitalCashPayment] 
    hospital_check_payment: Optional[CreateHospitalCheckPayment]

    class Config():
        orm_mode = True

class UpdatePurchaseOrderVendorPayment(PurchaseOrderVendorPaymentBase):
    date_of_payment: datetime
    hospital_cash_payment_id: Optional[str]
    hospital_check_payment_id: Optional[str]
    status: str
    updated_by : str
    hospital_cash_payment: Optional[CreateHospitalCashPayment] 
    hospital_check_payment: Optional[CreateHospitalCheckPayment]

    class Config():
        orm_mode = True

from datetime import date, datetime, time
from typing import List, Optional
from pydantic import BaseModel

from API.schemas.ap_ar.purchase_order_bill import ShowPurchaseOrderBill
from API.schemas.cms.payment_agreement.payment_method import ShowPaymentMethod
from API.schemas.cms.disbursement.hospital_cash_payment import ShowHospitalCashPayment, CreateHospitalCashPayment
from API.schemas.cms.disbursement.hospital_check_payment import ShowHospitalCheckPayment, CreateHospitalCheckPayment


class PurchaseOrderPaymentBase(BaseModel):
    
    purchase_order_bill_id: str
    payment_method_id: str
    amount_paid: float
    
    class Config():
        orm_mode = True

class ShowPurchaseOrderPayment(PurchaseOrderPaymentBase):
    id: str
    or_no: Optional[str]
    purchase_order_vendor_payment_id: str
    hospital_cash_payment_id: Optional[str]
    hospital_check_payment_id: Optional[str]
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    order_payment_order_bill: ShowPurchaseOrderBill = []
    order_payment_hospital_cash: Optional[ShowHospitalCashPayment] = []
    order_payment_hospital_check: Optional[ShowHospitalCheckPayment] = []
    order_payment_method: ShowPaymentMethod = []

    class Config():
        orm_mode = True


class CreatePurchaseOrderPayment(PurchaseOrderPaymentBase):
    created_by : str
    hospital_cash_payment: Optional[CreateHospitalCashPayment] 
    hospital_check_payment: Optional[CreateHospitalCheckPayment]

    class Config():
        orm_mode = True

class UpdatePurchaseOrderPayment(PurchaseOrderPaymentBase):
    date_of_payment: date
    hospital_cash_payment_id: Optional[str]
    hospital_check_payment_id: Optional[str]
    status: str
    updated_by : str
    hospital_cash_payment: Optional[CreateHospitalCashPayment] 
    hospital_check_payment: Optional[CreateHospitalCheckPayment]

    class Config():
        orm_mode = True

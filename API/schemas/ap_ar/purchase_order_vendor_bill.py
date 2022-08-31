from datetime import date, datetime, time
from typing import List, Optional

from API.schemas.procurement.vendor import ShowVendor


from pydantic import BaseModel


class ShowHospitalCashPayment(BaseModel):
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

class ShowHospitalCheckPayment(BaseModel):
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

class ShowPurchaseOrderPayment(BaseModel):
    id: str
    or_no: Optional[str]
    purchase_order_vendor_payment_id: str
    purchase_order_bill_id: str
    payment_method_id: str
    amount_paid: float
    hospital_cash_payment_id: Optional[str]
    hospital_check_payment_id: Optional[str]
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    order_payment_hospital_cash: Optional[ShowHospitalCashPayment] = []
    order_payment_hospital_check: Optional[ShowHospitalCheckPayment] = []
    order_payment_method: ShowPaymentMethod = []

    class Config():
        orm_mode = True

class ShowPurchaseOrderBill(BaseModel):
    id: str
    purchase_order_bill_no: str
    purchase_order_vendor_bill_id: str
    purchase_order_id: str
    total_bill: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    # order_bill_order_vendor_bill: ShowPurchaseOrderVendorBill = []
    # order_bill_purchase_order: ShowPurchaseOrder = []
    order_bill_order_payment: List[ShowPurchaseOrderPayment] = []

    class Config():
        orm_mode = True
class ShowPurchaseOrderVendorBill(BaseModel):
    id: str
    purchase_order_vendor_bill_no: str
    vendor_id: str
    total_vendor_bill: float
    date_of_billing: date
    due_date: date
    remaining_balance: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    order_vendor_bill_vendor : ShowVendor = [] 
    order_vendor_bill_order_bill: List[ShowPurchaseOrderBill] = [] 

    class Config():
        orm_mode = True
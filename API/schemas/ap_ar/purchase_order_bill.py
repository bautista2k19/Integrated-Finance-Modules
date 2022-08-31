from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

from API.schemas.ap_ar.purchase_order_vendor_bill import ShowPurchaseOrderVendorBill
from API.schemas.procurement.purchase_order import ShowPurchaseOrder

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

    order_bill_order_vendor_bill: ShowPurchaseOrderVendorBill = []
    order_bill_purchase_order: ShowPurchaseOrder = []

    class Config():
        orm_mode = True
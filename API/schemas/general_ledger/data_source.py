#Module
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

#recruitment_management
from API.schemas.employee.user import CreatorUpdater

class DataSourceBase(BaseModel):
    name: str
    endpoint: str
    description: str = ''
    status: str

class DataSourceGet(DataSourceBase):
    id: str

    class Config():
        orm_mode = True

class DataSourceGetAll(DataSourceBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]
    ds_created_by: CreatorUpdater
    ds_updated_by: Optional[CreatorUpdater]

    class Config():
        orm_mode = True

class DataSourceGetForTable(BaseModel):
    draw: int
    recordsTotal: int
    recordsFiltered: int
    data: List[DataSourceGet] = []

    class Config():
        orm_mode = True

class DataSourceGetForSelect(BaseModel):
    id: str
    text: str

    class Config():
        orm_mode = True

class DataSourceSchema(BaseModel):
    id: str
    created_at: Optional[datetime]
    status: str
    status2: str

    total_bill: float = 0 # for Purchase_order_bill
    total_amount: float = 0 # for other bills & Sales

    billing_date: Optional[date] # for Prescription_bill

    date_of_billing: Optional[date] # for Purchase_order_vendor_bill

    due_date: Optional[date] # for Purchase_order_vendor_bill & AR_Utilities

    total_vendor_bill: float = 0 #  for Purchase_order_vendor_bill

    total_amount_paid: float = 0 # for Purchase_order_vendor_payment

    amount_paid: float = 0 # for other payments
    date_of_payment: Optional[datetime] # for payments

    utility_bill: float = 0 # for AR_Utilities

    notes: str = '' # for AR_Utilities

    amount: float = 0 # for Deposit & widthdrawal

    description: str = '' # for Deposit & widthdrawal

    date_of_deposit: Optional[date] # for Deposit

    date_of_withdrawal: Optional[date] # for widthdrawal

    #remaining_amount: float = 0 # for Bank_account

    date: Optional[date] # for Sales
    gross_margin: float = 0 # for Sales

    updated_at: Optional[datetime]

    class Config():
        orm_mode = True
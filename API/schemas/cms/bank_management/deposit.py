from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel

from API.schemas.cms.bank_management.bank_account import ShowBankAccount



class DepositBase(BaseModel):
    bank_account_id: str
    amount: float
    description: str
    date_of_deposit: date

    class Config():
        orm_mode = True

class ShowDeposit(DepositBase):
    id: str
    deposit_no: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    deposit_bank_account : ShowBankAccount = []

    class Config():
        orm_mode = True


class CreateDeposit(DepositBase):
    created_by:str

    class Config():
        orm_mode = True

class UpdateDeposit(DepositBase):
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True
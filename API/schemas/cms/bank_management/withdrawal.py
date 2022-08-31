from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel

from API.schemas.cms.bank_management.bank_account import ShowBankAccount

class WithdrawalBase(BaseModel):
    bank_account_id: str
    amount: float
    description: str
    date_of_withdrawal: date

    class Config():
        orm_mode = True

class ShowWithdrawal(WithdrawalBase):
    id: str
    withdrawal_no: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    withdrawal_bank_account : ShowBankAccount = []

    class Config():
        orm_mode = True


class CreateWithdrawal(WithdrawalBase):
    created_by:str

    class Config():
        orm_mode = True

class UpdateWithdrawal(WithdrawalBase):
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True
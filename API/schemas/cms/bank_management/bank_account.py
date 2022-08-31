from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel

class ShowDeposit(BaseModel):
    id: str
    deposit_no: str
    bank_account_id: str
    amount: float
    description: str
    date_of_deposit: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]
    class Config():
        orm_mode = True

class ShowWithdrawal(BaseModel):
    id: str
    withdrawal_no: str
    bank_account_id: str
    amount: float
    description: str
    date_of_withdrawal: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]
    class Config():
        orm_mode = True

class BankAccountBase(BaseModel):
    account_name:str
    account_no:str
    bank_name:str
    bank_address:str
    remaining_amount:float
    initial_amount:float

    class Config():
        orm_mode = True


class ShowBankAccount(BankAccountBase):
    id : str
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    bank_account_deposit : Optional[List[ShowDeposit]] = [] 
    bank_account_withdrawal : Optional[List[ShowWithdrawal]] = [] 
    class Config():
        orm_mode = True


class CreateBankAccount(BankAccountBase):
    created_by:str

    class Config():
        orm_mode = True

class UpdateBankAccount(BankAccountBase):
    updated_by: Optional[str] = None

    class Config():
        orm_mode = True

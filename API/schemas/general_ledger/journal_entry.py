# module
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# recruitment_management
from API.schemas.employee.user import CreatorUpdater
#from general_ledger.schemas.account_type import AccountTypeBase

class JournalEntryBase(BaseModel):
    entry_type: str
    date: str
    is_adjustable: bool
    explanation: str
    status: str

class AccountType(BaseModel):
    name: str

    class Config():
        orm_mode = True        

class ChartAccount(BaseModel):
    id: str
    account_title: str
    ca_account_type: AccountType

    class Config():
        orm_mode = True

class JournalAccount(BaseModel):
    id: str
    ja_account_title: ChartAccount 
    pr: str
    debit: float
    credit: float
    is_adjustable: bool
    salvage_value: float
    useful_life: int
    rate: float
    month_no: int
    interest: float
    is_interest_adjustable: bool
    balance: float

    class Config():
        orm_mode = True

class OriginatingEntryGetAll(JournalEntryBase):
    id: str
    source_document_path: Optional[str]
    je_journal_accounts: List[JournalAccount] = []
    journalized_at: datetime 
    posted_at: Optional[datetime]
    updated_at: Optional[datetime]       
    je_journalized_by: CreatorUpdater        
    je_posted_by: Optional[CreatorUpdater] 
    je_updated_by: Optional[CreatorUpdater] 

    class Config():
        orm_mode = True

class JournalEntryGetAll(JournalEntryBase):
    id: str
    source_document_path: Optional[str]
    je_journal_accounts: List[JournalAccount] = []
    je_originating_entry: Optional[OriginatingEntryGetAll]
    adjusted_account: Optional[JournalAccount]
    adjusted_balance: float
    journalized_at: datetime 
    posted_at: Optional[datetime]
    updated_at: Optional[datetime]       
    je_journalized_by: CreatorUpdater        
    je_posted_by: Optional[CreatorUpdater] 
    je_updated_by: Optional[CreatorUpdater] 

    class Config():
        orm_mode = True

class JournalEntryGet(JournalEntryBase):
    id: str
    originating_entry: Optional[str]
    account_title: str
    pr: str
    debit: float
    credit: float
    hasAdjustment: bool = False

    class Config():
        orm_mode = True
        
class JournalEntryGetForTable(BaseModel):
    draw: int
    recordsTotal: int
    recordsFiltered: int
    data: List[JournalEntryGet] = []

    class Config():
        orm_mode = True
        
class JournalEntryGetForSelect(BaseModel):
    id: str
    text: str
           
    class Config():
        orm_mode = True
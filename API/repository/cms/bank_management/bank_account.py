from fastapi.encoders import jsonable_encoder
from API.schemas.cms.bank_management.bank_account import CreateBankAccount, UpdateBankAccount
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status
from uuid import uuid4


def datatable(db: Session):
    bank_accounts = db.query(API.Bank_account).all()
    return bank_accounts

def find_all(db: Session):
    bank_accounts = db.query(API.Bank_account).filter(API.Bank_account.status != "Inactive").all()
    return bank_accounts


def find_one(id, db: Session):
    bank_account = db.query(API.Bank_account).filter(API.Bank_account.id == id).first()
    if not bank_account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Bank Account is not available.")
    return bank_account


def create(request: CreateBankAccount, db: Session):
    new_bank_account = API.Bank_account(**request.dict(), id=str(uuid4()))

    db.add(new_bank_account)
    db.commit()
    db.refresh(new_bank_account)
    return "Bank Account has been created."


def update(id, request: UpdateBankAccount, db: Session):
    bank_account = db.query(API.Bank_account).filter(API.Bank_account.id == id)
    bank_account_same_name = db.query(API.Bank_account).filter(API.Bank_account.id != id)

    if not bank_account.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Bank Account is not available.")
    
    bank_account_json = jsonable_encoder(request)     
    bank_account.update(bank_account_json)
                            
    db.commit()
    return f"Bank Account has been updated."


def delete(id, updated_by:str, db: Session):
    bank_account = db.query(API.Bank_account).filter(API.Bank_account.id == id)
    if not bank_account.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Bank Account is not available.")
    bank_account.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Bank Account has been deactivated."

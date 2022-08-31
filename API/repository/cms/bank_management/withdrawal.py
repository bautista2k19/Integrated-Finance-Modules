import random
from fastapi.encoders import jsonable_encoder
from API.schemas.cms.bank_management.withdrawal import CreateWithdrawal, UpdateWithdrawal
from datetime import datetime, date

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status
from uuid import uuid4


def datatable(db: Session):
    withdrawals = db.query(API.Withdrawal).all()
    return withdrawals

def find_all(db: Session):
    withdrawals = db.query(API.Withdrawal).filter(API.Withdrawal.status != "Inactive").all()
    return withdrawals


def find_one(id, db: Session):
    withdrawal = db.query(API.Withdrawal).filter(API.Withdrawal.id == id).first()
    if not withdrawal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Withdrawal is not available.")
    return withdrawal

def create(request: CreateWithdrawal, db: Session):
    today = date.today()
    withdrawal_no="Withdrawal No." + str(today.year) + str(today.month) + str(today.day) + "0"+ str(random.randint(111, 999)),
    new_withdrawal = API.Withdrawal(**request.dict(), id=str(uuid4()), withdrawal_no=withdrawal_no)

    bank_account = db.query(API.Bank_account).filter(
    API.Bank_account.id == request.bank_account_id)

    if bank_account.first().remaining_amount < request.amount:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"You don't have enough balance.")

    remaining_amount = bank_account.first().remaining_amount - request.amount

    db.add(new_withdrawal)
    bank_account.update({"remaining_amount" : remaining_amount})
    db.commit()
    db.refresh(new_withdrawal)
    return "Withdrawal has been created."


def update(id, request: UpdateWithdrawal, db: Session):
    withdrawal = db.query(API.Withdrawal).filter(API.Withdrawal.id == id)
    if not withdrawal.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Withdrawal is not available.")
    
    withdrawal_json = jsonable_encoder(request)     
    withdrawal.update(withdrawal_json)
                            
    db.commit()
    return f"Withdrawal has been updated."


def delete(id, updated_by:str, db: Session):
    withdrawal = db.query(API.Withdrawal).filter(API.Withdrawal.id == id)
    if not withdrawal.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Withdrawal is not available.")
    withdrawal.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Withdrawal has been deactivated."

import random
from fastapi.encoders import jsonable_encoder
from API.schemas.cms.bank_management.deposit import CreateDeposit, UpdateDeposit
from datetime import datetime, date

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status
from uuid import uuid4


def datatable(db: Session):
    deposits = db.query(API.Deposit).all()
    return deposits

def find_all(db: Session):
    deposits = db.query(API.Deposit).filter(API.Deposit.status != "Inactive").all()
    return deposits


def find_one(id, db: Session):
    deposit = db.query(API.Deposit).filter(API.Deposit.id == id).first()
    if not deposit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Deposit is not available.")
    return deposit

def create(request: CreateDeposit, db: Session):
    today = date.today()
    deposit_no="Deposit No." + str(today.year) + str(today.month) + str(today.day) + "0"+ str(random.randint(111, 999)),
    new_deposit = API.Deposit(**request.dict(), id=str(uuid4()), deposit_no=deposit_no)

    bank_account = db.query(API.Bank_account).filter(
    API.Bank_account.id == request.bank_account_id)

    remaining_amount = bank_account.first().remaining_amount + request.amount

    db.add(new_deposit)
    bank_account.update({"remaining_amount" : remaining_amount})
    db.commit()
    db.refresh(new_deposit)
    
    
    return "Deposit has been created."


def update(id, request: UpdateDeposit, db: Session):
    deposit = db.query(API.Deposit).filter(API.Deposit.id == id)
    if not deposit.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Deposit is not available.")
    
    deposit_json = jsonable_encoder(request)     
    deposit.update(deposit_json)
                            
    db.commit()
    return f"Deposit has been updated."


def delete(id, updated_by:str, db: Session):
    deposit = db.query(API.Deposit).filter(API.Deposit.id == id)
    if not deposit.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Deposit is not available.")
    deposit.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Deposit has been deactivated."

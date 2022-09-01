from API.schemas.cms.bank_management.bank_account import CreateBankAccount, ShowBankAccount, UpdateBankAccount
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from .... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.bank_management import bank_account

router = APIRouter(
    prefix="/cms/user/bank_account",
    tags=['Bank Accounts']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowBankAccount])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return bank_account.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowBankAccount])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return bank_account.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowBankAccount)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return bank_account.find_one(id, db)


@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: CreateBankAccount, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return bank_account.create(request, db)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, request: UpdateBankAccount, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return bank_account.update(id, request, db)


@router.delete('/{id}/{updated_by}', status_code=status.HTTP_200_OK)
def delete(
    id, 
    updated_by: str, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return bank_account.delete(id,updated_by,db)

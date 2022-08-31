from API.schemas.cms.bank_management.withdrawal import CreateWithdrawal, ShowWithdrawal, UpdateWithdrawal
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from .... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.bank_management import withdrawal

router = APIRouter(
    prefix="/withdrawal",
    tags=['Withdrawal']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowWithdrawal])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return withdrawal.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowWithdrawal])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return withdrawal.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowWithdrawal)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return withdrawal.find_one(id, db)


@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: CreateWithdrawal, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return withdrawal.create(request, db)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateWithdrawal, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return withdrawal.update(id, request, db)


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
        return withdrawal.delete(id,updated_by,db)

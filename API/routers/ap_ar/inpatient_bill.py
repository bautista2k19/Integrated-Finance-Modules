from API.schemas.ap_ar.inpatient_bill import ShowInpatientBill 
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from ... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.ap_ar import inpatient_bill

router = APIRouter(
    prefix="/inpatient_bill",
    tags=['Inpatient Bills']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowInpatientBill])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_bill.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowInpatientBill])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_bill.find_all(db)

@router.get('/find_all_pending', status_code=status.HTTP_200_OK, response_model=List[ShowInpatientBill])
def find_all_pending(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_bill.find_all_pending(db)

@router.get('/find_inpatient_bill/{id}', status_code=status.HTTP_200_OK, response_model=ShowInpatientBill)
def find_inpatient_bill(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_bill.find_inpatient_bill(id, db)

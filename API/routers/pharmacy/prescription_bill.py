from API.schemas.pharmacy.prescription_bill import ShowPrescriptionBill 
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from ... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.pharmacy import prescription_bill

router = APIRouter(
    prefix="/cms/user/prescription_bill",
    tags=['Prescription Bills']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowPrescriptionBill])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return prescription_bill.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowPrescriptionBill])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return prescription_bill.find_all(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPrescriptionBill)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return prescription_bill.find_one(id, db)

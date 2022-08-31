from API.schemas.ap_ar.lab_request_bill import ShowLabRequestBill 
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from ... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.ap_ar import lab_request_bill

router = APIRouter(
    prefix="/lab_request_bill",
    tags=['Lab Request Bills']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowLabRequestBill])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_request_bill.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowLabRequestBill])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_request_bill.find_all(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowLabRequestBill)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_request_bill.find_one(id, db)

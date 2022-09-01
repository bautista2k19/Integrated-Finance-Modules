from API.schemas.patient.inpatient import ShowInpatient, ShowInpatientPrescriptionBill, ShowInpatientInpatientBill
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from ... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.patient import inpatient

router = APIRouter(
    prefix="/cms/user/inpatient",
    tags=['Inpatients']
)

get_db = database.get_db

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowInpatient])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient.find_all(db)

@router.get('/{id}/prescription_bills', status_code=status.HTTP_200_OK, response_model=ShowInpatientPrescriptionBill)
def find_inpatient_prescription_bills(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient.find_inpatient_prescription_bills(id, db)

@router.get('/{id}/inpatient_bill', status_code=status.HTTP_200_OK, response_model=ShowInpatientInpatientBill)
def find_inpatient_inpatient_bills(
    id,
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient.find_inpatient_inpatient_bills(id, db)

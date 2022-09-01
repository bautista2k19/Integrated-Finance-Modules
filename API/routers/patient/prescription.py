from API.schemas.patient.prescription import ShowPrescription 
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from ... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.patient import prescription

router = APIRouter(
    prefix="/cms/user/prescription",
    tags=['Prescriptions']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowPrescription])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return prescription.datatable(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPrescription)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return prescription.find_one(id, db)

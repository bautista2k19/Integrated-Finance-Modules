from API.schemas.treatment.treatment import ShowTreatment
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from ... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.treatment import treatment

router = APIRouter(
    prefix="/treatment",
    tags=['Treatment']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowTreatment])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return treatment.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowTreatment])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return treatment.find_all(db)

@router.get('/find_all_out_pending', status_code=status.HTTP_200_OK, response_model=List[ShowTreatment])
def find_all_out_pending(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return treatment.find_all_out_pending(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowTreatment)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return treatment.find_one(id, db)

from API.schemas.treatment.lab_request import ShowLabRequest
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from ... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.treatment import lab_request

router = APIRouter(
    prefix="/lab_request",
    tags=['Lab Request']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowLabRequest])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_request.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowLabRequest])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_request.find_all(db)

@router.get('/find_all_out_pending', status_code=status.HTTP_200_OK, response_model=List[ShowLabRequest])
def find_all_out_pending(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_request.find_all_out_pending(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowLabRequest)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_request.find_one(id, db)

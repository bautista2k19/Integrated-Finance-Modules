from API.schemas.cms.collection.surgery_type import CreateSurgeryType, ShowSurgeryType, UpdateSurgeryType
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from .... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.collection import surgery_type

router = APIRouter(
    prefix="/surgery_type",
    tags=['Surgery Types']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowSurgeryType])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return surgery_type.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowSurgeryType])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return surgery_type.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowSurgeryType)
def find_one(
    id,
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return surgery_type.find_one(id, db)


@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: CreateSurgeryType, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return surgery_type.create(request, db)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateSurgeryType, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return surgery_type.update(id, request, db)


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
        return surgery_type.delete(id,updated_by,db)

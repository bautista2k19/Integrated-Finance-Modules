from API.schemas.ar_ap.user import User
from API.schemas.ar_ap.medicalsupplies import CreateMedicalSupplies, MedicalSupplies, ShowMedicalSupplies,UpdateMedicalSupplies,DeleteMedicalSupplies
from typing import List
from fastapi import APIRouter, Depends, status, responses
from API import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import medicalsupplies

router = APIRouter(
    prefix="/AR_AP/user/medicalsupplies",
    tags=['Medical Supply']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowMedicalSupplies])
# 
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicalsupplies.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowMedicalSupplies])
# ,current_user:User = Depends(oauth2.get_current_user)):
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicalsupplies.find_all(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowMedicalSupplies)
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicalsupplies.find_one(id,db)

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=CreateMedicalSupplies)
def create(
    request: CreateMedicalSupplies, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicalsupplies.create(request,db)

@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateMedicalSupplies, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicalsupplies.update(id,request,db)

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
        return medicalsupplies.delete(id,updated_by,db)


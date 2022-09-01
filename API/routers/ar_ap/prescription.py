from API.schemas.ar_ap.user import User
from API.schemas.ar_ap.prescription import ShowPrescription,Prescription,CreatePrescription
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException, responses
from API import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import prescription

router = APIRouter(
    prefix="/AR_AP/user/prescription",
    tags=['Prescription']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[Prescription])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return prescription.datatable(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=Prescription)
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return prescription.find_one(id,db)

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=CreatePrescription)
def create(
    request: CreatePrescription, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return prescription.create(request,db)

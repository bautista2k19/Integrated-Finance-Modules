from re import M
from API.schemas.ar_ap import inpatient_bills
from API.schemas.ar_ap.inpatients import CreateInpatient, ShowInpatient, UpdateInpatient
from API.schemas.ar_ap.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from API import database, security#, oauth2
# , oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import inpatients

# from AR_AP.repository.inpatients import inpatients

router = APIRouter(
    prefix="/AR_AP/user/inpatients",
    tags=['Inpatient']
)

get_db = database.get_db


@router.get('/patient/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowInpatient])
def find_all_patient_without_bill(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatients.find_all_patient_without_bill(db)


@router.get('/room_number/{room_number}', status_code=status.HTTP_200_OK, response_model=List[ShowInpatient])
def find_by_room_number(
    room_number, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatients.find_by_room_number(room_number, db)

@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowInpatient])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatients.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowInpatient])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatients.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowInpatient)
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatients.find_one(id, db)

@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: CreateInpatient, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatients.create(request, db)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateInpatient, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatients.update(id, request, db)


@router.put('/{id}/{updated_by}', status_code=status.HTTP_200_OK)
def completed(
    id, 
    updated_by: str, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatients.completed(id,updated_by,db)
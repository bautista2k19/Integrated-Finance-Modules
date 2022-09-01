from API.schemas.ar_ap.medicine_pr import CreateMedicine_PR, ShowMedicine_PR, UpdateMedicine_PR
from API.schemas.ar_ap.prescription import ShowPrescription
from API.schemas.ar_ap.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from API import database, security#, oauth2
# , oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import medicine_pr

# from AR_AP.repository.medicine_pr import medicine_pr

router = APIRouter(
    prefix="/AR_AP/user/medicine_pr",
    tags=['Medicine_PR']
)

get_db = database.get_db



@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowMedicine_PR])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicine_pr.datatable(db)


@router.get('/find_all_for_billing/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowMedicine_PR])
def find_all_for_billing(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicine_pr.find_all_for_billing(id, db)


@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowMedicine_PR])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicine_pr.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowMedicine_PR)
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicine_pr.find_one(id, db)

# @router.get('/find_by_name/{term_name}', status_code=status.HTTP_200_OK, response_model=ShowMedicine_PR)
# def find_by_term_name(term_name:str, db: Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)):
#     return medicine_pr.find_by_term_name(term_name, db)

@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: CreateMedicine_PR, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicine_pr.create(request, db)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateMedicine_PR, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return medicine_pr.update(id, request, db)


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
        return medicine_pr.completed(id,updated_by,db)
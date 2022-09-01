from API.schemas.ar_ap.insurances import CreateInsurance, ShowInsurance, UpdateInsurance
from API.schemas.ar_ap.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from API import database, security#, oauth2
# , oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import insurances

# from AR_AP.repository.insurances import insurances

router = APIRouter(
    prefix="/AR_AP/user/insurances",
    tags=['Insurance']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowInsurance])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return insurances.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowInsurance])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return insurances.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowInsurance)
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return insurances.find_one(id, db)

# @router.get('/find_by_name/{term_name}', status_code=status.HTTP_200_OK, response_model=ShowInsurance)
# def find_by_term_name(term_name:str, db: Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)):
#     return insurances.find_by_term_name(term_name, db)

@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: CreateInsurance, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return insurances.create(request, db)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateInsurance, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return insurances.update(id, request, db)


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
        return insurances.completed(id,updated_by,db)
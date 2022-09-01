from API.schemas.ar_ap.lab_service_name import CreateLabServiceName, ShowLabServiceName, UpdateLabServiceName
from API.schemas.ar_ap.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from API import database, security#, oauth2
# , oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import lab_service_name

# from AR_AP.repository.lab_service_name import lab_service_name

router = APIRouter(
    prefix="/AR_AP/user/lab_service_name",
    tags=['Lab Service Name']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowLabServiceName])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_service_name.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowLabServiceName])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_service_name.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowLabServiceName)
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_service_name.find_one(id, db)

# @router.get('/find_by_name/{term_name}', status_code=status.HTTP_200_OK, response_model=ShowLabServiceName)
# def find_by_term_name(term_name:str, db: Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)):
#     return lab_service_name.find_by_term_name(term_name, db)

@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: CreateLabServiceName, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_service_name.create(request, db)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateLabServiceName, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_service_name.update(id, request, db)


@router.put('/{id}/{updated_by}', status_code=status.HTTP_200_OK)
def deactivated(
    id, 
    updated_by: str, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_service_name.deactivated(id,updated_by,db)
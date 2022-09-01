from API.schemas.ar_ap.lab_test_types import CreateLab_test_type, ShowLab_test_type, UpdateLab_test_type
from API.schemas.ar_ap.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from API import database, security#, oauth2
# , oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import lab_test_types

# from AR_AP.repository.lab_test_types import lab_test_types

router = APIRouter(
    prefix="/AR_AP/user/lab_test_types",
    tags=['Lab test type']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowLab_test_type])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_test_types.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowLab_test_type])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_test_types.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowLab_test_type)
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_test_types.find_one(id, db)

# @router.get('/find_by_name/{term_name}', status_code=status.HTTP_200_OK, response_model=ShowLab_test_type)
# def find_by_term_name(term_name:str, db: Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)):
#     return lab_test_types.find_by_term_name(term_name, db)

@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: CreateLab_test_type, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_test_types.create(request, db)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateLab_test_type, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return lab_test_types.update(id, request, db)


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
        return lab_test_types.deactivated(id,updated_by,db)
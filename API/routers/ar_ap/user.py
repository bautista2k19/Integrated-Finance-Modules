from API.schemas.ar_ap.user import CreateUser, ShowUser, UpdatePassword, UpdateUser, UpdateUsername, User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from API import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import user

router = APIRouter(
    prefix="/AR_AP/user/user",
    tags=['Users']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowUser])
# 
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowUser])
# ,current_user:User = Depends(oauth2.get_current_user)):
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowUser)
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.find_one(id, db)


@router.post('/', status_code=status.HTTP_201_CREATED, response_model=CreateUser)
def create(
    request: CreateUser, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.create(request, db)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateUser, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.update(id, request, db)

@router.put('/{id}/update_username', status_code=status.HTTP_202_ACCEPTED)
def update_username(
    id, 
    request: UpdateUsername, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.update_username(id, request, db)

@router.put('/{id}/update_password', status_code=status.HTTP_202_ACCEPTED)
def update_password(
    id, 
    request: UpdatePassword, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.update_password(id, request, db)

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
        return user.delete(id,updated_by,db)

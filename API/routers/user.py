from fastapi import Depends, APIRouter, status, responses

from API import security#,oauth2
from API.schemas.employee.user import CreateUser, ShowUser, UpdateEmail, UpdatePassword, UpdateUser


from API import database
from sqlalchemy.orm import Session
from typing import List
from API.repository import user


router = APIRouter(
    prefix="/user",
    tags=['Users']
)

#oauth2_dependency = Depends(oauth2.get_current_user)

get_db = database.get_db

@router.get("/datatable",status_code=status.HTTP_200_OK, response_model=List[ShowUser])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.datatable(db)

@router.post("/create_user",status_code = status.HTTP_201_CREATED)
def create_user(
    request: CreateUser, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user: ShowUser = oauth2_dependency):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.create_user(request, db)

@router.get("/active_users",status_code=status.HTTP_200_OK, response_model=List[ShowUser])
def active_users(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.active_users(db)

@router.get("/inactive_users",status_code=status.HTTP_200_OK, response_model=List[ShowUser])
def inactive_users(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.inactive_users(db)

@router.get('/find_user/{id}', status_code=status.HTTP_200_OK, response_model=ShowUser)
def find_user(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.find_user(id, db)

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

@router.put('/{id}/update_email', status_code=status.HTTP_202_ACCEPTED)
def update_email(
    id, 
    request: UpdateEmail, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return user.update_email(id, request, db)

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
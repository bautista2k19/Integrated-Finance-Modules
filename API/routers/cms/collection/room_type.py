from API.schemas.cms.collection.room_type import CreateRoomType, ShowRoomType, UpdateRoomType
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from .... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.collection import room_type

router = APIRouter(
    prefix="/cms/user/room_type",
    tags=['Room Types']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowRoomType])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return room_type.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowRoomType])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return room_type.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowRoomType)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return room_type.find_one(id, db)


@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: CreateRoomType, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return room_type.create(request, db)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateRoomType, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return room_type.update(id, request, db)


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
        return room_type.delete(id,updated_by,db)

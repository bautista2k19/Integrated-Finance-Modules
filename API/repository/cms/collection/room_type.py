from API.schemas.cms.collection.room_type import CreateRoomType, UpdateRoomType
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    room_types = db.query(API.Room_type).all()
    return room_types

def find_all(db: Session):
    room_types = db.query(API.Room_type).filter(API.Room_type.status != "Inactive").all()
    return room_types


def find_one(id, db: Session):
    room_type = db.query(API.Room_type).filter(API.Room_type.id == id).first()
    if not room_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Room type is not available.")
    return room_type


def create(request: CreateRoomType, db: Session):
    new_room_type = API.Room_type(**request.dict(), id=str(uuid4()))

    if db.query(API.Room_type).filter_by(name=request.name).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Room type already exists.")
    db.add(new_room_type)
    db.commit()
    db.refresh(new_room_type)
    return "Room type has been created."


def update(id, request: UpdateRoomType, db: Session):
    room_type = db.query(API.Room_type).filter(API.Room_type.id == id)
    room_type_same_name = db.query(API.Room_type).filter(API.Room_type.id != id)

    for row in room_type_same_name:
        if row.name == request.name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Room type already exists.")

    if not room_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room type is not available.")
                            
    room_type_json = jsonable_encoder(request)     
    room_type.update(room_type_json)
    db.commit()
    return f"Room type has been updated."


def delete(id, updated_by:str, db: Session):
    room_type = db.query(API.Room_type).filter(API.Room_type.id == id)
    if not room_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room type is not available.")
    room_type.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Room type has been deactivated."

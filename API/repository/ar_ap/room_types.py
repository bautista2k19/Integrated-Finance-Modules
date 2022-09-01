from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.room_types import CreateRoom_type, UpdateRoom_type
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    room_types = db.query(models.AR_Room_type).all()
    return room_types

def find_all(db: Session):
    room_types = db.query(models.AR_Room_type).filter(models.AR_Room_type.status != "Inactive").all()
    return room_types


def find_one(id, db: Session):
    room_types = db.query(models.AR_Room_type).filter(models.AR_Room_type.id == id).first()
    if not room_types:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Room type is not available.")
    return room_types

def find_by_room_type_name(room_type_name, db: Session):
    room_types = db.query(models.AR_Room_type).filter(models.AR_Room_type.room_type_name == room_type_name).first()
    if not room_types:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Room type is not available.")
    return room_types


def create(request: CreateRoom_type, db: Session):
    new_room_types = models.AR_Room_type(**request.dict(),
        id=str(uuid4()),
        )
        
    room_type_name_var= request.room_type_name
    if db.query(models.AR_Room_type).filter_by(room_type_name= room_type_name_var).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Room type already exists.")
                            
    db.add(new_room_types)
    db.commit()
    db.refresh(new_room_types)
    return "Room type has been created."


def update(id, request: UpdateRoom_type, db: Session):
    room_types = db.query(models.AR_Room_type).filter(models.AR_Room_type.id == id)
    room_types_same_name = db.query(models.AR_Room_type).filter(models.AR_Room_type.id != id)

    for row in room_types_same_name:
        if row.room_type_name == request.room_type_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Room type already exists.")

    if not room_types.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room type is not available.")

    
    room_types_json = jsonable_encoder(request)     
    room_types.update(room_types_json)
                            
    db.commit()
    return f"Room type has been updated."


def deactivated(id, updated_by:str, db: Session):
    room_types = db.query(models.AR_Room_type).filter(models.AR_Room_type.id == id)
    if not room_types.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room type is not available.")
    room_types.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Room type has been deleted."
from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.rooms import CreateRoom, UpdateRoom
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    rooms = db.query(models.AR_Room).all()
    return rooms

def find_all(db: Session):
    rooms = db.query(models.AR_Room).filter(models.AR_Room.room_status == "Occupied" and models.AR_Room.room_status == "OCCUPIED" ).all()
    return rooms


def find_one(id, db: Session):
    rooms = db.query(models.AR_Room).filter(models.AR_Room.room_id == id).first()
    if not rooms:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Room is not available.")
    return rooms

def find_one_by_room_id(room_id, db: Session):
    rooms_admission = db.query(models.AR_Room).filter(
        models.AR_Room.room_id == room_id).first()
    if not rooms_admission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room with the room_id {room_id} is not available.")
    return rooms_admission


def find_by_room_number(room_number, db: Session):
    rooms = db.query(models.AR_Room).filter(models.AR_Room.room_number == room_number).first()
    if not rooms:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Room is not available.")
    return rooms


def create(request: CreateRoom, db: Session):
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_rooms = models.AR_Room(**request.dict(),
        room_id=str(uuid4()),
        room_number="RM"+ last_4_uuid + "-" + str(random.randint(1111, 9999)))
        
    room_number_var="RM"+ last_4_uuid + "-" + str(random.randint(1111, 9999))
    if db.query(models.AR_Room).filter_by(room_number= room_number_var).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Room already exists.")
                            
    db.add(new_rooms)
    db.commit()
    db.refresh(new_rooms)
    return "Room has been created."


def update(id, request: UpdateRoom, db: Session):
    rooms = db.query(models.AR_Room).filter(models.AR_Room.room_id == id)

    if not rooms.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room is not available.")

    
    rooms_json = jsonable_encoder(request)     
    rooms.update(rooms_json)
                            
    db.commit()
    return f"Room has been updated."


def completed(id, updated_by:str, db: Session):
    rooms = db.query(models.AR_Room).filter(models.AR_Room.id == id)
    if not rooms.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room is not available.")
    rooms.update({
                    'active_status': 'Open',
                    'updated_at': datetime.now(),
                    })
    db.commit()
    return f"Room has been completed."
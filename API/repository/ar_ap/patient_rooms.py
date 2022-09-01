from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.patient_rooms import CreatePatientRoom, UpdatePatientRoom
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    patient_rooms = db.query(models.AR_PatientRoom).all()
    return patient_rooms

def find_all(db: Session):
    patient_rooms = db.query(models.AR_PatientRoom).filter(models.AR_PatientRoom.status != "Completed").all()
    return patient_rooms


def find_one(id, db: Session):
    patient_rooms = db.query(models.AR_PatientRoom).filter(models.AR_PatientRoom.id == id).first()
    if not patient_rooms:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Room Transfer is not available.")
    return patient_rooms

def find_by_room_number(room_number, db: Session):
    patient_rooms = db.query(models.AR_PatientRoom).filter(models.AR_PatientRoom.room_number == room_number).first()
    if not patient_rooms:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Room Transfer is not available.")
    return patient_rooms


def create(request: CreatePatientRoom, db: Session):
    new_patient_rooms = models.AR_PatientRoom(**request.dict(),
        id=str(uuid4()),
        )
        
                            
    db.add(new_patient_rooms)
    db.commit()
    db.refresh(new_patient_rooms)
    return "Room Transfer has been created."


def update(id, request: UpdatePatientRoom, db: Session):
    patient_rooms = db.query(models.AR_PatientRoom).filter(models.AR_PatientRoom.id == id)
    if not patient_rooms.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room Transfer is not available.")

    
    patient_rooms_json = jsonable_encoder(request)     
    patient_rooms.update(patient_rooms_json)
                            
    db.commit()
    return f"Room Transfer has been updated."


def completed(id, updated_by:str, db: Session):
    patient_rooms = db.query(models.AR_PatientRoom).filter(models.AR_PatientRoom.id == id)
    if not patient_rooms.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room Transfer is not available.")
    patient_rooms.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Room Transfer has been completed."
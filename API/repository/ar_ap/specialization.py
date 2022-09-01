from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.specialization import CreateSpecialization, UpdateSpecialization
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    specialization = db.query(models.AR_Specialization).all()
    return specialization

def find_all(db: Session):
    specialization = db.query(models.AR_Specialization).filter(models.AR_Specialization.status != "Inactive").all()
    return specialization


def find_one(id, db: Session):
    specialization = db.query(models.AR_Specialization).filter(models.AR_Specialization.specialization_id == id).first()
    if not specialization:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Specialization is not available.")
    return specialization

def find_by_specialization_name(specialization_name, db: Session):
    specialization = db.query(models.AR_Specialization).filter(models.AR_Specialization.specialization_name == specialization_name).first()
    if not specialization:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Specialization is not available.")
    return specialization


def create(request: CreateSpecialization, db: Session):
    new_specialization = models.AR_Specialization(**request.dict(),
        specialization_id=str(uuid4()),
        )
        
  
    db.add(new_specialization)
    db.commit()
    db.refresh(new_specialization)
    return "Specialization has been created."


def update(id, request: UpdateSpecialization, db: Session):
    specialization = db.query(models.AR_Specialization).filter(models.AR_Specialization.specialization_id == id)
    specialization_same_name = db.query(models.AR_Specialization).filter(models.AR_Specialization.specialization_id != id)

    for row in specialization_same_name:
        if row.specialization_name == request.specialization_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Specialization already exists.")

    if not specialization.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Specialization is not available.")

    
    specialization_json = jsonable_encoder(request)     
    specialization.update(specialization_json)
                            
    db.commit()
    return f"Specialization has been updated."


def completed(id, updated_by:str, db: Session):
    specialization = db.query(models.AR_Specialization).filter(models.AR_Specialization.specialization_id == id)
    if not specialization.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Specialization is not available.")
    specialization.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Specialization has been deleted."
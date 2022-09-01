from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.doctor_profile import CreateDoctor_profile, UpdateDoctor_profile
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    doctor_profile = db.query(models.AR_Doctor_profile).all()
    return doctor_profile

def find_all(db: Session):
    doctor_profile = db.query(models.AR_Doctor_profile).filter(models.AR_Doctor_profile.status != "Inactive").all()
    return doctor_profile


def find_one(id, db: Session):
    doctor_profile = db.query(models.AR_Doctor_profile).filter(models.AR_Doctor_profile.doctor_id == id).first()
    if not doctor_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Doctor_profile is not available.")
    return doctor_profile


def create(request: CreateDoctor_profile, db: Session):
    new_doctor_profile = models.AR_Doctor_profile(**request.dict(),
        doctor_id=str(uuid4()),
        )
        
  
    db.add(new_doctor_profile)
    db.commit()
    db.refresh(new_doctor_profile)
    return "Doctor_profile has been created."


def update(id, request: UpdateDoctor_profile, db: Session):
    doctor_profile = db.query(models.AR_Doctor_profile).filter(models.AR_Doctor_profile.doctor_id == id)
  
    if not doctor_profile.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Doctor_profile is not available.")

    
    doctor_profile_json = jsonable_encoder(request)     
    doctor_profile.update(doctor_profile_json)
                            
    db.commit()
    return f"Doctor_profile has been updated."


def completed(id, updated_by:str, db: Session):
    doctor_profile = db.query(models.AR_Doctor_profile).filter(models.AR_Doctor_profile.doctor_profile_id == id)
    if not doctor_profile.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Doctor_profile is not available.")
    doctor_profile.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Doctor_profile has been deleted."
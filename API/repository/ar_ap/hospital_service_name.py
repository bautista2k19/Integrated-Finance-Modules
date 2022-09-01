from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.hospital_service_name import CreateHospitalServiceName, UpdateHospitalServiceName
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import or_




def datatable(db: Session):
    hospital_service_name = db.query(models.AR_HospitalServiceName).all()
    return hospital_service_name

def find_all(db: Session):
    hospital_service_name = db.query(models.AR_HospitalServiceName).filter(or_(models.AR_HospitalServiceName.status != "Inactive",models.AR_HospitalServiceName.status != "INACTIVE" )).all() 
    return hospital_service_name


def find_one(id, db: Session):
    hospital_service_name = db.query(models.AR_HospitalServiceName).filter(models.AR_HospitalServiceName.id == id).first()
    if not hospital_service_name:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hospital Service Name is not available.")
    return hospital_service_name

def find_by_invoice_no(description_name, db: Session):
    hospital_service_name = db.query(models.AR_HospitalServiceName).filter(models.AR_HospitalServiceName.description_name == description_name).first()
    if not hospital_service_name:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hospital Service Name is not available.")
    return hospital_service_name


def create(request: CreateHospitalServiceName, db: Session):
    new_hospital_service_name = models.AR_HospitalServiceName(**request.dict(),
        id=str(uuid4()),
        )
                            
    db.add(new_hospital_service_name)
    db.commit()
    db.refresh(new_hospital_service_name)
    return "Hospital Service Name has been created."


def update(id, request: UpdateHospitalServiceName, db: Session):
    hospital_service_name = db.query(models.AR_HospitalServiceName).filter(models.AR_HospitalServiceName.id == id)
    description_same_name = db.query(models.AR_HospitalServiceName).filter(models.AR_HospitalServiceName.id != id)

    for row in description_same_name:
        if row.description_name == request.description_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Hospital Service Name already exists.")

    if not hospital_service_name.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Hospital Service Name is not available.")

    
    hospital_service_name_json = jsonable_encoder(request)     
    hospital_service_name.update(hospital_service_name_json)
                            
    db.commit()
    return f"Hospital Service Name has been updated."


def completed(id, updated_by:str, db: Session):
    hospital_service_name = db.query(models.AR_HospitalServiceName).filter(models.AR_HospitalServiceName.id == id)
    if not hospital_service_name.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Hospital Service Name is not available.")
    hospital_service_name.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Hospital Service Name has been completed."

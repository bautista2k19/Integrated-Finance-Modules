import re
from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.hospital_services import CreateHospitalServices, UpdateHospitalServices
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import or_




def datatable(db: Session):
    hospital_services = db.query(models.AR_HospitalServices).all()
    return hospital_services

def find_all(db: Session):
    hospital_services = db.query(models.AR_HospitalServices).filter(or_(models.AR_HospitalServices.status != "Inactive",models.AR_HospitalServices.status != "INACTIVE" )).all() 
    return hospital_services


def find_one(id, db: Session):
    hospital_services = db.query(models.AR_HospitalServices).filter(models.AR_HospitalServices.id == id).first()
    if not hospital_services:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hospital Service is not available.")
    return hospital_services

def find_by_patient_id(patient_id, db: Session):
    hospital_services = db.query(models.AR_HospitalServices).filter(models.AR_HospitalServices.patient_id == patient_id).first()
    if not hospital_services:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hospital Service is not available.")
    return hospital_services


def create(request: CreateHospitalServices, db: Session):
    total_amount =0
    tmp_total= db.query(models.AR_HospitalServiceName).filter(models.AR_HospitalServiceName.id == request.hospital_service_name_id).first()
    total_amount = tmp_total.unit_price * request.quantity

    new_hospital_services = models.AR_HospitalServices(**request.dict(),
        id=str(uuid4()),
        total_amount=total_amount
        )
                            
    db.add(new_hospital_services)
    db.commit()
    db.refresh(new_hospital_services)
    return "Hospital Service has been created."



def update(id, request: UpdateHospitalServices, db: Session):
    hospital_services = db.query(models.AR_HospitalServices).filter(models.AR_HospitalServices.id == id)
    if not hospital_services.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Hospital Service is not available.")

    
    hospital_services_json = jsonable_encoder(request)     
    hospital_services.update(hospital_services_json)
                            
    db.commit()
    return f"Hospital Service has been updated."


def completed(id, updated_by:str, db: Session):
    hospital_services = db.query(models.AR_HospitalServices).filter(models.AR_HospitalServices.id == id)
    if not hospital_services.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Hospital Service is not available.")
    hospital_services.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Hospital Service has been completed."

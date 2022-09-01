from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.treatment_service_name import CreateTreatmentServiceName, UpdateTreatmentServiceName
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    treatment_service_name = db.query(models.AR_TreatmentServiceName).all()
    return treatment_service_name

def find_all(db: Session):
    treatment_service_name = db.query(models.AR_TreatmentServiceName).filter(models.AR_TreatmentServiceName.status != "Completed").all()
    return treatment_service_name


def find_one(id, db: Session):
    treatment_service_name = db.query(models.AR_TreatmentServiceName).filter(models.AR_TreatmentServiceName.id == id).first()
    if not treatment_service_name:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Treatment Service Name is not available.")
    return treatment_service_name


def create(request: CreateTreatmentServiceName, db: Session):
    new_treatment_service_name = models.AR_TreatmentServiceName(**request.dict(),
        id=str(uuid4()),
        )
    
    if db.query(models.AR_TreatmentServiceName).filter_by(treatment_service_name= request.treatment_service_name).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Treatment Service Name already exists.")
                            
    db.add(new_treatment_service_name)
    db.commit()
    db.refresh(new_treatment_service_name)
    return "Treatment Service Name has been created."


def update(id, request: UpdateTreatmentServiceName, db: Session):
    treatment_service_name = db.query(models.AR_TreatmentServiceName).filter(models.AR_TreatmentServiceName.id == id)
    treatment_service_name_same_name = db.query(models.AR_TreatmentServiceName).filter(models.AR_TreatmentServiceName.id != id)

    for row in treatment_service_name_same_name:
        if row.treatment_service_name == request.treatment_service_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Treatment Service Name already exists.")

    if not treatment_service_name.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Treatment Service Name is not available.")

    
    treatment_service_name_json = jsonable_encoder(request)     
    treatment_service_name.update(treatment_service_name_json)
                            
    db.commit()
    return f"Treatment Service Name has been updated."


def completed(id, updated_by:str, db: Session):
    treatment_service_name = db.query(models.AR_TreatmentServiceName).filter(models.AR_TreatmentServiceName.id == id)
    if not treatment_service_name.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Treatment Service Nameis not available.")
    treatment_service_name.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Treatment Service Name has been deleted."
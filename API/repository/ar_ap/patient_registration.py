from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.patient_registration import CreatePatientRegistration, UpdatePatientRegistration
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    patient_registration = db.query(models.AR_PatientRegistration).all()
    return patient_registration

def find_all(db: Session):
    patient_registration = db.query(models.AR_PatientRegistration).filter(models.AR_PatientRegistration.status != "Completed").all()
    return patient_registration


def find_one(id, db: Session):
    patient_registration = db.query(models.AR_PatientRegistration).filter(models.AR_PatientRegistration.patient_id == id).first()
    if not patient_registration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Patient Registration  is not available.")
    return patient_registration

def find_by_invoice_no(invoice_no, db: Session):
    patient_registration = db.query(models.AR_PatientRegistration).filter(models.AR_PatientRegistration.invoice_no == invoice_no).first()
    if not patient_registration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Patient Registration  is not available.")
    return patient_registration


def create(request: CreatePatientRegistration, db: Session):  
    new_patient_registration = models.AR_PatientRegistration(**request.dict(),
        patient_id=str(uuid4()),
        )
        
                            
    db.add(new_patient_registration)
    db.commit()
    db.refresh(new_patient_registration)
    return "Patient Registration has been created."


def update(id, request: UpdatePatientRegistration, db: Session):
    patient_registration = db.query(models.AR_PatientRegistration).filter(models.AR_PatientRegistration.patient_id == id)
    patient_registration_same_name = db.query(models.AR_PatientRegistration).filter(models.AR_PatientRegistration.patient_id != id)

    for row in patient_registration_same_name:
        if row.patient_id == request.patient_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Patient Registration  already exists.")

    if not patient_registration.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Patient Registration  is not available.")

    
    patient_registration_json = jsonable_encoder(request)     
    patient_registration.update(patient_registration_json)
                            
    db.commit()
    return f"Patient Registration  has been updated."


def completed(id, updated_by:str, db: Session):
    patient_registration = db.query(models.AR_PatientRegistration).filter(models.AR_PatientRegistration.patient_id == id)
    if not patient_registration.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Patient Registration  is not available.")
    patient_registration.update({
                    
                    'updated_at': datetime.now(),
                    
                    })
    db.commit()
    return f"Patient Registration  has been completed."
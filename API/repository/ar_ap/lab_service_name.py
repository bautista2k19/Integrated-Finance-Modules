from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.lab_service_name import CreateLabServiceName, UpdateLabServiceName
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    lab_service_name = db.query(models.AR_LabServiceName).all()
    return lab_service_name

def find_all(db: Session):
    lab_service_name = db.query(models.AR_LabServiceName).filter(models.AR_LabServiceName.status != "Inactive" or models.AR_LabServiceName.status != "INACTIVE").all()
    return lab_service_name


def find_one(id, db: Session):
    lab_service_name = db.query(models.AR_LabServiceName).filter(models.AR_LabServiceName.id == id).first()
    if not lab_service_name:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Lab Service Name is not available.")
    return lab_service_name

def find_by_lab_service_name(lab_service_name, db: Session):
    lab_service_name = db.query(models.AR_LabServiceName).filter(models.AR_LabServiceName.lab_service_name == lab_service_name).first()
    if not lab_service_name:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Lab Service Name is not available.")
    return lab_service_name


def create(request: CreateLabServiceName, db: Session):
    new_lab_service_name = models.AR_LabServiceName(**request.dict(),
        id=str(uuid4()),
        )
        
    lab_service_name_var= request.lab_service_name
    if db.query(models.AR_LabServiceName).filter_by(lab_service_name= lab_service_name_var).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lab Service Name already exists.")
                            
    db.add(new_lab_service_name)
    db.commit()
    db.refresh(new_lab_service_name)
    return "Lab Service Name has been created."


def update(id, request: UpdateLabServiceName, db: Session):
    lab_service_name = db.query(models.AR_LabServiceName).filter(models.AR_LabServiceName.id == id)
    lab_service_name_same_name = db.query(models.AR_LabServiceName).filter(models.AR_LabServiceName.id != id)

    for row in lab_service_name_same_name:
        if row.lab_service_name == request.lab_service_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lab Service Name already exists.")

    if not lab_service_name.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Lab Service Name is not available.")

    
    lab_service_name_json = jsonable_encoder(request)     
    lab_service_name.update(lab_service_name_json)
                            
    db.commit()
    return f"Lab Service Name has been updated."


def deactivated(id, updated_by:str, db: Session):
    lab_service_name = db.query(models.AR_LabServiceName).filter(models.AR_LabServiceName.id == id)
    if not lab_service_name.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Lab Service Name is not available.")
    lab_service_name.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Lab Service Name has been deleted."
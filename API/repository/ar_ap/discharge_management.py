from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.discharge_management import CreateDischargeManagement, UpdateDischargeManagement
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    discharge_management = db.query(models.AR_DischargeManagement).all()
    return discharge_management

def find_all(db: Session):
    discharge_management = db.query(models.AR_DischargeManagement).\
        filter(models.AR_DischargeManagement.active_status != "Inactive").all()
    return discharge_management


def find_one(id, db: Session):
    discharge_management = db.query(models.AR_DischargeManagement).filter(models.AR_DischargeManagement.id == id).first()
    if not discharge_management:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Discharge Management  is not available.")
    return discharge_management

def find_by_discharge_no(discharge_no, db: Session):
    discharge_management = db.query(models.AR_DischargeManagement).filter(models.AR_DischargeManagement.discharge_no == discharge_no).first()
    if not discharge_management:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Discharge Management  is not available.")
    return discharge_management


def create(request: CreateDischargeManagement, db: Session):
    
    d = datetime.now()
    curr_date = d.strftime("%Y%m%d")

    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_discharge_management = models.AR_DischargeManagement(**request.dict(),
        discharge_id=str(uuid4()),
        discharge_no="DSCHRG"+ last_4_uuid + "-" + curr_date)
    
                            
    db.add(new_discharge_management)
    db.commit()
    db.refresh(new_discharge_management)
    return "Discharge Management  has been created."


def update(id, request: UpdateDischargeManagement, db: Session):
    discharge_management = db.query(models.AR_DischargeManagement).filter(models.AR_DischargeManagement.id == id)
    discharge_no_same = db.query(models.AR_DischargeManagement).filter(models.AR_DischargeManagement.id != id)

    for row in discharge_no_same:
        if row.discharge_no == request.discharge_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Discharge Management  already exists.")

    if not discharge_management.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Discharge Management  is not available.")

    
    discharge_management_json = jsonable_encoder(request)     
    discharge_management.update(discharge_management_json)
                            
    db.commit()
    return f"Discharge Management  has been updated."


def completed(id, updated_by:str, db: Session):
    discharge_management = db.query(models.AR_DischargeManagement).filter(models.AR_DischargeManagement.id == id)
    if not discharge_management.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Discharge Management  is not available.")
    discharge_management.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Discharge Management  has been completed."

from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.surgeries import CreateSurgery, UpdateSurgery
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    surgeries = db.query(models.AR_Surgery).all()
    return surgeries

def find_all(db: Session):
    surgeries = db.query(models.AR_Surgery).filter(models.AR_Surgery.status != "Completed").all()
    return surgeries


def find_one(id, db: Session):
    surgeries = db.query(models.AR_Surgery).filter(models.AR_Surgery.id == id).first()
    if not surgeries:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Surgery is not available.")
    return surgeries

def find_by_surgery_no(surgery_no, db: Session):
    surgeries = db.query(models.AR_Surgery).filter(models.AR_Surgery.surgery_no == surgery_no).first()
    if not surgeries:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Surgery is not available.")
    return surgeries


def create(request: CreateSurgery, db: Session):
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_surgeries = models.AR_Surgery(**request.dict(),
        id=str(uuid4()),
        surgery_no="SRGYS"+ last_4_uuid + "-" + str(random.randint(1111, 9999)))
        
    surgery_no_var="SRGYS"+ last_4_uuid + "-" + str(random.randint(1111, 9999))
    if db.query(models.AR_Surgery).filter_by(surgery_no= surgery_no_var).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Surgery already exists.")
                            
    db.add(new_surgeries)
    db.commit()
    db.refresh(new_surgeries)
    return "Surgery has been created."


def update(id, request: UpdateSurgery, db: Session):
    surgeries = db.query(models.AR_Surgery).filter(models.AR_Surgery.id == id)
    surgeries_same_name = db.query(models.AR_Surgery).filter(models.AR_Surgery.id != id)

    for row in surgeries_same_name:
        if row.surgery_no == request.surgery_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Surgery already exists.")

    if not surgeries.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Surgery is not available.")

    
    surgeries_json = jsonable_encoder(request)     
    surgeries.update(surgeries_json)
                            
    db.commit()
    return f"Surgery has been updated."


def completed(id, updated_by:str, db: Session):
    surgeries = db.query(models.AR_Surgery).filter(models.AR_Surgery.id == id)
    if not surgeries.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Surgery is not available.")
    surgeries.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Surgery has been completed."
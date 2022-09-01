from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.surgery_types import CreateSurgery_type, UpdateSurgery_type
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import or_


def datatable(db: Session):
    surgery_types = db.query(models.AR_Surgery_type).all()
    return surgery_types

def find_all(db: Session):                 #_or(models.AR_Sample.id==id,models.AR_Sample.title==title)
    surgery_types = db.query(models.AR_Surgery_type).filter(or_(models.AR_Surgery_type.status != "Inactive",models.AR_Surgery_type.status != "INACTIVE" )).all() 
    return surgery_types


def find_one(id, db: Session):
    surgery_types = db.query(models.AR_Surgery_type).filter(models.AR_Surgery_type.id == id).first()
    if not surgery_types:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Surgery type is not available.")
    return surgery_types

def find_by_surgery_type_name(surgery_type_name, db: Session):
    surgery_types = db.query(models.AR_Surgery_type).filter(models.AR_Surgery_type.surgery_type_name == surgery_type_name).first()
    if not surgery_types:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Surgery type is not available.")
    return surgery_types


def create(request: CreateSurgery_type, db: Session):
    new_surgery_types = models.AR_Surgery_type(**request.dict(),
        id=str(uuid4()),
        )
        
    surgery_type_name_var= request.surgery_type_name
    if db.query(models.AR_Surgery_type).filter_by(surgery_type_name= surgery_type_name_var).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Surgery type already exists.")
                            
    db.add(new_surgery_types)
    db.commit()
    db.refresh(new_surgery_types)
    return "Surgery type has been created."


def update(id, request: UpdateSurgery_type, db: Session):
    surgery_types = db.query(models.AR_Surgery_type).filter(models.AR_Surgery_type.id == id)
    surgery_types_same_name = db.query(models.AR_Surgery_type).filter(models.AR_Surgery_type.id != id)

    for row in surgery_types_same_name:
        if row.surgery_type_name == request.surgery_type_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Surgery type already exists.")

    if not surgery_types.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Surgery type is not available.")

    
    surgery_types_json = jsonable_encoder(request)     
    surgery_types.update(surgery_types_json)
                            
    db.commit()
    return f"Surgery type has been updated."


def deactivated(id, updated_by:str, db: Session):
    surgery_types = db.query(models.AR_Surgery_type).filter(models.AR_Surgery_type.id == id)
    if not surgery_types.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Surgery type is not available.")
    surgery_types.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Surgery type has been deleted."
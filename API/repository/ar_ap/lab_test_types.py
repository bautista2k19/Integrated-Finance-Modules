from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.lab_test_types import CreateLab_test_type, UpdateLab_test_type
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    lab_test_types = db.query(models.AR_Lab_test_type).all()
    return lab_test_types

def find_all(db: Session):
    lab_test_types = db.query(models.AR_Lab_test_type).filter(models.AR_Lab_test_type.status != "Inactive").all()
    return lab_test_types


def find_one(id, db: Session):
    lab_test_types = db.query(models.AR_Lab_test_type).filter(models.AR_Lab_test_type.id == id).first()
    if not lab_test_types:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Lab test type is not available.")
    return lab_test_types

def find_by_lab_test_type_name(lab_test_type_name, db: Session):
    lab_test_types = db.query(models.AR_Lab_test_type).filter(models.AR_Lab_test_type.lab_test_type_name == lab_test_type_name).first()
    if not lab_test_types:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Lab test type is not available.")
    return lab_test_types


def create(request: CreateLab_test_type, db: Session):
    new_lab_test_types = models.AR_Lab_test_type(**request.dict(),
        id=str(uuid4()),
        )
        
    lab_test_type_name_var= request.lab_test_type_name
    if db.query(models.AR_Lab_test_type).filter_by(lab_test_type_name= lab_test_type_name_var).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lab test type already exists.")
                            
    db.add(new_lab_test_types)
    db.commit()
    db.refresh(new_lab_test_types)
    return "Lab test type has been created."


def update(id, request: UpdateLab_test_type, db: Session):
    lab_test_types = db.query(models.AR_Lab_test_type).filter(models.AR_Lab_test_type.id == id)
    lab_test_types_same_name = db.query(models.AR_Lab_test_type).filter(models.AR_Lab_test_type.id != id)

    for row in lab_test_types_same_name:
        if row.lab_test_type_name == request.lab_test_type_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lab test type already exists.")

    if not lab_test_types.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Lab test type is not available.")

    
    lab_test_types_json = jsonable_encoder(request)     
    lab_test_types.update(lab_test_types_json)
                            
    db.commit()
    return f"Lab test type has been updated."


def deactivated(id, updated_by:str, db: Session):
    lab_test_types = db.query(models.AR_Lab_test_type).filter(models.AR_Lab_test_type.id == id)
    if not lab_test_types.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Lab test type is not available.")
    lab_test_types.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Lab test type has been deleted."
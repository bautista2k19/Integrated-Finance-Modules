from API.schemas.cms.collection.surgery_type import CreateSurgeryType, UpdateSurgeryType
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    surgery_types = db.query(API.Surgery_type).all()
    return surgery_types

def find_all(db: Session):
    surgery_types = db.query(API.Surgery_type).filter(API.Surgery_type.status != "Inactive").all()
    return surgery_types


def find_one(id, db: Session):
    surgery_type = db.query(API.Surgery_type).filter(API.Surgery_type.id == id).first()
    if not surgery_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Surgery Type is not available.")
    return surgery_type


def create(request: CreateSurgeryType, db: Session):
    new_surgery_type = API.Surgery_type(**request.dict(), id=str(uuid4()))

    if db.query(API.Surgery_type).filter_by(name=request.name).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Surgery Type already exists.")
    db.add(new_surgery_type)
    db.commit()
    db.refresh(new_surgery_type)
    return "Surgery Type has been created."


def update(id, request: UpdateSurgeryType, db: Session):
    surgery_type = db.query(API.Surgery_type).filter(API.Surgery_type.id == id)
    surgery_type_same_name = db.query(API.Surgery_type).filter(API.Surgery_type.id != id)

    for row in surgery_type_same_name:
        if row.name == request.name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Surgery Type already exists.")

    if not surgery_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Surgery Type is not available.")
                            
    surgery_type_json = jsonable_encoder(request)     
    surgery_type.update(surgery_type_json)
    db.commit()
    return f"Surgery Type has been updated."


def delete(id, updated_by:str, db: Session):
    surgery_type = db.query(API.Surgery_type).filter(API.Surgery_type.id == id)
    if not surgery_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Surgery Type is not available.")
    surgery_type.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Surgery Type has been deactivated."

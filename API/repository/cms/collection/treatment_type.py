from API.schemas.cms.collection.treatment_type import CreateTreatmentType, UpdateTreatmentType
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    treatment_types = db.query(API.Treatment_type).all()
    return treatment_types

def find_all(db: Session):
    treatment_types = db.query(API.Treatment_type).filter(API.Treatment_type.status != "Inactive").all()
    return treatment_types


def find_one(id, db: Session):
    treatment_type = db.query(API.Treatment_type).filter(API.Treatment_type.id == id).first()
    if not treatment_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Treatment type is not available.")
    return treatment_type


def create(request: CreateTreatmentType, db: Session):
    new_treatment_type = API.Treatment_type(**request.dict(), id=str(uuid4()))

    if db.query(API.Treatment_type).filter_by(name=request.name).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Treatment type already exists.")
    db.add(new_treatment_type)
    db.commit()
    db.refresh(new_treatment_type)
    return "Treatment type has been created."


def update(id, request: UpdateTreatmentType, db: Session):
    treatment_type = db.query(API.Treatment_type).filter(API.Treatment_type.id == id)
    treatment_type_same_name = db.query(API.Treatment_type).filter(API.Treatment_type.id != id)

    for row in treatment_type_same_name:
        if row.name == request.name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Treatment type already exists.")

    if not treatment_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Treatment type is not available.")
                            
    treatment_type_json = jsonable_encoder(request)     
    treatment_type.update(treatment_type_json)
    db.commit()
    return f"Treatment type has been updated."


def delete(id, updated_by:str, db: Session):
    treatment_type = db.query(API.Treatment_type).filter(API.Treatment_type.id == id)
    if not treatment_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Treatment type is not available.")
    treatment_type.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Treatment type has been deactivated."

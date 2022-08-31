from datetime import datetime

from sqlalchemy.orm.session import Session

from API.schemas.cms.collection.lab_test_type import CreateLabTestType, UpdateLabTestType
from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    lab_test_types = db.query(API.Lab_test_type).all()
    return lab_test_types

def find_all(db: Session):
    lab_test_types = db.query(API.Lab_test_type).filter(API.Lab_test_type.status != "Inactive").all()
    return lab_test_types


def find_one(id, db: Session):
    lab_test_type = db.query(API.Lab_test_type).filter(API.Lab_test_type.id == id).first()
    if not lab_test_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Lab test type is not available.")
    return lab_test_type


def create(request: CreateLabTestType, db: Session):
    new_lab_test_type = API.Lab_test_type(**request.dict(), id=str(uuid4()))

    if db.query(API.Lab_test_type).filter_by(name=request.name).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lab test type already exists.")
    db.add(new_lab_test_type)
    db.commit()
    db.refresh(new_lab_test_type)
    return "Lab test type has been created."


def update(id, request: UpdateLabTestType, db: Session):
    lab_test_type = db.query(API.Lab_test_type).filter(API.Lab_test_type.id == id)
    lab_test_type_same_name = db.query(API.Lab_test_type).filter(API.Lab_test_type.id != id)

    for row in lab_test_type_same_name:
        if row.name == request.name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lab test type already exists.")

    if not lab_test_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Lab test type is not available.")
                            
    lab_test_type_json = jsonable_encoder(request)     
    lab_test_type.update(lab_test_type_json)
    db.commit()
    return f"Lab test type has been updated."


def delete(id, updated_by:str, db: Session):
    lab_test_type = db.query(API.Lab_test_type).filter(API.Lab_test_type.id == id)
    if not lab_test_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Lab test type is not available.")
    lab_test_type.update({
                    'status': 'Inactive',
                    'updated_by': updated_by})
    db.commit()
    return f"Lab test type has been deactivated."

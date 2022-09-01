from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.treatment_types import CreateTreatment_type, UpdateTreatment_type
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    treatment_types = db.query(models.AR_Treatment_type).all()
    return treatment_types

def find_all(db: Session):
    treatment_types = db.query(models.AR_Treatment_type).filter(models.AR_Treatment_type.status != "Completed").all()
    return treatment_types


def find_one(id, db: Session):
    treatment_types = db.query(models.AR_Treatment_type).filter(models.AR_Treatment_type.id == id).first()
    if not treatment_types:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Treatment typeis not available.")
    return treatment_types

# def find_by_invoice_no(invoice_no, db: Session):
#     treatment_types = db.query(models.AR_Treatment_type).filter(models.AR_Treatment_type.invoice_no == invoice_no).first()
#     if not treatment_types:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail="Treatment typeis not available.")
#     return treatment_types


def create(request: CreateTreatment_type, db: Session):
    
    new_treatment_types = models.AR_Treatment_type(**request.dict(),
        id=str(uuid4()),
        )
    db.add(new_treatment_types)
    db.commit()
    db.refresh(new_treatment_types)
    return "Treatment typehas been created."


def update(id, request: UpdateTreatment_type, db: Session):
    treatment_types = db.query(models.AR_Treatment_type).filter(models.AR_Treatment_type.id == id)
    treatment_types_same_name = db.query(models.AR_Treatment_type).filter(models.AR_Treatment_type.id != id)

    for row in treatment_types_same_name:
        if row.invoice_date == request.invoice_date:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Treatment typealready exists.")

    if not treatment_types.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Treatment typeis not available.")

    
    treatment_types_json = jsonable_encoder(request)     
    treatment_types.update(treatment_types_json)
                            
    db.commit()
    return f"Treatment typehas been updated."


def completed(id, updated_by:str, db: Session):
    treatment_types = db.query(models.AR_Treatment_type).filter(models.AR_Treatment_type.id == id)
    if not treatment_types.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Treatment typeis not available.")
    treatment_types.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Treatment typehas been completed."
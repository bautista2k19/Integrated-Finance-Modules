from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.surgery_in_charge import CreateSurgeryInCharge, UpdateSurgeryInCharge
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    surgery_in_charge = db.query(models.AR_SurgeryInCharge).all()
    return surgery_in_charge

def find_all(db: Session):
    surgery_in_charge = db.query(models.AR_SurgeryInCharge).filter(models.AR_SurgeryInCharge.status != "Completed").all()
    return surgery_in_charge


def find_one(id, db: Session):
    surgery_in_charge = db.query(models.AR_SurgeryInCharge).filter(models.AR_SurgeryInCharge.id == id).first()
    if not surgery_in_charge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Surgery In Charge is not available.")
    return surgery_in_charge

# def find_by_invoice_no(invoice_no, db: Session):
#     surgery_in_charge = db.query(models.AR_SurgeryInCharge).filter(models.AR_SurgeryInCharge.invoice_no == invoice_no).first()
#     if not surgery_in_charge:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail="Surgery In Charge is not available.")
#     return surgery_in_charge


def create(request: CreateSurgeryInCharge, db: Session):
    
    new_surgery_in_charge = models.AR_SurgeryInCharge(**request.dict(),
        id=str(uuid4()),
        )
    db.add(new_surgery_in_charge)
    db.commit()
    db.refresh(new_surgery_in_charge)
    return "Surgery In Charge has been created."


def update(id, request: UpdateSurgeryInCharge, db: Session):
    surgery_in_charge = db.query(models.AR_SurgeryInCharge).filter(models.AR_SurgeryInCharge.id == id)
    surgery_in_charge_same_name = db.query(models.AR_SurgeryInCharge).filter(models.AR_SurgeryInCharge.id != id)

    for row in surgery_in_charge_same_name:
        if row.invoice_date == request.invoice_date:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Surgery In Charge already exists.")

    if not surgery_in_charge.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Surgery In Charge is not available.")

    
    surgery_in_charge_json = jsonable_encoder(request)     
    surgery_in_charge.update(surgery_in_charge_json)
                            
    db.commit()
    return f"Surgery In Charge has been updated."


def completed(id, updated_by:str, db: Session):
    surgery_in_charge = db.query(models.AR_SurgeryInCharge).filter(models.AR_SurgeryInCharge.id == id)
    if not surgery_in_charge.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Surgery In Charge is not available.")
    surgery_in_charge.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    })
    db.commit()
    return f"Surgery In Charge has been completed."
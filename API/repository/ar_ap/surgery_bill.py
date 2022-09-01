from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.surgery_bill import CreateSurgeryBill, UpdateSurgeryBill
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    surgery_bill = db.query(models.AR_SurgeryBill).all()
    return surgery_bill

def find_all(db: Session):
    surgery_bill = db.query(models.AR_SurgeryBill).filter(models.AR_SurgeryBill.status != "Completed").all()
    return surgery_bill


def find_one(id, db: Session):
    surgery_bill = db.query(models.AR_SurgeryBill).filter(models.AR_SurgeryBill.id == id).first()
    if not surgery_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Surgery bill invoice is not available.")
    return surgery_bill

def find_by_invoice_no(invoice_no, db: Session):
    surgery_bill = db.query(models.AR_SurgeryBill).filter(models.AR_SurgeryBill.invoice_no == invoice_no).first()
    if not surgery_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Surgery bill invoice is not available.")
    return surgery_bill


def create(request: CreateSurgeryBill, db: Session):
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_surgery_bill = models.AR_SurgeryBill(**request.dict(),
        id=str(uuid4()),
        invoice_no="SRGY"+ last_4_uuid + "-" + str(random.randint(1111, 9999)))
        
    invoice_no_var="SRGY"+ last_4_uuid + "-" + str(random.randint(1111, 9999))
    if db.query(models.AR_SurgeryBill).filter_by(invoice_no= invoice_no_var).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Surgery bill invoice already exists.")
                            
    db.add(new_surgery_bill)
    db.commit()
    db.refresh(new_surgery_bill)
    return "Surgery bill invoice has been created."


def update(id, request: UpdateSurgeryBill, db: Session):
    surgery_bill = db.query(models.AR_SurgeryBill).filter(models.AR_SurgeryBill.id == id)
    surgery_bill_same_name = db.query(models.AR_SurgeryBill).filter(models.AR_SurgeryBill.id != id)

    for row in surgery_bill_same_name:
        if row.invoice_date == request.invoice_date:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Surgery bill invoice already exists.")

    if not surgery_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Surgery bill invoice is not available.")

    
    surgery_bill_json = jsonable_encoder(request)     
    surgery_bill.update(surgery_bill_json)
                            
    db.commit()
    return f"Surgery bill invoice has been updated."


def completed(id, updated_by:str, db: Session):
    surgery_bill = db.query(models.AR_SurgeryBill).filter(models.AR_SurgeryBill.id == id)
    if not surgery_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Surgery bill invoice is not available.")
    surgery_bill.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Surgery bill invoice has been completed."
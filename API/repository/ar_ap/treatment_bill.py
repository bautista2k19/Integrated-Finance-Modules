import re
from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.treatment_bill import CreateTreatmentBill, UpdateTreatmentBill
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import or_




def datatable(db: Session):
    treatment_bill = db.query(models.AR_TreatmentBill).all()
    return treatment_bill

def find_all(db: Session):
    treatment_bill = db.query(models.AR_TreatmentBill).filter(or_(models.AR_TreatmentBill.status != "Inactive",models.AR_TreatmentBill.status != "INACTIVE" )).all() 
    return treatment_bill


def find_one(id, db: Session):
    treatment_bill = db.query(models.AR_TreatmentBill).filter(models.AR_TreatmentBill.id == id).first()
    if not treatment_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Treatment Bill is not available.")
    return treatment_bill

def find_by_invoice_no(invoice_no, db: Session):
    treatment_bill = db.query(models.AR_TreatmentBill).filter(models.AR_TreatmentBill.invoice_no == invoice_no).first()
    if not treatment_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Treatment Bill is not available.")
    return treatment_bill


def create(request: CreateTreatmentBill, db: Session):
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])

    tmp_quantity= db.query(models.AR_Treatment,models.AR_TreatmentServiceName).join(models.AR_TreatmentServiceName).filter(models.AR_Treatment.id == request.treatment_id).first()
    # print(tmp_quantity.Treatment.quantity)
    ifgreaterthan = tmp_quantity.Treatment.quantity
    tmp = tmp_quantity.Treatment.quantity - request.cancellation_return
    total_amount = tmp * tmp_quantity.TreatmentServiceName.unit_price
    #print(f"tmp: {tmp} total_amount:{total_amount}")

    if request.cancellation_return > ifgreaterthan or request.cancellation_return < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Exceeded the quantity")
    
    new_surgery_bill = models.AR_TreatmentBill(**request.dict(),
        id=str(uuid4()),
        invoice_no="TRTMNTBILL"+ last_4_uuid + "-" + str(random.randint(1111, 9999)),
        total_amount=total_amount
        )
        
    if db.query(models.AR_TreatmentBill).filter_by(treatment_id= request.treatment_id).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Treatment Bill invoice already exists.")
                            
    db.add(new_surgery_bill)
    db.commit()
    db.refresh(new_surgery_bill)
    return "Treatment Bill invoice has been created."

def update(id, request: UpdateTreatmentBill, db: Session):
    treatment_bill = db.query(models.AR_TreatmentBill).filter(models.AR_TreatmentBill.id == id)
    invoice_no_same_name = db.query(models.AR_TreatmentBill).filter(models.AR_TreatmentBill.id != id)

    for row in invoice_no_same_name:
        if row.invoice_no == request.invoice_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Treatment Bill already exists.")

    if not treatment_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Treatment Bill is not available.")

    
    treatment_bill_json = jsonable_encoder(request)     
    treatment_bill.update(treatment_bill_json)
                            
    db.commit()
    return f"Treatment Bill has been updated."


def completed(id, updated_by:str, db: Session):
    treatment_bill = db.query(models.AR_TreatmentBill).filter(models.AR_TreatmentBill.id == id)
    if not treatment_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Treatment Bill is not available.")
    treatment_bill.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Treatment Bill has been completed."

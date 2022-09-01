import re
from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.pharmacy_bill import CreatePharmacyBill, UpdatePharmacyBill
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import or_




def datatable(db: Session):
    pharmacy_bill = db.query(models.AR_PharmacyBill).all()
    return pharmacy_bill

def find_all(db: Session):
    pharmacy_bill = db.query(models.AR_PharmacyBill).filter(or_(models.AR_PharmacyBill.status != "Inactive",models.AR_PharmacyBill.status != "INACTIVE" )).all() 
    return pharmacy_bill


def find_one(id, db: Session):
    pharmacy_bill = db.query(models.AR_PharmacyBill).filter(models.AR_PharmacyBill.id == id).first()
    if not pharmacy_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Pharmacy Bill is not available.")
    return pharmacy_bill

def find_by_invoice_no(invoice_no, db: Session):
    pharmacy_bill = db.query(models.AR_PharmacyBill).filter(models.AR_PharmacyBill.invoice_no == invoice_no).first()
    if not pharmacy_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Pharmacy Bill is not available.")
    return pharmacy_bill


def create(request: CreatePharmacyBill, db: Session):
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])

    tmp_quantity= db.query(models.AR_Medicine_PR,models.AR_Medicine).join(models.AR_Medicine).filter(models.AR_Medicine_PR.medpr_id == request.prescription_id).first()
    # print(tmp_quantity.Medicine_PR.quantity)

    
    ifgreaterthan = tmp_quantity.Medicine_PR.quantity
    tmp = tmp_quantity.Medicine_PR.quantity - request.cancellation_return
    total_amount = tmp * tmp_quantity.Medicine.med_unit_price
    
    # print(f"tmp: {tmp} total_amount:{total_amount}")

    if request.cancellation_return > ifgreaterthan or request.cancellation_return < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Exceeded the quantity")
    
    new_surgery_bill = models.AR_PharmacyBill(**request.dict(),
        id=str(uuid4()),
        invoice_no="PHRMCYBL"+ last_4_uuid + "-" + str(random.randint(1111, 9999)),
        total_amount=total_amount
        )
        
    if db.query(models.AR_PharmacyBill).filter_by(prescription_id= request.prescription_id).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Pharmacy Bill invoice already exists.")
                            
    db.add(new_surgery_bill)
    db.commit()
    db.refresh(new_surgery_bill)
    return "Pharmacy Bill invoice has been created."

def update(id, request: UpdatePharmacyBill, db: Session):
    pharmacy_bill = db.query(models.AR_PharmacyBill).filter(models.AR_PharmacyBill.id == id)
    invoice_no_same_name = db.query(models.AR_PharmacyBill).filter(models.AR_PharmacyBill.id != id)

    for row in invoice_no_same_name:
        if row.invoice_no == request.invoice_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Pharmacy Bill already exists.")

    if not pharmacy_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Pharmacy Bill is not available.")

    
    pharmacy_bill_json = jsonable_encoder(request)     
    pharmacy_bill.update(pharmacy_bill_json)
                            
    db.commit()
    return f"Pharmacy Bill has been updated."


def completed(id, updated_by:str, db: Session):
    pharmacy_bill = db.query(models.AR_PharmacyBill).filter(models.AR_PharmacyBill.id == id)
    if not pharmacy_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Pharmacy Bill is not available.")
    pharmacy_bill.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Pharmacy Bill has been completed."

import re
from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.lab_requests_bill import CreateLabRequestBill, UpdateLabRequestBill
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import or_




def datatable(db: Session):
    lab_requests_bill = db.query(models.AR_LabRequestBill).all()
    return lab_requests_bill

def find_all(db: Session):
    lab_requests_bill = db.query(models.AR_LabRequestBill).filter(or_(models.AR_LabRequestBill.status != "Inactive",models.AR_LabRequestBill.status != "INACTIVE" )).all() 
    return lab_requests_bill


def find_one(id, db: Session):
    lab_requests_bill = db.query(models.AR_LabRequestBill).filter(models.AR_LabRequestBill.id == id).first()
    if not lab_requests_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Lab Request Bill is not available.")
    return lab_requests_bill

def find_by_invoice_no(invoice_no, db: Session):
    lab_requests_bill = db.query(models.AR_LabRequestBill).filter(models.AR_LabRequestBill.invoice_no == invoice_no).first()
    if not lab_requests_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Lab Request Bill is not available.")
    return lab_requests_bill


def create(request: CreateLabRequestBill, db: Session):
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])

    tmp_quantity= db.query(models.AR_LabRequest,models.AR_LabServiceName).join(models.AR_LabServiceName).filter(models.AR_LabRequest.id == request.lab_requests_id).first()
    # print(tmp_quantity.LabRequest.quantity)
    ifgreaterthan = tmp_quantity.LabRequest.quantity
    tmp = tmp_quantity.LabRequest.quantity - request.cancellation_return
    total_amount = tmp * tmp_quantity.LabServiceName.unit_price
    #print(f"tmp: {tmp} total_amount:{total_amount}")

    if request.cancellation_return > ifgreaterthan or request.cancellation_return < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Exceeded the quantity")
    
    new_surgery_bill = models.AR_LabRequestBill(**request.dict(),
        id=str(uuid4()),
        invoice_no="LABRQST"+ last_4_uuid + "-" + str(random.randint(1111, 9999)),
        total_amount=total_amount
        )
        
    if db.query(models.AR_LabRequestBill).filter_by(lab_requests_id= request.lab_requests_id).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lab Request Bill invoice already exists.")
                            
    db.add(new_surgery_bill)
    db.commit()
    db.refresh(new_surgery_bill)
    return "Lab Request Bill invoice has been created."

def update(id, request: UpdateLabRequestBill, db: Session):
    lab_requests_bill = db.query(models.AR_LabRequestBill).filter(models.AR_LabRequestBill.id == id)
    invoice_no_same_name = db.query(models.AR_LabRequestBill).filter(models.AR_LabRequestBill.id != id)

    for row in invoice_no_same_name:
        if row.invoice_no == request.invoice_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lab Request Bill already exists.")

    if not lab_requests_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Lab Request Bill is not available.")

    
    lab_requests_bill_json = jsonable_encoder(request)     
    lab_requests_bill.update(lab_requests_bill_json)
                            
    db.commit()
    return f"Lab Request Bill has been updated."


def completed(id, updated_by:str, db: Session):
    lab_requests_bill = db.query(models.AR_LabRequestBill).filter(models.AR_LabRequestBill.id == id)
    if not lab_requests_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Lab Request Bill is not available.")
    lab_requests_bill.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Lab Request Bill has been completed."

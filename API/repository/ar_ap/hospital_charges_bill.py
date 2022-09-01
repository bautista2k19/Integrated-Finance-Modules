import re
from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.hospital_charges_bill import CreateHospitalChargesBill, UpdateHospitalChargesBill
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import or_




def datatable(db: Session):
    hospital_charges_bill = db.query(models.AR_HospitalChargesBill).all()
    return hospital_charges_bill

def find_all(db: Session):
    hospital_charges_bill = db.query(models.AR_HospitalChargesBill).filter(or_(models.AR_HospitalChargesBill.status != "Inactive",models.AR_HospitalChargesBill.status != "INACTIVE" )).all() 
    return hospital_charges_bill


def find_one(id, db: Session):
    hospital_charges_bill = db.query(models.AR_HospitalChargesBill).filter(models.AR_HospitalChargesBill.id == id).first()
    if not hospital_charges_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hospital Charges Bill is not available.")
    return hospital_charges_bill

def find_by_invoice_no(invoice_no, db: Session):
    hospital_charges_bill = db.query(models.AR_HospitalChargesBill).filter(models.AR_HospitalChargesBill.invoice_no == invoice_no).first()
    if not hospital_charges_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hospital Charges Bill is not available.")
    return hospital_charges_bill

    

def create(request: CreateHospitalChargesBill, db: Session):
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])

    tmp_quantity= db.query(models.AR_HospitalServices,models.AR_HospitalServiceName).join(models.AR_HospitalServiceName).filter(models.AR_HospitalServices.id == request.hospital_services_id).first()
    # print(tmp_quantity.HospitalServices.quantity)
    iflessthan = tmp_quantity.HospitalServices.quantity
    tmp = tmp_quantity.HospitalServices.quantity - request.cancellation_return
    total_amount = tmp * tmp_quantity.HospitalServiceName.unit_price
    # print(f"tmp: {tmp} total_amount:{total_amount}")

    if request.cancellation_return > iflessthan and request.cancellation_return < 0 :
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Exceeded the quantity")
    
    new_surgery_bill = models.AR_HospitalChargesBill(**request.dict(),
        id=str(uuid4()),
        invoice_no="HSPTLCHRGS"+ last_4_uuid + "-" + str(random.randint(1111, 9999)),
        total_amount=total_amount
        )
        
    if db.query(models.AR_HospitalChargesBill).filter_by(hospital_services_id= request.hospital_services_id).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Hospital Charges Bill invoice already exists.")
                            
    db.add(new_surgery_bill)
    db.commit()
    db.refresh(new_surgery_bill)
    return "Hospital Charges Bill invoice has been created."

def update(id, request: UpdateHospitalChargesBill, db: Session):
    hospital_charges_bill = db.query(models.AR_HospitalChargesBill).filter(models.AR_HospitalChargesBill.id == id)
    invoice_no_same_name = db.query(models.AR_HospitalChargesBill).filter(models.AR_HospitalChargesBill.id != id)

    for row in invoice_no_same_name:
        if row.invoice_no == request.invoice_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Hospital Charges Bill already exists.")

    if not hospital_charges_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Hospital Charges Bill is not available.")

    
    hospital_charges_bill_json = jsonable_encoder(request)     
    hospital_charges_bill.update(hospital_charges_bill_json)
                            
    db.commit()
    return f"Hospital Charges Bill has been updated."


def completed(id, updated_by:str, db: Session):
    hospital_charges_bill = db.query(models.AR_HospitalChargesBill).filter(models.AR_HospitalChargesBill.id == id)
    if not hospital_charges_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Hospital Charges Bill is not available.")
    hospital_charges_bill.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Hospital Charges Bill has been completed."

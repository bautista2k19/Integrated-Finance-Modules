from ntpath import join
import re
from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.doctor_fee_bill import CreateDoctorFeeBill, UpdateDoctorFeeBill
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import or_


def datatable(db: Session):
    doctor_fee_bill = db.query(models.AR_DoctorFeeBill).all()
    return doctor_fee_bill

def find_all(db: Session):
    doctor_fee_bill = db.query(models.AR_DoctorFeeBill).filter(or_(models.AR_DoctorFeeBill.status != "Inactive",models.AR_DoctorFeeBill.status != "INACTIVE" )).all() 
    return doctor_fee_bill


def find_one(id, db: Session):
    doctor_fee_bill = db.query(models.AR_DoctorFeeBill).filter(models.AR_DoctorFeeBill.id == id).first()
    if not doctor_fee_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Doctor Fee Bill is not available.")
    return doctor_fee_bill

def find_by_invoice_no(invoice_no, db: Session):
    doctor_fee_bill = db.query(models.AR_DoctorFeeBill).filter(models.AR_DoctorFeeBill.invoice_no == invoice_no).first()
    if not doctor_fee_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Doctor Fee Bill is not available.")
  
    return doctor_fee_bill

    
def create(request: CreateDoctorFeeBill, db: Session):
 
    tmp_drfee= db.query(models.AR_SurgeryInCharge).select_from(models.AR_Inpatient).\
            join(models.AR_PatientRegistration).\
            join(models.AR_Surgery).\
            join(models.AR_SurgeryInCharge).all()
        
    for y in range(len(tmp_drfee)):
        new_doctor_fee = models.AR_DoctorFeeBill(**request.dict(),
                id=str(uuid4()),
                invoice_no="DRFEEBill"+ "-" + str(random.randint(1111, 9999)),
                invoice_date= datetime.now(),
                doctor_fee_id= (tmp_drfee[y].dr_in_charge_id),
                actual_pf= "100"
                )
        
    db.add(new_doctor_fee)
    db.commit()
    db.refresh(new_doctor_fee)
    return "Doctor Fee Bill invoice has been created."
  
 

def update(id, request: UpdateDoctorFeeBill, db: Session):
    doctor_fee_bill = db.query(models.AR_DoctorFeeBill).filter(models.AR_DoctorFeeBill.id == id)
    invoice_no_same_name = db.query(models.AR_DoctorFeeBill).filter(models.AR_DoctorFeeBill.id != id)

    for row in invoice_no_same_name:
        if row.invoice_no == request.invoice_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Doctor Fee Bill already exists.")

    if not doctor_fee_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Doctor Fee Bill is not available.")

    
    doctor_fee_bill_json = jsonable_encoder(request)     
    doctor_fee_bill.update(doctor_fee_bill_json)
                            
    db.commit()
    return f"Doctor Fee Bill has been updated."


def completed(id, updated_by:str, db: Session):
    doctor_fee_bill = db.query(models.AR_DoctorFeeBill).filter(models.AR_DoctorFeeBill.id == id)
    if not doctor_fee_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Doctor Fee Bill is not available.")
    doctor_fee_bill.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Doctor Fee Bill has been completed."

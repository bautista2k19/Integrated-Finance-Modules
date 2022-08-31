from sqlalchemy.orm.session import Session
from fastapi import HTTPException, status
from API import models as API


def find_all(db: Session):
    inpatients = db.query(API.Inpatient).filter(API.Inpatient.patient_status != "Inactive").all()
    return inpatients

def find_inpatient_prescription_bills(id, db: Session):
    inpatient_prescription_bills = db.query(API.Inpatient).filter(API.Inpatient.id == id).first()
    if not inpatient_prescription_bills:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Inpatient is not available.")
    return inpatient_prescription_bills  

def find_inpatient_inpatient_bills(id, db: Session):
    inpatient_inpatient_bills = db.query(API.Inpatient).filter(API.Inpatient.id == id).first()
    if not inpatient_inpatient_bills:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Inpatient is not available.")
    return inpatient_inpatient_bills    
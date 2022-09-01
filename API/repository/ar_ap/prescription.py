from datetime import date, datetime, timedelta
from API.schemas.ar_ap.prescription import CreatePrescription,Prescription
from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4



def datatable(db: Session):
    prescription = db.query(models.AR_Prescription).all()
    #users = db.query(models.AR_User, models.AR_Employee).join(models.AR_User).join(models.AR_Employee)
    return prescription

def find_one(id, db:Session):
    prescription = db.query(models.AR_Prescription).filter(models.AR_Prescription.prescription_id == id).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Prescription with the id {id} is not available.")
    return prescription

def create(request: CreatePrescription , db: Session):

    prescription = db.query(models.AR_Prescription).order_by(models.AR_Prescription.created_at.desc()).first()
    
    if not prescription:
        counter = 1001
    else:
        prescription = prescription.prescription_no
        curent_prescription_no = prescription.split("-")
        counter = int(curent_prescription_no[1])
        counter = counter + 1

    new_prescription = models.AR_Prescription(
    prescription_id = str(uuid4()),
    
    admission_id= request.admission_id,
    prescription_no = "PR-" + str(counter),
    created_by=request.created_by,
    created_at=datetime.now(),
    date_prescribed= datetime.now()
   
   
   
    )
    db.add(new_prescription)
    db.commit()
    db.refresh(new_prescription)
    return  new_prescription


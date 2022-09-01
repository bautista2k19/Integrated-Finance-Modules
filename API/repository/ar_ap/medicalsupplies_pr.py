from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.medicalsupplies_pr import CreateMedicalSupplies_PR, UpdateMedicalSupplies_PR
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    medicalsupplies_pr = db.query(models.AR_MedicalSupplies_PR).all()
    return medicalsupplies_pr

def find_all(db: Session):
    medicalsupplies_pr = db.query(models.AR_MedicalSupplies_PR).filter(models.AR_MedicalSupplies_PR.status != "Completed").all()
    return medicalsupplies_pr


def find_one(id, db: Session):
    medicalsupplies_pr = db.query(models.AR_MedicalSupplies_PR).filter(models.AR_MedicalSupplies_PR.id == id).first()
    if not medicalsupplies_pr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Medical Supplies prescription is not available.")
    return medicalsupplies_pr

def find_by_lab_request_no(ms_no, db: Session):
    medicalsupplies_pr = db.query(models.AR_MedicalSupplies_PR).filter(models.AR_MedicalSupplies_PR.ms_no == ms_no).first()
    if not medicalsupplies_pr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Medical Supplies prescription is not available.")
    return medicalsupplies_pr


def create(request: CreateMedicalSupplies_PR, db: Session):
    # d = datetime.now()
    # curr_date = d.strftime("%Y%m%d")

    # new_uuid = str(uuid4())
    # last_4_uuid = str(new_uuid[-4:])
    new_medicalsupplies_pr = models.AR_MedicalSupplies_PR(**request.dict(),
        medicsupp_prid=str(uuid4()),
        ms_no= str(random.randint(1111, 9999)) )
                            
    db.add(new_medicalsupplies_pr)
    db.commit()
    db.refresh(new_medicalsupplies_pr)
    return "Medical Supplies prescription has been created."


def update(id, request: UpdateMedicalSupplies_PR, db: Session):
    medicalsupplies_pr = db.query(models.AR_MedicalSupplies_PR).filter(models.AR_MedicalSupplies_PR.medicsupp_prid == id)
    medicalsupplies_pr_same_name = db.query(models.AR_MedicalSupplies_PR).filter(models.AR_MedicalSupplies_PR.medicsupp_prid != id)

    for row in medicalsupplies_pr_same_name:
        if row.ms_no == request.ms_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Medical Supplies prescription already exists.")

    if not medicalsupplies_pr.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Medical Supplies prescription is not available.")

    
    medicalsupplies_pr_json = jsonable_encoder(request)     
    medicalsupplies_pr.update(medicalsupplies_pr_json)
                            
    db.commit()
    return f"Medical Supplies prescription has been updated."


def completed(id, updated_by:str, db: Session):
    medicalsupplies_pr = db.query(models.AR_MedicalSupplies_PR).filter(models.AR_MedicalSupplies_PR.id == id)
    if not medicalsupplies_pr.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Medical Supplies prescription is not available.")
    medicalsupplies_pr.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by
                    })
    db.commit()
    return f"MedicalSupplies_PR has been deleted."
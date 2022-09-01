from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.insurances import CreateInsurance, UpdateInsurance
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    insurances = db.query(models.AR_Insurance).all()
    return insurances

def find_all(db: Session):
    insurances = db.query(models.AR_Insurance).filter(models.AR_Insurance.remarks != "Completed").all()
    return insurances


def find_one(id, db: Session):
    insurances = db.query(models.AR_Insurance).filter(models.AR_Insurance.insurance_id == id).first()
    if not insurances:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Insurance is not available.")
    return insurances

def find_by_policy_holder(policy_holder, db: Session):
    insurances = db.query(models.AR_Insurance).filter(models.AR_Insurance.policy_holder == policy_holder).first()
    if not insurances:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Insurance is not available.")
    return insurances


def create(request: CreateInsurance, db: Session):
    new_insurances = models.AR_Insurance(**request.dict(),
        insurance_id=str(uuid4())
        )
        
    db.add(new_insurances)
    db.commit()
    db.refresh(new_insurances)
    return "Insurance has been created."


def update(id, request: UpdateInsurance, db: Session):
    insurances = db.query(models.AR_Insurance).filter(models.AR_Insurance.insurance_id == id)
    if not insurances.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Insurance is not available.")

    
    insurances_json = jsonable_encoder(request)     
    insurances.update(insurances_json)
                            
    db.commit()
    return f"Insurance has been updated."


def completed(id, updated_by:str, db: Session):
    insurances = db.query(models.AR_Insurance).filter(models.AR_Insurance.insurance_id == id)
    if not insurances.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Insurance is not available.")
    insurances.update({
                    # 'status': 'Completed',
                    'remarks':'Sample Updated',
                    'updated_at': datetime.now(),
                    })
    db.commit()
    return f"Insurance has been completed."
from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.discount_privillages import CreateDiscount, UpdateDiscount
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random



def datatable(db: Session):
    discount_privillages = db.query(models.AR_Discount).all()
    return discount_privillages

def find_all(db: Session):
    discount_privillages = db.query(models.AR_Discount).filter(models.AR_Discount.status != "Completed").all()
    return discount_privillages


def find_one(id, db: Session):
    discount_privillages = db.query(models.AR_Discount).filter(models.AR_Discount.dp_id == id).first()
    if not discount_privillages:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Discount invoice is not available.")
    return discount_privillages

def find_by_invoice_no(dp_id, db: Session):
    discount_privillages = db.query(models.AR_Discount).filter(models.AR_Discount.dp_id == dp_id).first()
    if not discount_privillages:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Discount invoice is not available.")
    return discount_privillages


def create(request: CreateDiscount, db: Session):
    
    new_discount_privillages = models.AR_Discount(**request.dict(),
        dp_id=str(uuid4())
        )
                            
    db.add(new_discount_privillages)
    db.commit()
    db.refresh(new_discount_privillages)
    return "Discount invoice has been created."


def update(id, request: UpdateDiscount, db: Session):
    discount_privillages = db.query(models.AR_Discount).filter(models.AR_Discount.dp_id == id)
    discount_privillages_same_name = db.query(models.AR_Discount).filter(models.AR_Discount.dp_id != id)

    for row in discount_privillages_same_name:
        if row.pwd_id == request.pwd_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Discount invoice already exists.")

    if not discount_privillages.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Discount invoice is not available.")

    
    discount_privillages_json = jsonable_encoder(request)     
    discount_privillages.update(discount_privillages_json)
                            
    db.commit()
    return f"Discount invoice has been updated."


def completed(id, updated_by:str, db: Session):
    discount_privillages = db.query(models.AR_Discount).filter(models.AR_Discount.dp_id == id)
    if not discount_privillages.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Discount invoice is not available.")
    discount_privillages.update({
                    'pwd_id':'UPDATED PWD',
                    'updated_at': datetime.now(),
                    })
    db.commit()
    return f"Discount invoice has been completed."

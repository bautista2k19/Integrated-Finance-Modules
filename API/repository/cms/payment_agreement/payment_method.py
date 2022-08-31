from fastapi.encoders import jsonable_encoder
from API.schemas.cms.payment_agreement.payment_method import CreatePaymentMethod, UpdatePaymentMethod
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status
from uuid import uuid4


def datatable(db: Session):
    payment_methods = db.query(API.Payment_method).all()
    #payment_methods = db.query(models.Payment_method, models.Employee).join(models.Payment_method).join(models.Employee)
    return payment_methods

def find_all(db: Session):
    payment_methods = db.query(API.Payment_method).filter(API.Payment_method.status != "Inactive").all()
    return payment_methods


def find_one(id, db: Session):
    payment_method = db.query(API.Payment_method).filter(API.Payment_method.id == id).first()
    if not payment_method:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Payment Method is not available.")
    return payment_method


def create(request: CreatePaymentMethod, db: Session):
    new_payment_method = API.Payment_method(**request.dict(), id=str(uuid4()))

    if db.query(API.Payment_method).filter_by(method_name=request.method_name).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Payment Method already exists.")
    db.add(new_payment_method)
    db.commit()
    db.refresh(new_payment_method)
    return "Payment Method has been created."


def update(id, request: UpdatePaymentMethod, db: Session):
    payment_method = db.query(API.Payment_method).filter(API.Payment_method.id == id)
    payment_method_same_name = db.query(API.Payment_method).filter(API.Payment_method.id != id)

    for row in payment_method_same_name:
        if row.method_name == request.method_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Payment Method already exists.")

    if not payment_method.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Payment Method is not available.")

    
    payment_method_json = jsonable_encoder(request)     
    payment_method.update(payment_method_json)
                            
    db.commit()
    return f"Payment Method has been updated."


def delete(id, updated_by:str, db: Session):
    payment_method = db.query(API.Payment_method).filter(API.Payment_method.id == id)
    if not payment_method.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Payment Method is not available.")
    payment_method.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Payment Method has been deactivated."

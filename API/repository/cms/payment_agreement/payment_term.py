from fastapi.encoders import jsonable_encoder
from API.schemas.cms.payment_agreement.payment_term import CreatePaymentTerm, UpdatePaymentTerm
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status
from uuid import uuid4


def datatable(db: Session):
    payment_terms = db.query(API.Payment_term).all()
    return payment_terms

def find_all(db: Session):
    payment_terms = db.query(API.Payment_term).filter(API.Payment_term.status != "Inactive").all()
    return payment_terms


def find_one(id, db: Session):
    payment_term = db.query(API.Payment_term).filter(API.Payment_term.id == id).first()
    if not payment_term:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Payment term is not available.")
    return payment_term

def find_by_term_name(term_name, db: Session):
    payment_term = db.query(API.Payment_term).filter(API.Payment_term.term_name == term_name).first()
    if not payment_term:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Payment term is not available.")
    return payment_term


def create(request: CreatePaymentTerm, db: Session):
    new_payment_term = API.Payment_term(**request.dict(), id=str(uuid4()))

    if db.query(API.Payment_term).filter_by(term_name=request.term_name).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Payment term already exists.")
    db.add(new_payment_term)
    db.commit()
    db.refresh(new_payment_term)
    return "Payment term has been created."


def update(id, request: UpdatePaymentTerm, db: Session):
    payment_term = db.query(API.Payment_term).filter(API.Payment_term.id == id)
    payment_term_same_name = db.query(API.Payment_term).filter(API.Payment_term.id != id)

    for row in payment_term_same_name:
        if row.term_name == request.term_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Payment term already exists.")

    if not payment_term.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Payment term is not available.")

    
    payment_term_json = jsonable_encoder(request)     
    payment_term.update(payment_term_json)
                            
    db.commit()
    return f"Payment term has been updated."


def delete(id, updated_by:str, db: Session):
    payment_term = db.query(API.Payment_term).filter(API.Payment_term.id == id)
    if not payment_term.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Payment term is not available.")
    payment_term.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Payment term has been deactivated."

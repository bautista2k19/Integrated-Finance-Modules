from datetime import date, datetime
from uuid import uuid4

from fastapi.param_functions import Form
from API.routers.ar_ap import purchase_order
from API.schemas.ar_ap.purchase_order import CreatePurchase_order, DeletePurchase_order, Purchase_order, UpdatePurchase_order, ApprovedPurchase_order
from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status, File, UploadFile
import shutil




def datatable(db: Session):
    purchase_order = db.query(models.AR_Purchase_order).all()
    return purchase_order

def datatableApproved(db: Session):
    purchase_order = db.query(models.AR_Purchase_order).filter(models.AR_Purchase_order.status == "Approved").all()
    return purchase_order

def find_all(db: Session):
    purchase_order = db.query(models.AR_Purchase_order).filter(models.AR_Purchase_order.status != "Inactive").all()
    return purchase_order


def find_one(id, db: Session):
    purchase_order = db.query(models.AR_Purchase_order).filter(
        models.AR_Purchase_order.id == id).first()
    if not purchase_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Purchase order with the id {id} is not available.")
    return purchase_order


def create(db: Session,

           purchase_order_number: str = Form(...),
           total_bill: float = Form(...),
           order_date: date = Form(...),
           expected_delivery_date: date = Form(...),
           payment_method: str = Form(...),
           notes: str = Form(...),
           created_by: str = Form(None)
           ):  
 
 

    new_purchase_order = models.AR_Purchase_order(
        purchase_order_number=purchase_order_number,
        total_bill=total_bill,
        order_date=order_date,
        expected_delivery_date=expected_delivery_date,
        payment_method=payment_method,
        notes=notes,
        created_by=created_by,
        created_at=datetime.now(),
        id=str(uuid4())
    )
    # if db.query(models.AR_Purchase_order).filter_by(purchase_order_number=purchase_order_number).count() == 1:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
    #                         detail=f"Purchase order No. {purchase_order_number} already exists.")
    # if db.query(models.AR_Employee).filter_by(email=email).count() == 1:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
    #                         detail=f"Email address {email} already exists.")
    # if db.query(models.AR_Purchase_order).filter_by(
    #     first_name=first_name,
    #     middle_name=middle_name,
    #     last_name=last_name,
    #     extension_name=extension_name,
    # ).count() == 1:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
    #                         detail=f"Full name already exists.")
    #whwhahaha
    db.add(new_purchase_order)
    db.commit()
    db.refresh(new_purchase_order)
    return new_purchase_order  # {"detail": "New employee has been created."}


def update(id, db: Session,
           purchase_order_number: str = Form(...),
           total_bill: float = Form(...),
           order_date: date = Form(...),
           expected_delivery_date: date = Form(...),
           payment_method: str = Form(...),
           notes: str = Form(...), 
        #    status: str = Form(...), 
           updated_by: str = Form(None),
           updated_at: date = Form(None)
           ):

    

    purchase_order = db.query(models.AR_Purchase_order).filter(models.AR_Purchase_order.id == id)
  

    if not purchase_order.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"purchase_order_number with the id {id} is not available.")
 
    
    purchase_order.update({
            'purchase_order_number': purchase_order_number,
            'total_bill': total_bill,
            'order_date': order_date,
            'expected_delivery_date': expected_delivery_date,
            'payment_method': payment_method,
            'notes': notes,
            # 'status': status,
            'updated_by': updated_by,
            'updated_at': datetime.now()})
    db.commit()
    return f"Purchase order with the id {id} has been updated."


def delete(id, updated_by:str, db: Session):
    purchase_order_number = db.query(models.AR_Purchase_order).filter(models.AR_Purchase_order.id == id)
    if not purchase_order_number.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Purchase order_number with the id {id} is not available.")
    purchase_order_number.update({'status': 'Inactive',
                    'updated_at': datetime.now(),'updated_by': updated_by})
    db.commit()
    return f"Purchase order has been deactivated."




def approved(id, updated_by:str, db: Session):
    purchase_order_number = db.query(models.AR_Purchase_order).filter(models.AR_Purchase_order.id == id)
    if not purchase_order_number.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Purchase order_number with the id {id} is not available.")
    purchase_order_number.update({'status': 'Approved',
                    'updated_at': datetime.now(),'updated_by': updated_by})
    db.commit()
    return f"Purchase order has been approved."
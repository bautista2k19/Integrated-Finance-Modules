from datetime import datetime

from sqlalchemy.orm.session import Session
from sqlalchemy.sql.elements import not_

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    purchase_order_vendor_bill = db.query(API.Purchase_order_vendor_bill).all()
    return purchase_order_vendor_bill

def find_all(db: Session):
    purchase_order_vendor_bill = db.query(API.Purchase_order_vendor_bill).all()
    return purchase_order_vendor_bill

def find_all_pending(db: Session):
    purchase_order_vendor_bill = db.query(API.Purchase_order_vendor_bill).filter(not_(API.Purchase_order_vendor_bill.status.in_(["Paid"])) ).all()
    return purchase_order_vendor_bill

def find_purchase_order_vendor_bill(id,db: Session):
    purchase_order_vendor_bill = db.query(API.Purchase_order_vendor_bill).filter(API.Purchase_order_vendor_bill.id == id).first()
    if not purchase_order_vendor_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Purchase order bill not found.")
    return purchase_order_vendor_bill



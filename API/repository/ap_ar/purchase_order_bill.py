from datetime import datetime

from sqlalchemy.orm.session import Session
from sqlalchemy.sql.elements import not_

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    purchase_order_bill = db.query(API.Purchase_order_bill).all()
    return purchase_order_bill

def find_all(db: Session):
    purchase_order_bill = db.query(API.Purchase_order_bill).all()
    return purchase_order_bill

def find_all_pending(db: Session):
    purchase_order_bill = db.query(API.Purchase_order_bill).filter(not_(API.Purchase_order_bill.status.in_(["Paid"])) ).all()
    return purchase_order_bill


def find_one(id, db: Session):
    purchase_order_bill = db.query(API.Purchase_order_bill).filter(API.Purchase_order_bill.id == id).first()
    return purchase_order_bill

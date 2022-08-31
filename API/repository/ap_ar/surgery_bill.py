from datetime import datetime

from sqlalchemy.orm.session import Session

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    surgery_bill = db.query(API.Surgery_bill).all()
    return surgery_bill

def find_all(db: Session):
    surgery_bill = db.query(API.Surgery_bill).filter(
        API.Surgery_bill.status != "Inactive").all()
    return surgery_bill

def find_one(id, db: Session):
    surgery_bill = db.query(API.Surgery_bill).filter(API.Surgery_bill.id == id).first()
    return surgery_bill

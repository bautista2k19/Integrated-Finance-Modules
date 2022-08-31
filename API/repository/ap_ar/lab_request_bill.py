from datetime import datetime

from sqlalchemy.orm.session import Session

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    lab_request_bill = db.query(API.Lab_request_bill).all()
    return lab_request_bill

def find_all(db: Session):
    lab_request_bill = db.query(API.Lab_request_bill).filter(
        API.Lab_request_bill.status != "Inactive").all()
    return lab_request_bill

def find_one(id, db: Session):
    lab_request_bill = db.query(API.Lab_request_bill).filter(API.Lab_request_bill.id == id).first()
    return lab_request_bill
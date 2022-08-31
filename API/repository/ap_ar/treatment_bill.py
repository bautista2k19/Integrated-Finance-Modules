from datetime import datetime

from sqlalchemy.orm.session import Session

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    treatment_bill = db.query(API.Treatment_bill).all()
    return treatment_bill

def find_all(db: Session):
    treatment_bill = db.query(API.Treatment_bill).filter(
        API.Treatment_bill.status != "Inactive").all()
    return treatment_bill

def find_one(id, db: Session):
    treatment_bill = db.query(API.Treatment_bill).filter(API.Treatment_bill.id == id).first()
    return treatment_bill


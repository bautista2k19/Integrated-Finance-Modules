from datetime import datetime

from sqlalchemy.orm.session import Session
from sqlalchemy.sql.elements import not_

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    inpatient_bill = db.query(API.Inpatient_bill).all()
    return inpatient_bill

def find_all(db: Session):
    inpatient_bill = db.query(API.Inpatient_bill).all()
    return inpatient_bill

def find_all_pending(db: Session):
    inpatient_bill = db.query(API.Inpatient_bill).filter(not_(API.Inpatient_bill.status.in_(["Paid","Incomplete"])) ).all()
    return inpatient_bill

def find_inpatient_bill(id,db: Session):
    inpatient_bill = db.query(API.Inpatient_bill).filter(API.Inpatient_bill.id == id).first()
    if not inpatient_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inpatient bill not found.")
    return inpatient_bill



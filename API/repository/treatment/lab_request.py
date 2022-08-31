from datetime import datetime

from sqlalchemy.orm.session import Session
from sqlalchemy import and_

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    lab_request = db.query(API.Lab_request).all()
    return lab_request

def find_all(db: Session):
    lab_request = db.query(API.Lab_request).filter(API.Lab_request.outpatient_id != None).all()
    return lab_request

def find_all_out_pending(db: Session):
    lab_request = db.query(API.Lab_request).filter(and_(API.Lab_request.status == "Pending", API.Lab_request.outpatient_id != None) ).all()
    return lab_request

def find_one(id, db: Session):
    lab_request = db.query(API.Lab_request).filter(API.Lab_request.id == id).first()
    return lab_request


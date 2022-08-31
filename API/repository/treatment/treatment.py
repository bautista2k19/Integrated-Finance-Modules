from datetime import datetime

from sqlalchemy.orm.session import Session
from sqlalchemy import and_

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    treatment = db.query(API.Treatment).all()
    return treatment

def find_all(db: Session):
    treatment = db.query(API.Treatment).filter(API.Treatment.outpatient_id != None).all()
    return treatment


def find_all_out_pending(db: Session):
    treatment = db.query(API.Treatment).filter(and_(API.Treatment.status == "Pending", API.Treatment.outpatient_id != None) ).all()
    return treatment

def find_one(id, db: Session):
    treatment = db.query(API.Treatment).filter(API.Treatment.id == id).first()
    return treatment


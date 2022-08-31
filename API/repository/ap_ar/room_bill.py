from datetime import datetime

from sqlalchemy.orm.session import Session

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    room_bill = db.query(API.Room_bill).all()
    return room_bill

def find_all(db: Session):
    room_bill = db.query(API.Room_bill).filter(
        API.Room_bill.status != "Inactive").all()
    return room_bill

def find_one(id, db: Session):
    room_bill = db.query(API.Room_bill).filter(API.Room_bill.id == id).first()
    return room_bill


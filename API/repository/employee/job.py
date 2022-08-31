from datetime import datetime

from sqlalchemy.orm.session import Session
from sqlalchemy.sql.elements import not_

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    job = db.query(API.Job).all()
    return job


def find_all(db: Session):
    job = db.query(API.Job).filter(not_(API.Job.status.in_(["Inactive"])) ).all()
    return job
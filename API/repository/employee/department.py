from datetime import datetime

from sqlalchemy.orm.session import Session
from sqlalchemy.sql.elements import not_

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    department = db.query(API.Department).all()
    return department


def find_all(db: Session):
    department = db.query(API.Department).filter(not_(API.Department.status.in_(["Inactive"])) ).all()
    return department
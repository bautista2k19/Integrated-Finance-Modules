from datetime import datetime

from sqlalchemy.orm.session import Session
from sqlalchemy.sql.elements import not_

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    employee_type = db.query(API.Employee_type).all()
    return employee_type


def find_all(db: Session):
    employee_type = db.query(API.Employee_type).filter(not_(API.Employee_type.status.in_(["Inactive"])) ).all()
    return employee_type
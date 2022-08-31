from datetime import datetime

from sqlalchemy.orm.session import Session
from sqlalchemy.sql.elements import not_

from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4


def datatable(db: Session):
    user_type = db.query(API.User_type).all()
    return user_type


def find_all(db: Session):
    user_type = db.query(API.User_type).filter(not_(API.User_type.status.in_(["Inactive"])) ).all()
    return user_type
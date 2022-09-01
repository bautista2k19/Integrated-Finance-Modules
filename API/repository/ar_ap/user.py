from datetime import datetime

from API.schemas.ar_ap.user import CreateUser, UpdatePassword, UpdateUser, UpdateUsername, User
from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from API.hashing import hasher as Hash
from uuid import uuid4


def datatable(db: Session):
    users = db.query(models.AR_User).all()
    #users = db.query(models.AR_User, models.AR_AR_Employee).join(models.AR_User).join(models.AR_AR_Employee)
    return users

def find_all(db: Session):
    users = db.query(models.AR_User).filter(models.AR_User.status != "Inactive").all()
    return users


def find_one(id, db: Session):
    user = db.query(models.AR_User).filter(models.AR_User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")
    return user


def create(request: CreateUser, db: Session):
    new_user = models.AR_User(
        id=str(uuid4()),
        employee_id=request.employee_id,
        username=request.username,
        password=Hash.bcrypt(request.password),
        user_type=request.user_type,
        created_by=request.created_by,
        created_at=datetime.now())
    if db.query(models.AR_User).filter_by(username=request.username).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"User with the username {request.username} already exists.")
    if db.query(models.AR_User).filter_by(employee_id=request.employee_id).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Employee already have an account.")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def update(id, request: UpdateUser, db: Session):
    user = db.query(models.AR_User).filter(models.AR_User.id == id)
    user_same_username = db.query(models.AR_User).filter(models.AR_User.id != id)

    for row in user_same_username:
        if row.username == request.username:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Username already exists.")

    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")
    if not request.password:
        user.update({"employee_id":request.employee_id,
                    "username": request.username,
                    "user_type":request.user_type,
                    "updated_by":request.updated_by,
                    "updated_at":datetime.now()})
    else:
        user.update({"employee_id":request.employee_id,
            "username": request.username,
            "password": Hash.bcrypt(request.password),
            "user_type":request.user_type,
            "updated_by":request.updated_by,
            "updated_at":datetime.now()})
    db.commit()
    return f"User with the id {id} has been updated."

def update_username(id, request: UpdateUsername, db: Session):
    user = db.query(models.AR_User).filter(models.AR_User.id == id)
    user_same_username = db.query(models.AR_User).filter(models.AR_User.id != id)
    
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")

    if not Hash.verify(user.first().password,request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Incorrect password.")

    for row in user_same_username:
        if row.username == request.username:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Username already exists.")
    user.update({
        "username": request.username,
        "updated_by":request.updated_by,
        "updated_at":datetime.now()})

    db.commit()
    return f"User with the id {id} has been updated."

def update_password(id, request: UpdatePassword, db: Session):
    user = db.query(models.AR_User).filter(models.AR_User.id == id)
    
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")

    if not Hash.verify(user.first().password,request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Incorrect password.")

    user.update({
        "password": Hash.bcrypt(request.new_password),
        "updated_by":request.updated_by,
        "updated_at":datetime.now()})

    db.commit()
    return f"User with the id {id} has been updated."


def delete(id, updated_by:str, db: Session):
    user = db.query(models.AR_User).filter(models.AR_User.id == id)
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")
    user.update({'status': 'Inactive',
                    'updated_at': datetime.now(),'updated_by': updated_by})
    db.commit()
    return f"User has been deactivated."

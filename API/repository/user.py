from fastapi import HTTPException, status

from API.schemas.employee.user import CreateUser, UpdateEmail, UpdatePassword, UpdateUser

from API import database
from sqlalchemy.orm import Session
from uuid import uuid4
from API.hashing import hasher as Hash

from API import models as API

get_db = database.get_db

def datatable(db: Session):
    users = db.query(API.User).all()
    #users = db.query(models.User, models.Employee).join(models.User).join(models.Employee)
    return users

def create_user(request: CreateUser, db: Session):
    
    new_user = db.query(API.User).filter(API.User.email == request.email).first()
    if new_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")

    new_user = API.User(**request.dict(), id=str(uuid4()))
    del new_user.password
    new_user.password=Hash.bcrypt(request.password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return "New User has been created."

def active_users(db: Session):
    active_users = db.query(API.User).filter(API.User.status != "Inactive").all()
    if not active_users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Active User available.")
    return active_users

def inactive_users(db: Session):
    inactive_users = db.query(API.User).filter(API.User.status == "Inactive").all()
    if not inactive_users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Inactive User available.")
    return inactive_users

def find_user(id,db: Session):
    user = db.query(API.User).filter(API.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return user


def update(id, request: UpdateUser, db: Session):
    user = db.query(API.User).filter(API.User.id == id)
    user_same_username = db.query(API.User).filter(API.User.id != id)

    for row in user_same_username:
        if row.email == request.email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Email already exists.")

    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")
    if not request.password:
        user.update({"employee_id":request.employee_id,
                    "email": request.email,
                    "user_type_id":request.user_type_id,
                    "updated_by":request.updated_by})
    else:
        user.update({"employee_id":request.employee_id,
            "email": request.email,
            "password": Hash.bcrypt(request.password),
            "user_type_id":request.user_type_id,
            "updated_by":request.updated_by})
    db.commit()
    return f"User with the id {id} has been updated."


def update_email(id, request: UpdateEmail, db: Session):
    user = db.query(API.User).filter(API.User.id == id)
    user_same_email = db.query(API.User).filter(API.User.id != id)
    
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")

    if not Hash.verify(user.first().password,request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Incorrect password.")

    for row in user_same_email:
        if row.email == request.email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Email already exists.")
    user.update({
        "email": request.email,
        "updated_by":request.updated_by})

    db.commit()
    return f"User with the id {id} has been updated."

def update_password(id, request: UpdatePassword, db: Session):
    user = db.query(API.User).filter(API.User.id == id)
    
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")

    if not Hash.verify(user.first().password,request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Incorrect password.")

    user.update({
        "password": Hash.bcrypt(request.new_password),
        "updated_by":request.updated_by})

    db.commit()
    return f"User with the id {id} has been updated."

def delete(id, updated_by:str, db: Session):
    user = db.query(API.User).filter(API.User.id == id)
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")
    user.update({'status': 'Inactive',
                    'updated_by': updated_by})
    db.commit()
    return f"User has been deactivated."



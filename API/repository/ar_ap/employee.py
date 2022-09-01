from datetime import date, datetime
from uuid import uuid4

from fastapi.param_functions import Form
from API.schemas.ar_ap.employee import CreateEmployee, DeleteEmployee, Employee, UpdateEmployee
from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status, File, UploadFile
import shutil


def datatable(db: Session):
    employees = db.query(models.AR_Employee).all()
    return employees

def find_all(db: Session):
    employees = db.query(models.AR_Employee).filter(models.AR_Employee.status != "Inactive").all()
    return employees


def find_one(id, db: Session):
    employee = db.query(models.AR_Employee).filter(
        models.AR_Employee.id == id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Employee with the id {id} is not available.")
    return employee


def create(db: Session,
           photo: UploadFile = File(...),
           first_name: str = Form(...),
           middle_name: str = Form(None),
           last_name: str = Form(...),
           extension_name: str = Form(None),
           birthdate: date = Form(...),
           birthplace: str = Form(...),
           gender: str = Form(...),
           civil_status: str = Form(...),
           house_number: str = Form(None),
           street: str = Form(None),
           barangay: str = Form(...),
           city: str = Form(...),
           province: str = Form(...),
           country: str = Form(...),
           contact_number: str = Form(...),
           email: str = Form(...),
           department: str = Form(...),
           job: str = Form(...),
           hire_date: date = Form(...),
           manager: str = Form(...),
           created_by: str = Form(None)
           ):

    with open("AR_AP/front-end/static/image-upload/"+photo.filename, "wb") as image:
        shutil.copyfileobj(photo.file, image)
        photo = str("image-upload/"+photo.filename)

    new_employee = models.AR_Employee(
        photo=photo,
        first_name=first_name,
        middle_name=middle_name,
        last_name=last_name,
        extension_name=extension_name,
        birthdate=birthdate,
        birthplace=birthplace,
        gender=gender,
        civil_status=civil_status,
        house_number=house_number,
        street=street,
        barangay=barangay,
        city=city,
        province=province,
        country=country,
        contact_number=contact_number,
        email = email,
        department=department,
        job=job,
        hire_date=hire_date,
        manager=manager,
        created_by=created_by,
        created_at=datetime.now(),
        id=str(uuid4())
    )
    if db.query(models.AR_Employee).filter_by(contact_number=contact_number).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Contact number {contact_number} already exists.")
    if db.query(models.AR_Employee).filter_by(email=email).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Email address {email} already exists.")
    if db.query(models.AR_Employee).filter_by(
        first_name=first_name,
        middle_name=middle_name,
        last_name=last_name,
        extension_name=extension_name,
    ).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Full name already exists.")
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee  # {"detail": "New employee has been created."}


def update(id, db: Session,
           photo: UploadFile = File(None),
           first_name: str = Form(...),
           middle_name: str = Form(None),
           last_name: str = Form(...),
           extension_name: str = Form(None),
           birthdate: date = Form(...),
           birthplace: str = Form(...),
           gender: str = Form(...),
           civil_status: str = Form(...),
           house_number: str = Form(None),
           street: str = Form(None),
           barangay: str = Form(...),
           city: str = Form(...),
           province: str = Form(...),
           country: str = Form(...),
           contact_number: str = Form(...),
           email: str = Form(...),
           department: str = Form(...),
           job: str = Form(...),
           hire_date: date = Form(...),
           manager: str = Form(...),
           updated_by: str = Form(None)
           ):

    

    employee = db.query(models.AR_Employee).filter(models.AR_Employee.id == id)
    employee_same_full_name = db.query(models.AR_Employee).filter(models.AR_Employee.id != id)

    for row in employee_same_full_name:
        if row.contact_number == contact_number:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Phone Number already exists.")
        if row.email == email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Email Address already exists.")
        
        if row.first_name == first_name and row.middle_name == middle_name and row.last_name == last_name and row.extension_name == extension_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Full Name already exists.")

    if not employee.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Employee with the id {id} is not available.")
    if not photo:
        employee.update({
            'first_name': first_name,
            'middle_name': middle_name,
            'last_name': last_name,
            'extension_name': extension_name,
            'birthdate': birthdate,
            'birthplace': birthplace,
            'gender': gender,
            'civil_status': civil_status,
            'house_number': house_number,
            'street': street,
            'barangay': barangay,
            'city': city,
            'province': province,
            'country': country,
            'contact_number': contact_number,
            'email': email,
            'department': department,
            'job': job,
            'hire_date': hire_date,
            'manager': manager,
            'updated_by': updated_by,
            'updated_at': datetime.now()})
    else:
        with open("AR_AP/front-end/static/image-upload/"+photo.filename, "wb") as image:
            shutil.copyfileobj(photo.file, image)
            photo = str("image-upload/"+photo.filename)
        employee.update({
            'photo': photo,
            'first_name': first_name,
            'middle_name': middle_name,
            'last_name': last_name,
            'extension_name': extension_name,
            'birthdate': birthdate,
            'birthplace': birthplace,
            'gender': gender,
            'civil_status': civil_status,
            'house_number': house_number,
            'street': street,
            'barangay': barangay,
            'city': city,
            'province': province,
            'country': country,
            'contact_number': contact_number,
            'email': email,
            'department': department,
            'job': job,
            'hire_date': hire_date,
            'manager': manager,
            'updated_by': updated_by,
            'updated_at': datetime.now()})
    db.commit()
    return f"Employee with the id {id} has been updated."


def delete(id, updated_by:str, db: Session):
    employee = db.query(models.AR_Employee).filter(models.AR_Employee.id == id)
    if not employee.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Employee with the id {id} is not available.")
    employee.update({'status': 'Inactive',
                    'updated_at': datetime.now(),'updated_by': updated_by})
    db.commit()
    return f"Employee has been deactivated."

from datetime import date
from API.schemas.ar_ap.user import User
from API.schemas.ar_ap.employee import CreateEmployee, DeleteEmployee, Employee, ShowEmployee, UpdateEmployee
from typing import List
from fastapi import APIRouter, Depends, status, File, UploadFile, Form, responses
from API import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import employee

router = APIRouter(
    prefix="/AR_AP/user/employee",
    tags=['Employees']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowEmployee])
# 
def datatable(
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return employee.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowEmployee])
# 
def find_all(
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return employee.find_all(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowEmployee)
# 
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return employee.find_one(id, db)


@router.post('/', status_code=status.HTTP_201_CREATED, response_model=CreateEmployee)
def create(db: Session = Depends(get_db),
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
           created_by: str = Form(None),
           result = Depends(security.auth)#,current_user:User = Depends(oauth2.get_current_user)
           ):  # ,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return employee.create(db, photo,
                           first_name,
                           middle_name,
                           last_name,
                           extension_name,
                           birthdate,
                           birthplace,
                           gender,
                           civil_status,
                           house_number,
                           street,
                           barangay,
                           city,
                           province,
                           country,
                           contact_number,
                           email,
                           department,
                           job,
                           hire_date,
                           manager,
                           created_by)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
# 
def update(id, db: Session = Depends(get_db), photo: UploadFile = File(None),
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
           updated_by: str = Form(None),
           result = Depends(security.auth)
           ):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return employee.update(id, db, photo,
                           first_name,
                           middle_name,
                           last_name,
                           extension_name,
                           birthdate,
                           birthplace,
                           gender,
                           civil_status,
                           house_number,
                           street,
                           barangay,
                           city,
                           province,
                           country,
                           contact_number,
                           email,
                           department,
                           job,
                           hire_date,
                           manager,
                           updated_by)


@router.delete('/{id}/{updated_by}', status_code=status.HTTP_200_OK)
# ,current_user:User = Depends(oauth2.get_current_user)):
def delete(
    id, 
    updated_by: str, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return employee.delete(id, updated_by, db)

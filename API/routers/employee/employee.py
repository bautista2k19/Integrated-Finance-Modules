from datetime import date
from API.schemas.employee.user import User
from API.schemas.employee.employee import CreateEmployee,ShowEmployee, UpdateEmployee# DeleteEmployee, Employee, 
from typing import List
from fastapi import APIRouter, Depends, status, File, UploadFile, Form, responses
from ... import database, security#, oauth2
from sqlalchemy.orm import Session
from ...repository.employee import employee

router = APIRouter(
    prefix="/employee",
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
           birth_date: date = Form(...),
           gender: str = Form(...),
           civil_status: str = Form(...),
           house_number: str = Form(None),
           street: str = Form(None),
           barangay: str = Form(...),
           city: str = Form(...),
           province: str = Form(...),
           region: str = Form(...),
           zip_code:str = Form(...),
           contact_number: str = Form(...),
           department_id: str = Form(...),
           job_id: str = Form(...),
           employee_type_id: str = Form(...),
           hire_date: date = Form(...),
           created_by: str = Form(None),
           result = Depends(security.auth)
           ):  # ,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return employee.create(db, photo,
                           first_name,
                           middle_name,
                           last_name,
                           extension_name,
                           birth_date,
                           gender,
                           civil_status,
                           house_number,
                           street,
                           barangay,
                           city,
                           province,
                           region,
                           zip_code,
                           contact_number,
                           department_id,
                           job_id,
                           employee_type_id,
                           hire_date,
                           created_by)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
# 
def update(id, db: Session = Depends(get_db), photo: UploadFile = File(None),
           first_name: str = Form(...),
           middle_name: str = Form(None),
           last_name: str = Form(...),
           extension_name: str = Form(None),
           birth_date: date = Form(...),
           gender: str = Form(...),
           civil_status: str = Form(...),
           house_number: str = Form(None),
           street: str = Form(None),
           barangay: str = Form(...),
           city: str = Form(...),
           province: str = Form(...),
           region: str = Form(...),
           zip_code:str = Form(...),
           contact_number: str = Form(...),
           department_id: str = Form(...),
           job_id: str = Form(...),
           employee_type_id: str = Form(...),
           hire_date: date = Form(...),
           updated_by: str = Form(None),
           result = Depends(security.auth)
           ):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return employee.update(id, db, photo,
                           first_name,
                           middle_name,
                           last_name,
                           extension_name,
                           birth_date,
                           gender,
                           civil_status,
                           house_number,
                           street,
                           barangay,
                           city,
                           province,
                           region,
                           zip_code,
                           contact_number,
                           department_id,
                           job_id,
                           employee_type_id,
                           hire_date,
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

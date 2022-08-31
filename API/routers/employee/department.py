from datetime import date
from API.schemas.employee.user import User
from API.schemas.employee.department import ShowDepartment
from typing import List
from fastapi import APIRouter, Depends, status, File, UploadFile, Form, responses
from ... import database, security#, oauth2
from sqlalchemy.orm import Session
from ...repository.employee import department

router = APIRouter(
    prefix="/department",
    tags=['Departments']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowDepartment])
# 
def datatable(
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return department.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowDepartment])
# 
def find_all(
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return department.find_all(db)
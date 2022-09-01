from datetime import date
from API.schemas.ar_ap.user import User
from API.schemas.ar_ap.utilities import CreateUtilities, DeleteUtilities, ShowUtilities, UpdateUtilities, ApprovedUtilities
from typing import List
from fastapi import APIRouter, Depends, status, File, UploadFile, Form, responses
from API import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import utilities
 

router = APIRouter(
    prefix="/AR_AP/user/utilities",
    tags=['Utilities']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowUtilities])
# 
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return utilities.datatable(db)

@router.get('/datatableApproved', status_code=status.HTTP_200_OK, response_model=List[ShowUtilities])
# 
def datatableApproved(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return utilities.datatableApproved(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowUtilities])
# 
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return utilities.find_all(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowUtilities)
# 
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
): #, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return utilities.find_one(id, db)


@router.post('/', status_code=status.HTTP_201_CREATED, response_model=CreateUtilities)
def create(db: Session = Depends(get_db),
           utility_type: str = Form(...),
           utility_name: str = Form(...),
           utility_bill: float = Form(...),
           due_date: date = Form(...), 
           payment_method: str = Form(...),
           notes: str = Form(...), 
           created_by: str = Form(...),
           result = Depends(security.auth)#,current_user:User = Depends(oauth2.get_current_user)
           ):  # ,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return utilities.create(db, 
                           utility_type,
                           utility_name,
                           utility_bill,
                           due_date, 
                           payment_method,
                           notes, 
                            created_by)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id, db: Session = Depends(get_db), 
           utility_type: str = Form(...),
           utility_name: str = Form(...),
           utility_bill: float = Form(...),
           due_date: date = Form(...), 
           payment_method: str = Form(...),
           notes: str = Form(...),  
           updated_by: str = Form(None),
           result = Depends(security.auth)
           ):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return utilities.update(id, db,
                           utility_type, 
                           utility_name,
                           utility_bill,
                           due_date, 
                           payment_method,
                           notes, 
                           updated_by)


@router.delete('/{id}/{updated_by}', status_code=status.HTTP_200_OK)
# ,current_user:User = Depends(oauth2.get_current_user)):
def delete(
    id, 
    updated_by: str, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return utilities.delete(id, updated_by, db)

@router.put('/{id}/{updated_by}', status_code=status.HTTP_200_OK)
# ,current_user:User = Depends(oauth2.get_current_user)):
def approved(
    id, 
    updated_by: str, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return utilities.approved(id, updated_by, db)

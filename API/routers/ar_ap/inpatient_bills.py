from API.schemas.ar_ap.inpatient_bills import CreateInpatientBill, ShowInpatientBill, UpdateInpatientBill,CreateInpatientBillWhenAdmitted
from API.schemas.ar_ap.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from API import database, security#, oauth2
# , oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import inpatient_bills

# from AR_AP.repository.inpatient_bills import inpatient_bills

router = APIRouter(
    prefix="/AR_AP/user/inpatient_bills",
    tags=['Inpatient Bill']
)

get_db = database.get_db



# @router.put('/admission_id/{id}/update', status_code=status.HTTP_200_OK, response_model=ShowInpatientBill)
# def find_by_admission_id(id, db: Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)):
#     return inpatient_bills.find_by_admission_id(id, db)


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowInpatientBill])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_bills.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowInpatientBill])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_bills.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowInpatientBill)
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_bills.find_one(id, db)

@router.get('/find_by_name/{term_name}', status_code=status.HTTP_200_OK, response_model=ShowInpatientBill)
def find_by_term_name(
    term_name:str, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_bills.find_by_term_name(term_name, db)

@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: CreateInpatientBill, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_bills.create(request, db)



# @router.post('/', status_code=status.HTTP_201_CREATED)
# def create(request: CreateInpatientBillWhenAdmitted, db: Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)):
#     return inpatient_bills.create(request, db)

@router.put('/admission_id/{id}/update', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request_ito: UpdateInpatientBill, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_bills.update(id, request_ito, db)


# @router.put('/{id}/{updated_by}', status_code=status.HTTP_200_OK)
# def completed(id, updated_by: str, db: Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)):
#     return inpatient_bills.completed(id,updated_by,db)

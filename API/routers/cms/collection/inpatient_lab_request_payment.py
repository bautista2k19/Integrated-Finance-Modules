from API.schemas.cms.collection.inpatient_lab_request_payment import ShowInpatientLabRequestPayment, CreateInpatientLabRequestPayment, UpdateInpatientLabRequestPayment
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status,BackgroundTasks, responses
from .... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.collection import inpatient_lab_request_payment

router = APIRouter(
    prefix="/cms/user/inpatient_lab_request_payment",
    tags=['Inpatient Lab Request Payments']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowInpatientLabRequestPayment])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_lab_request_payment.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowInpatientLabRequestPayment])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_lab_request_payment.find_all(db)


@router.get('/find_one/{id}', status_code=status.HTTP_200_OK, response_model=ShowInpatientLabRequestPayment)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_lab_request_payment.find_one(id, db)


@router.post('/create', status_code=status.HTTP_201_CREATED, response_model=ShowInpatientLabRequestPayment)
def create(
    background_tasks: BackgroundTasks,
    request: CreateInpatientLabRequestPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_lab_request_payment.create(background_tasks,request, db)


@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateInpatientLabRequestPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_lab_request_payment.update(id, request, db)


@router.delete('/{id}/{updated_by}', status_code=status.HTTP_200_OK)
def delete(
    id, 
    updated_by: str, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_lab_request_payment.delete(id,updated_by,db)

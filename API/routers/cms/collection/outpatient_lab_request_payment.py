from API.schemas.cms.collection.outpatient_lab_request_payment import ShowOutpatientLabRequestPayment, CreateOutpatientLabRequestPayment, UpdateOutpatientLabRequestPayment
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, BackgroundTasks, responses
from .... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.collection import outpatient_lab_request_payment

router = APIRouter(
    prefix="/outpatient_lab_request_payment",
    tags=['Outpatient Lab Request Payments']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowOutpatientLabRequestPayment])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return outpatient_lab_request_payment.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowOutpatientLabRequestPayment])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return outpatient_lab_request_payment.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowOutpatientLabRequestPayment)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return outpatient_lab_request_payment.find_one(id, db)


@router.post('/create_outpatient_lab_request_payment', status_code=status.HTTP_201_CREATED, response_model=ShowOutpatientLabRequestPayment)
def create(
    background_tasks: BackgroundTasks,
    request: CreateOutpatientLabRequestPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return outpatient_lab_request_payment.create(background_tasks,request, db)


@router.put('/update_outpatient_lab_request_payment/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateOutpatientLabRequestPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return outpatient_lab_request_payment.update(id, request, db)


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
        return outpatient_lab_request_payment.delete(id,updated_by,db)

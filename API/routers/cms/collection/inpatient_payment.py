from API.schemas.cms.collection.inpatient_payment import ShowInpatientPayment, CreateInpatientPayment, UpdateInpatientPayment
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, BackgroundTasks, responses
from .... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.collection import inpatient_payment

router = APIRouter(
    prefix="/cms/user/inpatient_payment",
    tags=['Inpatient Payments']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowInpatientPayment])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_payment.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowInpatientPayment])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_payment.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowInpatientPayment)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_payment.find_one(id, db)


@router.post('/create_inpatient_payment', status_code=status.HTTP_201_CREATED, response_model=ShowInpatientPayment)
def create(
    background_tasks: BackgroundTasks,
    request: CreateInpatientPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_payment.create(background_tasks,request, db)

@router.get('/send_mail/{id}')
def send_mail(
    background_tasks: BackgroundTasks,
    id,
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_payment.send_mail(background_tasks,id, db)


@router.put('/update_inpatient_payment/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateInpatientPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return inpatient_payment.update(id, request, db)


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
        return inpatient_payment.delete(id,updated_by,db)

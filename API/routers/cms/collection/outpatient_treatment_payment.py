from API.schemas.cms.collection.outpatient_treatment_payment import ShowOutpatientTreatmentPayment, CreateOutpatientTreatmentPayment, UpdateOutpatientTreatmentPayment
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, BackgroundTasks, responses
from .... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.collection import outpatient_treatment_payment

router = APIRouter(
    prefix="/outpatient_treatment_payment",
    tags=['Outpatient Treatment Payments']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowOutpatientTreatmentPayment])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return outpatient_treatment_payment.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowOutpatientTreatmentPayment])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return outpatient_treatment_payment.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowOutpatientTreatmentPayment)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return outpatient_treatment_payment.find_one(id, db)


@router.post('/create_outpatient_treatment_payment', status_code=status.HTTP_201_CREATED, response_model=ShowOutpatientTreatmentPayment)
def create(
    background_tasks: BackgroundTasks,
    request: CreateOutpatientTreatmentPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return outpatient_treatment_payment.create(background_tasks,request, db)


@router.put('/update_outpatient_treatment_payment/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdateOutpatientTreatmentPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return outpatient_treatment_payment.update(id, request, db)


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
        return outpatient_treatment_payment.delete(id,updated_by,db)

from API.schemas.cms.disbursement.purchase_order_payment import ShowPurchaseOrderPayment, CreatePurchaseOrderPayment, UpdatePurchaseOrderPayment
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from .... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.disbursement import purchase_order_payment

router = APIRouter(
    prefix="/cms/user/purchase_order_payment",
    tags=['Purchase Order Payments']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowPurchaseOrderPayment])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_payment.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowPurchaseOrderPayment])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_payment.find_all(db)


@router.get('/find_one/{id}', status_code=status.HTTP_200_OK, response_model=ShowPurchaseOrderPayment)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_payment.find_one(id, db)


@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(
    request: CreatePurchaseOrderPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_payment.create(request, db)


@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdatePurchaseOrderPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_payment.update(id, request, db)


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
        return purchase_order_payment.delete(id,updated_by,db)

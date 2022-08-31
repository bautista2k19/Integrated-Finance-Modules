from API.schemas.cms.disbursement.purchase_order_vendor_payment import ShowPurchaseOrderVendorPayment, CreatePurchaseOrderVendorPayment, UpdatePurchaseOrderVendorPayment
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from .... import database,security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.disbursement import purchase_order_vendor_payment

router = APIRouter(
    prefix="/purchase_order_vendor_payment",
    tags=['Purchase Order Vendor Payments']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowPurchaseOrderVendorPayment])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_vendor_payment.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowPurchaseOrderVendorPayment])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_vendor_payment.find_all(db)


@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPurchaseOrderVendorPayment)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_vendor_payment.find_one(id, db)


@router.post('/create_purchase_order_vendor_payment', status_code=status.HTTP_201_CREATED)
def create(
    request: CreatePurchaseOrderVendorPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_vendor_payment.create(request, db)


@router.put('/update_purchase_order_vendor_payment/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(
    id, 
    request: UpdatePurchaseOrderVendorPayment, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_vendor_payment.update(id, request, db)


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
        return purchase_order_vendor_payment.delete(id,updated_by,db)

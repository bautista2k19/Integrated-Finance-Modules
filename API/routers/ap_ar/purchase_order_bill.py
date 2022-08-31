from API.schemas.ap_ar.purchase_order_bill import ShowPurchaseOrderBill 
from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from ... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.ap_ar import purchase_order_bill

router = APIRouter(
    prefix="/purchase_order_bill",
    tags=['Purchase Order Bills']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowPurchaseOrderBill])
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_bill.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowPurchaseOrderBill])
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_bill.find_all(db)

@router.get('/find_all_pending', status_code=status.HTTP_200_OK, response_model=List[ShowPurchaseOrderBill])
def find_all_pending(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    return purchase_order_bill.find_all_pending(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPurchaseOrderBill)
def find_one(
    id, 
    db: Session = Depends(get_db), 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order_bill.find_one(id, db)
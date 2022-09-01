from datetime import date
from API.schemas.ar_ap.user import User
from API.schemas.ar_ap.purchase_order import CreatePurchase_order, DeletePurchase_order, ShowPurchase_order, UpdatePurchase_order, ApprovedPurchase_order
from typing import List
from fastapi import APIRouter, Depends, status, File, UploadFile, Form, responses
from API import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import purchase_order
 

router = APIRouter(
    prefix="/AR_AP/user/purchase_order",
    tags=['Purchase Order']
)

get_db = database.get_db


@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[ShowPurchase_order])
# 
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order.datatable(db)

@router.get('/datatableApproved', status_code=status.HTTP_200_OK, response_model=List[ShowPurchase_order])
# 
def datatableApproved(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order.datatableApproved(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[ShowPurchase_order])
# 
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):#, current_user: User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order.find_all(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPurchase_order)
# 
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order.find_one(id, db)


@router.post('/', status_code=status.HTTP_201_CREATED, response_model=CreatePurchase_order)
def create(db: Session = Depends(get_db),
           purchase_order_number: str = Form(...),
           total_bill: float = Form(...),
           order_date: date = Form(...),
           expected_delivery_date: date = Form(...),
           payment_method: str = Form(...),
           notes: str = Form(...), 
           created_by: str = Form(...),
           result = Depends(security.auth)#,current_user:User = Depends(oauth2.get_current_user)
           ):  # ,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order.create(db, 
                           purchase_order_number,
                           total_bill,
                           order_date,
                           expected_delivery_date,
                           payment_method,
                           notes, 
                            created_by)


@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id, db: Session = Depends(get_db), 
           purchase_order_number: str = Form(...),
           total_bill: float = Form(...),
           order_date: date = Form(...),
           expected_delivery_date: date = Form(...),
           payment_method: str = Form(...),
           notes: str = Form(...),  
           updated_by: str = Form(None),
           updated_at: str = Form(None),
           result = Depends(security.auth)
            ):#,current_user:User = Depends(oauth2.get_current_user)):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return purchase_order.update(id, db, 
                           purchase_order_number,
                           total_bill,
                           order_date,
                           expected_delivery_date,
                           payment_method,
                           notes, 
                           updated_by,
                           updated_at)


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
        return purchase_order.delete(id, updated_by, db)

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
        return purchase_order.approved(id, updated_by, db)
from API.schemas.ar_ap.user import User
from API.schemas.ar_ap.pharmacy_invoice import CreateInvoice, CreatePrescription, ShowPrescription, MedicinePR, MedicalSuppliesPR, PharmacyInvoice
from typing import List
from fastapi import APIRouter, Depends, status, responses
from API import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.ar_ap import pharmacy_invoice

router = APIRouter(
    prefix="/AR_AP/user/invoice",
    tags=['Invoice']
)

get_db = database.get_db





@router.get('/datatable', status_code=status.HTTP_200_OK, response_model=List[PharmacyInvoice])
# 
def datatable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return pharmacy_invoice.datatable(db)

@router.get('/find_all', status_code=status.HTTP_200_OK, response_model=List[PharmacyInvoice])
# ,current_user:Use
def find_all(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return pharmacy_invoice.find_all(db)




@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=PharmacyInvoice)
def find_one(
    id, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return pharmacy_invoice.find_one(id,db)

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=CreateInvoice)
def create(
    request: CreateInvoice, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return pharmacy_invoice.create(request,db)


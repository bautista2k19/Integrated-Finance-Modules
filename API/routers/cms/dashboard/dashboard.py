from API.schemas.employee.user import User
from typing import List
from fastapi import APIRouter, Depends, status, responses
from .... import database, security#, oauth2
from sqlalchemy.orm import Session
from API.repository.cms.dashboard import dashboard

router = APIRouter(
    prefix="/dashboard",
    tags=['Dashboard']
)

get_db = database.get_db


@router.get('/sum_receivable', status_code=status.HTTP_200_OK)
def sum_receivable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return dashboard.sum_receivable(db)

@router.get('/sum_payable', status_code=status.HTTP_200_OK)
def sum_payable(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return dashboard.sum_payable(db)

@router.get('/sum_inpatient_payment', status_code=status.HTTP_200_OK)
def sum_inpatient_payment(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return dashboard.sum_inpatient_payment(db)

@router.get('/sum_outpatient_payment', status_code=status.HTTP_200_OK)
def sum_outpatient_payment(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return dashboard.sum_outpatient_payment(db)

@router.get('/total_collection', status_code=status.HTTP_200_OK)
def total_collection(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return dashboard.total_collection(db)

@router.get('/total_disbursement', status_code=status.HTTP_200_OK)
def total_disbursement(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return dashboard.total_disbursement(db)

@router.get('/cash_flow/{month}', status_code=status.HTTP_200_OK)
def cash_flow(
    month: int, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return dashboard.cash_flow(month,db)

@router.get('/profit_loss/{month}', status_code=status.HTTP_200_OK)
def profit_loss(
    month: int, 
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return dashboard.profit_loss(month,db)

@router.get('/count_complete_payment', status_code=status.HTTP_200_OK)
def count_complete_payment(
    db: Session = Depends(get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return dashboard.count_complete_payment(db)


from datetime import datetime

from sqlalchemy.orm.session import Session
from sqlalchemy.sql.functions import func
from API import models as API
from fastapi import HTTPException

def sum_receivable(db: Session):
    unpaid_bill = db.execute("SELECT SUM(remaining_balance) FROM inpatient_bills WHERE status != 'Paid'").scalar()
    if not unpaid_bill:
        unpaid_bill = 0
    
    paid_bill = db.execute("SELECT SUM(total_bill - remaining_balance) FROM inpatient_bills WHERE status = 'Paid' OR status = 'Incomplete' ").scalar()
    if not paid_bill:
        paid_bill = 0
    return {"unpaid_bill" :unpaid_bill,"paid_bill" :paid_bill}

def sum_payable(db: Session):
    unpaid_bill = db.execute("SELECT SUM(remaining_balance) FROM purchase_order_vendor_bills WHERE status != 'Paid'").scalar()
    if not unpaid_bill:
        unpaid_bill = 0

    paid_bill = db.execute("SELECT SUM(total_vendor_bill - remaining_balance) FROM purchase_order_vendor_bills WHERE status = 'Paid' OR status = 'Incomplete' ").scalar()
    if not paid_bill:
        paid_bill = 0
    return {"unpaid_bill" :unpaid_bill,"paid_bill" :paid_bill}

def sum_inpatient_payment(db: Session):
    inpatient_payment = db.execute("SELECT SUM(total_amount_paid) FROM inpatient_payments WHERE status != 'Inactive' ").scalar()
    if not inpatient_payment:
        inpatient_payment = 0
    return inpatient_payment

def sum_outpatient_payment(db: Session):
    outpatient_lab_request_payment = db.execute("SELECT SUM(amount_paid) FROM outpatient_lab_request_payments WHERE status != 'Inactive' ").scalar()
    outpatient_treatment_payment = db.execute("SELECT SUM(amount_paid) FROM outpatient_treatment_payments WHERE status != 'Inactive' ").scalar()

    if not outpatient_lab_request_payment:
        outpatient_lab_request_payment = 0

    if not outpatient_treatment_payment:
        outpatient_treatment_payment = 0

    outpatient_payment = outpatient_lab_request_payment + outpatient_treatment_payment
    return outpatient_payment

def total_collection(db: Session):
    inpatient_payment = db.execute("SELECT SUM(total_amount_paid) FROM inpatient_payments WHERE status != 'Inactive' ").scalar()
    if not inpatient_payment:
        inpatient_payment = 0
    
    outpatient_lab_request_payment = db.execute("SELECT SUM(amount_paid) FROM outpatient_lab_request_payments WHERE status != 'Inactive' ").scalar()
    outpatient_treatment_payment = db.execute("SELECT SUM(amount_paid) FROM outpatient_treatment_payments WHERE status != 'Inactive' ").scalar()

    if not outpatient_lab_request_payment:
        outpatient_lab_request_payment = 0

    if not outpatient_treatment_payment:
        outpatient_treatment_payment = 0

    outpatient_payment = outpatient_lab_request_payment + outpatient_treatment_payment
    total_collection = inpatient_payment + outpatient_payment
    return total_collection

def total_disbursement(db: Session):
    disbursement = db.execute("SELECT SUM(total_amount_paid) FROM purchase_order_vendor_payments WHERE status != 'Inactive' ").scalar()
    if not disbursement:
        disbursement = 0
    
    return disbursement

def cash_flow(month,db: Session):
    inpatient_payment = db.execute("SELECT SUM(total_amount_paid) FROM inpatient_payments WHERE status != 'Inactive' AND MONTH(date_of_payment) =" + str(month)).scalar()
    if not inpatient_payment:
        inpatient_payment = 0
    outpatient_lab_request_payment = db.execute("SELECT SUM(amount_paid) FROM outpatient_lab_request_payments WHERE status != 'Inactive'AND MONTH(date_of_payment) =" + str(month)).scalar()
    outpatient_treatment_payment = db.execute("SELECT SUM(amount_paid) FROM outpatient_treatment_payments WHERE status != 'Inactive' AND MONTH(date_of_payment) =" + str(month)).scalar()

    if not outpatient_lab_request_payment:
        outpatient_lab_request_payment = 0

    if not outpatient_treatment_payment:
        outpatient_treatment_payment = 0

    outpatient_payment = outpatient_lab_request_payment + outpatient_treatment_payment
    cash_in = inpatient_payment + outpatient_payment

    cash_out = db.execute("SELECT SUM(total_amount_paid) FROM purchase_order_vendor_payments WHERE status != 'Inactive' AND MONTH(date_of_payment) =" + str(month)).scalar()
    if not cash_out:
        cash_out = 0

    return {"cash_in":cash_in, "cash_out" : cash_out}

def profit_loss(month,db: Session):
    inpatient_payment = db.execute("SELECT SUM(total_amount_paid) FROM inpatient_payments WHERE status != 'Inactive' AND MONTH(date_of_payment) =" + str(month)).scalar()
    if not inpatient_payment:
        inpatient_payment = 0
    outpatient_lab_request_payment = db.execute("SELECT SUM(amount_paid) FROM outpatient_lab_request_payments WHERE status != 'Inactive'AND MONTH(date_of_payment) =" + str(month)).scalar()
    outpatient_treatment_payment = db.execute("SELECT SUM(amount_paid) FROM outpatient_treatment_payments WHERE status != 'Inactive' AND MONTH(date_of_payment) =" + str(month)).scalar()

    if not outpatient_lab_request_payment:
        outpatient_lab_request_payment = 0

    if not outpatient_treatment_payment:
        outpatient_treatment_payment = 0

    outpatient_payment = outpatient_lab_request_payment + outpatient_treatment_payment
    cash_in = inpatient_payment + outpatient_payment

    cash_out = db.execute("SELECT SUM(total_amount_paid) FROM purchase_order_vendor_payments WHERE status != 'Inactive' AND MONTH(date_of_payment) =" + str(month)).scalar()
    if not cash_out:
        cash_out = 0
    profit_loss = cash_in - cash_out
    return profit_loss

def count_complete_payment(db: Session):
    inpatient_payment = db.query(API.Inpatient_payment).filter_by(status="Completed").count()
    return inpatient_payment

def count_incomplete_payment(db: Session):
    inpatient_payment = db.query(API.Inpatient_payment).filter_by(status="Incomplete").count()
    return inpatient_payment

def count_in_request_payment(db: Session):
    inpatient_payment = db.query(API.Inpatient_lab_request_payment).filter(API.Inpatient_lab_request_payment.status=="Active" or API.Inpatient_lab_request_payment.status=="Completed" ).count()
    return inpatient_payment

def count_in_room_payment(db: Session):
    inpatient_payment = db.query(API.Inpatient_room_payment).filter(API.Inpatient_room_payment.status=="Active" or API.Inpatient_room_payment.status=="Completed" ).count()
    return inpatient_payment

def count_in_prescription_payment(db: Session):
    inpatient_payment = db.query(API.Inpatient_prescription_payment).filter(API.Inpatient_prescription_payment.status=="Active" or API.Inpatient_prescription_payment.status=="Completed" ).count()
    return inpatient_payment
    
def count_in_treatment_payment(db: Session):
    inpatient_payment = db.query(API.Inpatient_treatment_payment).filter(API.Inpatient_treatment_payment.status=="Active" or API.Inpatient_treatment_payment.status=="Completed" ).count()
    return inpatient_payment

def count_in_surgery_payment(db: Session):
    inpatient_payment = db.query(API.Inpatient_surgery_payment).filter(API.Inpatient_surgery_payment.status=="Active" or API.Inpatient_surgery_payment.status=="Completed" ).count()
    return inpatient_payment



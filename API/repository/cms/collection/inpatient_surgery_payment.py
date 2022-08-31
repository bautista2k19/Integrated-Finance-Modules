from API.schemas.cms.collection.inpatient_surgery_payment import ShowInpatientSurgeryPayment, CreateInpatientSurgeryPayment, UpdateInpatientSurgeryPayment
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status, BackgroundTasks
from starlette.responses import JSONResponse
from starlette.requests import Request
from fastapi_mail import FastMail, MessageSchema,ConnectionConfig
from fastapi.encoders import jsonable_encoder
from uuid import uuid4
import random

conf = ConnectionConfig(
    MAIL_USERNAME = "justdoitqwerty19@gmail.com",
    MAIL_PASSWORD = "Nocturnal119",
    MAIL_FROM = "justdoitqwerty19@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_FROM_NAME="Homies",
    MAIL_TLS = True,
    MAIL_SSL = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

def datatable(db: Session):
    inpatient_surgery_payments = db.query(
        API.Inpatient_surgery_payment).all()
    return inpatient_surgery_payments


def find_all(db: Session):
    inpatient_surgery_payments = db.query(API.Inpatient_surgery_payment).filter(
        API.Inpatient_surgery_payment.status != "Inactive").all()
    return inpatient_surgery_payments


def find_one(id, db: Session):
    inpatient_surgery_payment = db.query(API.Inpatient_surgery_payment).filter(
        API.Inpatient_surgery_payment.id == id).first()
    if not inpatient_surgery_payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Inpatient surgery payment is not available.")
    return inpatient_surgery_payment


def create(background_tasks: BackgroundTasks,request: CreateInpatientSurgeryPayment, db: Session):

    surgery_bill = db.query(API.Surgery_bill).filter(
        API.Surgery_bill.id == request.surgery_bill_id)
    inpatient_payment = db.query(API.Inpatient_payment).filter(
        API.Inpatient_payment.inpatient_bill_id == surgery_bill.first().inpatient_bill_id).first()
    partial_payment = db.query(API.Payment_term).filter(
        API.Payment_term.term_name == "Partial Payment").first()

    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])

    if not inpatient_payment:
        new_inpatient_payment = API.Inpatient_payment(
            id=str(uuid4()),
            inpatient_bill_id=surgery_bill.first().inpatient_bill_id,
            or_no="OR No. " + last_4_uuid + "-" +
            str(random.randint(1111, 9999)),
            total_amount_paid=0,
            payment_term_id=partial_payment.id,
            payment_method_id=request.payment_method_id,
            created_by=request.created_by)

        db.add(new_inpatient_payment)
        db.commit()
        db.refresh(new_inpatient_payment)
        inpatient_payment = new_inpatient_payment

    inpatient_payment = db.query(API.Inpatient_payment).filter(
        API.Inpatient_payment.inpatient_bill_id == surgery_bill.first().inpatient_bill_id).first()

    new_inpatient_surgery_payment = API.Inpatient_surgery_payment(
        id=str(uuid4()),
        surgery_bill_id=request.surgery_bill_id,
        inpatient_payment_id=inpatient_payment.id,
        or_no="ISP OR No. " + last_4_uuid +
        "-" + str(random.randint(1111, 9999)),
        amount_paid=request.amount_paid,
        payment_method_id=request.payment_method_id,
        created_by=request.created_by)

    if request.patient_cash_payment:
        new_patient_cash_payment = API.Patient_cash_payment(
            **request.patient_cash_payment.dict(),
            id=str(uuid4()),
            cash_payment_no="ISP-CP-" + str(random.randint(
                11111, 99999)))

        db.add(new_patient_cash_payment)
        db.commit()
        db.refresh(new_patient_cash_payment)
        new_inpatient_surgery_payment.patient_cash_payment_id = new_patient_cash_payment.id

    if request.patient_check_payment:
        new_patient_check_payment = API.Patient_check_payment(
            **request.patient_check_payment.dict(),
            id=str(uuid4()))

        db.add(new_patient_check_payment)
        db.commit()
        db.refresh(new_patient_check_payment)
        new_inpatient_surgery_payment.patient_check_payment_id = new_patient_check_payment.id

    db.add(new_inpatient_surgery_payment)
    surgery_bill.update({
        'status': 'Paid',
        'updated_by': request.created_by})
    db.commit()
    db.refresh(new_inpatient_surgery_payment)
    
    #Check if inpatient payment amount + inpatient surgery payment amount == total_bill
    #   if true: inpatient bill status = "Paid" and remaining bal = total bill - total amount paid(inpatient_payment)
    #   else: inpatient bill status = "Incomplete"

    curr_total_amount_paid = inpatient_payment.total_amount_paid + request.amount_paid

    inpatient_bill = db.query(API.Inpatient_bill).filter(
        API.Inpatient_bill.id == surgery_bill.first().inpatient_bill_id)
    
    inpatient_payment = db.query(API.Inpatient_payment).filter(
        API.Inpatient_payment.inpatient_bill_id == surgery_bill.first().inpatient_bill_id)

    if inpatient_bill.first().total_bill == curr_total_amount_paid:
        inpatient_bill.update({
        'remaining_balance': 0,
        'status': 'Paid',
        'updated_by': request.created_by})
        
        inpatient_payment.update({
        'total_amount_paid': curr_total_amount_paid,
        'status': 'Completed',
        'updated_by': request.created_by})
    else:
        inpatient_bill.update({
        'remaining_balance': inpatient_bill.first().total_bill - curr_total_amount_paid,
        'status': 'Incomplete',
        'updated_by': request.created_by})        

        inpatient_payment.update({
        'total_amount_paid': curr_total_amount_paid,
        'status': 'Incomplete',
        'updated_by': request.created_by})

    # inpatient_bill = db.query(models.Inpatient_bill).filter(
    #     models.Inpatient_bill.id == request.surgery_bill_id)

    db.commit()
    html =  "<p>Dear "+ new_inpatient_surgery_payment.in_surgery_payment_in_surgery_bill.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name + ", " + new_inpatient_surgery_payment.in_surgery_payment_in_surgery_bill.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +",</p>"
    html += "<p>I/We are writing this email to confirm that we have received your payment for an amount of ₱" + (str(request.amount_paid)) + " against our inpatient surgery bill no " +surgery_bill.first().surgery_bill_no +".</p> <p class='text-center'>Thanking you.</p>" 
    html += "<p>Sincerely,</p><p>Homies</p>" 
    message = MessageSchema(
            subject="Payment",
            recipients=["19jhonpaul@gmail.com"],
            html=html,
            )

    fm = FastMail(conf)

    background_tasks.add_task(fm.send_message,message)
    return new_inpatient_surgery_payment

def update(id, request: UpdateInpatientSurgeryPayment, db: Session):
    inpatient_surgery_payment = db.query(API.Inpatient_surgery_payment).filter(
        API.Inpatient_surgery_payment.id == id)

    if not inpatient_surgery_payment.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Inpatient surgery payment is not available.")

    if request.patient_cash_payment_id != '' and request.patient_cash_payment != None :
        inpatient_surgery_payment.update({
            'surgery_bill_id': request.surgery_bill_id,
            'payment_method_id': request.payment_method_id,
            #'payment_term_id': request.payment_term_id,
            'amount_paid': request.amount_paid,
            'patient_cash_payment_id': request.patient_cash_payment_id,
            # 'patient_check_payment_id': request.patient_check_payment_id,
            'date_of_payment':request.date_of_payment,
            'status':request.status,
            'updated_by':request.updated_by
        })

        db.commit()
        
        patient_cash_payment = db.query(API.Patient_cash_payment).filter(
        API.Patient_cash_payment.id == request.patient_cash_payment_id)
        patient_cash_payment.update({
        'amount': request.amount_paid,
        'updated_by':request.updated_by
        })
        db.commit()
    
    elif request.patient_cash_payment_id != '' and request.patient_check_payment != None:
        print(request.patient_cash_payment_id)
        patient_cash_payment = db.query(API.Patient_cash_payment).filter(
        API.Patient_cash_payment.id == request.patient_cash_payment_id)
        patient_cash_payment.update({
        'status': 'Inactive',
        'updated_by':request.updated_by
        })
        db.commit()

        new_patient_check_payment = API.Patient_check_payment(
            **request.patient_check_payment.dict(),
            id=str(uuid4()),check_status="Received")

        db.add(new_patient_check_payment)
        db.commit()

        inpatient_surgery_payment.update({
            'surgery_bill_id': request.surgery_bill_id,
            'payment_method_id': request.payment_method_id,
            'amount_paid': request.amount_paid,
            'date_of_payment':request.date_of_payment,
            'status':request.status,
            'updated_by':request.updated_by,
            'patient_cash_payment_id': None,
            'patient_check_payment_id': new_patient_check_payment.id
        })
        db.commit()

    elif request.patient_check_payment_id != '' and request.patient_check_payment != None :
        inpatient_surgery_payment.update({
            'surgery_bill_id': request.surgery_bill_id,
            'payment_method_id': request.payment_method_id,
            #'payment_term_id': request.payment_term_id,
            'amount_paid': request.amount_paid,
            #'patient_cash_payment_id': request.patient_cash_payment_id,
            'patient_check_payment_id': request.patient_check_payment_id,
            'date_of_payment':request.date_of_payment,
            'status':request.status,
            'updated_by':request.updated_by
        })
        db.commit()

        patient_check_payment = db.query(API.Patient_check_payment).filter(
        API.Patient_check_payment.id == request.patient_check_payment_id)

        patient_check_payment_json = jsonable_encoder(request.patient_check_payment)
        patient_check_payment.update(patient_check_payment_json)

        db.commit()
    
    elif request.patient_check_payment_id != '' and request.patient_cash_payment != None :
        print("ewq")
        patient_check_payment = db.query(API.Patient_check_payment).filter(
        API.Patient_check_payment.id == request.patient_check_payment_id)
        print(request.patient_check_payment_id)
        patient_check_payment.update({
        #'status': 'Inactive',
        'updated_by':request.updated_by
        })

        db.commit()

        new_patient_cash_payment = API.Patient_cash_payment(
            **request.patient_cash_payment.dict(),
            id=str(uuid4()),
            cash_payment_no="ISP-CP-" + str(random.randint(
                11111, 99999)))

        db.add(new_patient_cash_payment)
        db.commit()

        inpatient_surgery_payment.update({
            'surgery_bill_id': request.surgery_bill_id,
            'payment_method_id': request.payment_method_id,
            'amount_paid': request.amount_paid,
            'date_of_payment':request.date_of_payment,
            'status': request.status,
            'updated_by':request.updated_by,
            'patient_check_payment_id': None,
            'patient_cash_payment_id': new_patient_cash_payment.id,
        })
        db.commit()
    return f"Inpatient surgery payment has been updated."


def delete(id, updated_by: str, db: Session):
    inpatient_surgery_payment = db.query(API.Inpatient_surgery_payment).filter(
        API.Inpatient_surgery_payment.id == id)
    if not inpatient_surgery_payment.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Inpatient surgery payment is not available.")
    inpatient_surgery_payment.update({
        'status': 'Inactive',
        'updated_at': datetime.now(),
        'updated_by': updated_by})
    db.commit()
    return f"Inpatient surgery payment has been deactivated."

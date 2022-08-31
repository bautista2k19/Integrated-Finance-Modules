from API.schemas.cms.collection.outpatient_treatment_payment import CreateOutpatientTreatmentPayment, UpdateOutpatientTreatmentPayment
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
    outpatient_treatment_payments = db.query(API.Outpatient_treatment_payment).all()
    return outpatient_treatment_payments


def find_all(db: Session):
    outpatient_treatment_payments = db.query(API.Outpatient_treatment_payment).filter(
        API.Outpatient_treatment_payment.status != "Inactive").all()
    return outpatient_treatment_payments


def find_one(id, db: Session):
    outpatient_treatment_payment = db.query(API.Outpatient_treatment_payment).filter(
        API.Outpatient_treatment_payment.id == id).first()
    if not outpatient_treatment_payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Outpatient Treatment Payment is not available.")
    return outpatient_treatment_payment


def create(background_tasks: BackgroundTasks,request: CreateOutpatientTreatmentPayment, db: Session):

    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_outpatient_treatment_payment = API.Outpatient_treatment_payment(
        id=str(uuid4()),
        treatment_id = request.treatment_id,
        or_no="OTP OR No. "+ last_4_uuid + "-" + str(random.randint(1111, 9999)),
        amount_paid=request.amount_paid,
        payment_term_id=request.payment_term_id, #full payment
        payment_method_id=request.payment_method_id,
        status="Paid",
        created_by=request.created_by)

    if request.patient_cash_payment:
        new_patient_cash_payment = API.Patient_cash_payment(
            **request.patient_cash_payment.dict(),
            id=str(uuid4()),
            cash_payment_no="OT CP-" + str(random.randint(
                11111, 99999)))

        db.add(new_patient_cash_payment)
        db.commit()
        db.refresh(new_patient_cash_payment)
        new_outpatient_treatment_payment.patient_cash_payment_id = new_patient_cash_payment.id

    if request.patient_check_payment:
        new_patient_check_payment = API.Patient_check_payment(
            **request.patient_check_payment.dict(),
            id=str(uuid4()),check_status="Received")

        db.add(new_patient_check_payment)
        db.commit()
        db.refresh(new_patient_check_payment)
        new_outpatient_treatment_payment.patient_check_payment_id = new_patient_check_payment.id

    db.add(new_outpatient_treatment_payment)
    treatment = db.query(API.Treatment).filter(
        API.Treatment.id == request.treatment_id)

    treatment.update({
        'status': 'Paid',
        'updated_by': request.created_by})

    db.commit()
    db.refresh(new_outpatient_treatment_payment)
    html =  "<p>Dear "+ new_outpatient_treatment_payment.out_treatment_payment_out_treatment.treatment_outpatient.outpatient_patient.last_name + ", " + new_outpatient_treatment_payment.out_treatment_payment_out_treatment.treatment_outpatient.outpatient_patient.first_name +",</p>"
    html += "<p>I/We are writing this email to confirm that we have received your payment for an amount of ₱" + (str(request.amount_paid)) + " against our outpatient treatment no " +treatment.first().treatment_no +".</p> <p class='text-center'>Thanking you.</p>" 
    html += "<p>Sincerely,</p><p>Homies</p>" 
    message = MessageSchema(
            subject="Payment",
            recipients=["19jhonpaul@gmail.com"],
            html=html,
            )

    fm = FastMail(conf)

    background_tasks.add_task(fm.send_message,message)
    return new_outpatient_treatment_payment


def update(id, request: UpdateOutpatientTreatmentPayment, db: Session):
    outpatient_treatment_payment = db.query(API.Outpatient_treatment_payment).filter(
        API.Outpatient_treatment_payment.id == id)

    if not outpatient_treatment_payment.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Outpatient Treatment Payment is not available.")

    if request.patient_cash_payment_id != '' and request.patient_cash_payment != None :
        outpatient_treatment_payment.update({
            'treatment_id': request.treatment_id,
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

        outpatient_treatment_payment.update({
            'treatment_id': request.treatment_id,
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
        outpatient_treatment_payment.update({
            'treatment_id': request.treatment_id,
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
            cash_payment_no="OT CP-" + str(random.randint(
                11111, 99999)))

        db.add(new_patient_cash_payment)
        db.commit()

        outpatient_treatment_payment.update({
            'treatment_id': request.treatment_id,
            'payment_method_id': request.payment_method_id,
            'amount_paid': request.amount_paid,
            'date_of_payment':request.date_of_payment,
            'status': request.status,
            'updated_by':request.updated_by,
            'patient_check_payment_id': None,
            'patient_cash_payment_id': new_patient_cash_payment.id,
        })
        db.commit()  
    
    return f"Outpatient Treatment Payment has been updated."


def delete(id, updated_by: str, db: Session):
    outpatient_treatment_payment = db.query(API.Outpatient_treatment_payment).filter(
        API.Outpatient_treatment_payment.id == id)
    if not outpatient_treatment_payment.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Outpatient Treatment Payment is not available.")
    outpatient_treatment_payment.update({
        'status': 'Inactive',
        'updated_at': datetime.now(),
        'updated_by': updated_by})
    db.commit()
    return f"Outpatient Treatment Payment has been deactivated."

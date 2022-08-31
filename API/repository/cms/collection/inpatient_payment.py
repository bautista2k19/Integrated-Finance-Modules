from API.schemas.cms.collection.inpatient_payment import ShowInpatientPayment, CreateInpatientPayment, UpdateInpatientPayment
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status,BackgroundTasks
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
    inpatient_payments = db.query(API.Inpatient_payment).all()
    return inpatient_payments


def find_all(db: Session):
    inpatient_payments = db.query(API.Inpatient_payment).filter(
        API.Inpatient_payment.status != "Inactive").all()
    return inpatient_payments


def find_one(id, db: Session):
    inpatient_payment = db.query(API.Inpatient_payment).filter(
        API.Inpatient_payment.id == id).first()
    if not inpatient_payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Inpatient payment is not available.")
    return inpatient_payment


def create(background_tasks: BackgroundTasks,request: CreateInpatientPayment, db: Session):

    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_inpatient_payment = API.Inpatient_payment(
        id=str(uuid4()),
        inpatient_bill_id = request.inpatient_bill_id,
        or_no="OR No. "+ last_4_uuid + "-" + str(random.randint(1111, 9999)),
        total_amount_paid=request.total_amount_paid,
        payment_term_id=request.payment_term_id,
        payment_method_id=request.payment_method_id,
        status="Completed",
        created_by=request.created_by)

    if request.patient_cash_payment:
        new_patient_cash_payment = API.Patient_cash_payment(
            **request.patient_cash_payment.dict(),
            id=str(uuid4()),
            cash_payment_no="CP-" + str(random.randint(
                11111, 99999)))

        db.add(new_patient_cash_payment)
        db.commit()
        db.refresh(new_patient_cash_payment)
        new_inpatient_payment.patient_cash_payment_id = new_patient_cash_payment.id

    if request.patient_check_payment:
        new_patient_check_payment = API.Patient_check_payment(
            **request.patient_check_payment.dict(),
            id=str(uuid4()),check_status="Received")

        db.add(new_patient_check_payment)
        db.commit()
        db.refresh(new_patient_check_payment)
        new_inpatient_payment.patient_check_payment_id = new_patient_check_payment.id

    db.add(new_inpatient_payment)
    inpatient_bill = db.query(API.Inpatient_bill).filter(
        API.Inpatient_bill.id == request.inpatient_bill_id)
    prescription_bill = db.query(API.Prescription_bill).filter(
        API.Prescription_bill.inpatient_bill_id == request.inpatient_bill_id)
    room_bill = db.query(API.Room_bill).filter(
        API.Room_bill.inpatient_bill_id == request.inpatient_bill_id)
    lab_request_bill = db.query(API.Lab_request_bill).filter(
        API.Lab_request_bill.inpatient_bill_id == request.inpatient_bill_id)
    treatment_bill = db.query(API.Treatment_bill).filter(
        API.Treatment_bill.inpatient_bill_id == request.inpatient_bill_id)
    surgery_bill = db.query(API.Surgery_bill).filter(
        API.Surgery_bill.inpatient_bill_id == request.inpatient_bill_id)

    prescription_bill.update({
        'status': 'Paid',
        'updated_by': request.created_by})

    room_bill.update({
        'status': 'Paid',
        'updated_by': request.created_by})

    lab_request_bill.update({
        'status': 'Paid',
        'updated_by': request.created_by})

    treatment_bill.update({
        'status': 'Paid',
        'updated_by': request.created_by})

    surgery_bill.update({
        'status': 'Paid',
        'updated_by': request.created_by})

    inpatient_bill.update({
        'remaining_balance': 0,
        'status': 'Paid',
        'updated_by': request.created_by})

    db.commit()
    db.refresh(new_inpatient_payment)

    html =  "<p>Dear "+ new_inpatient_payment.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name + ", " + new_inpatient_payment.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +",</p>"
    html += "<p>I/We are writing this email to confirm that we have received your payment for an amount of ₱" + (str(request.total_amount_paid)) + " against our inpatient bill no " +inpatient_bill.first().inpatient_bill_no +".</p> <p class='text-center'>Thanking you.</p>" 
    html += "<p>Sincerely,</p><p>Homies</p>" 
    message = MessageSchema(
            subject="Payment",
            recipients=["19jhonpaul@gmail.com"],
            html=html,
            )

    fm = FastMail(conf)

    background_tasks.add_task(fm.send_message,message)

    
    return new_inpatient_payment

def send_mail(background_tasks: BackgroundTasks,id,db: Session):

    inpatient_payment = db.query(API.Inpatient_payment).filter(
        API.Inpatient_payment.id == id).first()

    html =  "<p>Dear "+ inpatient_payment.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name + ", " + inpatient_payment.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +",</p>"
    html += "<p>I/We are writing this email to confirm that we have received your payment for an amount of ₱" + (str(inpatient_payment.total_amount_paid)) + " against our inpatient bill no " +inpatient_payment.inpatient_bill_id +".</p> <p class='text-center'>Thanking you.</p>" 
    html += "<p>Sincerely,</p><p>Homies</p>" 
    message = MessageSchema(
            subject="Payment",
            recipients=["19jhonpaul@gmail.com"],
            html=html,
            )

    fm = FastMail(conf)

    background_tasks.add_task(fm.send_message,message)
    
    return JSONResponse(status_code=200, content={"message": "email has been sent"})


def update(id, request: UpdateInpatientPayment, db: Session):
    inpatient_payment = db.query(API.Inpatient_payment).filter(
        API.Inpatient_payment.id == id)
    
    payment_term = db.query(API.Payment_term).filter(
        API.Payment_term.id == request.payment_term_id)
    
    print("patient_cash_payment_id: "+ request.patient_cash_payment_id)
    print(request.patient_cash_payment)
    print("patient_check_payment_id: "+ request.patient_check_payment_id)
    print(request.patient_check_payment)

    if not inpatient_payment.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Inpatient payment is not available.")

    if payment_term.first().term_name == 'Full Payment':
        print ("full payment")
        if request.patient_cash_payment_id != '' and request.patient_cash_payment != None :
            inpatient_payment.update({
                'inpatient_bill_id': request.inpatient_bill_id,
                'payment_method_id': request.payment_method_id,
                'payment_term_id': request.payment_term_id,
                'total_amount_paid': request.total_amount_paid,
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
            'amount': request.total_amount_paid,
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
    
            inpatient_payment.update({
                'inpatient_bill_id': request.inpatient_bill_id,
                'payment_method_id': request.payment_method_id,
                'payment_term_id': request.payment_term_id,
                'total_amount_paid': request.total_amount_paid,
                'date_of_payment':request.date_of_payment,
                'status':request.status,
                'updated_by':request.updated_by,
                'patient_cash_payment_id': None,
                'patient_check_payment_id': new_patient_check_payment.id
            })
            db.commit()

        elif request.patient_check_payment_id != '' and request.patient_check_payment != None :
            inpatient_payment.update({
                'inpatient_bill_id': request.inpatient_bill_id,
                'payment_method_id': request.payment_method_id,
                'payment_term_id': request.payment_term_id,
                'total_amount_paid': request.total_amount_paid,
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
                cash_payment_no="CP-" + str(random.randint(
                    11111, 99999)))

            db.add(new_patient_cash_payment)
            db.commit()

            inpatient_payment.update({
                'inpatient_bill_id': request.inpatient_bill_id,
                'payment_method_id': request.payment_method_id,
                'payment_term_id': request.payment_term_id,
                'total_amount_paid': request.total_amount_paid,
                'date_of_payment':request.date_of_payment,
                'status': request.status,
                'updated_by':request.updated_by,
                'patient_check_payment_id': None,
                'patient_cash_payment_id': new_patient_cash_payment.id,
            })
            db.commit()
    elif payment_term.first().term_name == 'Partial Payment':
        print ("partial payment")
        inpatient_payment.update({
            'inpatient_bill_id': request.inpatient_bill_id,
            'payment_method_id': request.payment_method_id,
            'payment_term_id': request.payment_term_id,
            'total_amount_paid': request.total_amount_paid,
            # 'patient_cash_payment_id': request.patient_cash_payment_id,
            # 'patient_check_payment_id': request.patient_check_payment_id,
            'date_of_payment':request.date_of_payment,
            'status':request.status,
            'updated_by':request.updated_by
        })

        db.commit()

    return f"Inpatient payment has been updated."


def delete(id, updated_by: str, db: Session):
    inpatient_payment = db.query(API.Inpatient_payment).filter(
        API.Inpatient_payment.id == id)
    if not inpatient_payment.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Inpatient payment is not available.")
    inpatient_payment.update({
        'status': 'Inactive',
        'updated_at': datetime.now(),
        'updated_by': updated_by})
    db.commit()
    return f"Inpatient payment has been deactivated."

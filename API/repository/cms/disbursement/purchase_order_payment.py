from API.schemas.cms.disbursement.purchase_order_payment import ShowPurchaseOrderPayment, CreatePurchaseOrderPayment, UpdatePurchaseOrderPayment
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4
import random


def datatable(db: Session):
    purchase_order_payments = db.query(
        API.Purchase_order_payment).all()
    return purchase_order_payments


def find_all(db: Session):
    purchase_order_payments = db.query(API.Purchase_order_payment).filter(
        API.Purchase_order_payment.status != "Inactive").all()
    return purchase_order_payments


def find_one(id, db: Session):
    purchase_order_payment = db.query(API.Purchase_order_payment).filter(
        API.Purchase_order_payment.id == id).first()
    if not purchase_order_payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Purchase order payment is not available.")
    return purchase_order_payment


def create(request: CreatePurchaseOrderPayment, db: Session):

    purchase_order_bill = db.query(API.Purchase_order_bill).filter(
        API.Purchase_order_bill.id == request.purchase_order_bill_id)
    purchase_order_vendor_payment = db.query(API.Purchase_order_vendor_payment).filter(
        API.Purchase_order_vendor_payment.purchase_order_vendor_bill_id == purchase_order_bill.first().purchase_order_vendor_bill_id).first()
    partial_payment = db.query(API.Payment_term).filter(
        API.Payment_term.term_name == "Partial Payment").first()

    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])

    if not purchase_order_vendor_payment:
        new_purchase_order_vendor_payment = API.Purchase_order_vendor_payment(
            id=str(uuid4()),
            purchase_order_vendor_bill_id=purchase_order_bill.first().purchase_order_vendor_bill_id,
            or_no="POV Payment No. " + last_4_uuid + "-" +
            str(random.randint(1111, 9999)),
            total_amount_paid=0,
            payment_term_id=partial_payment.id,
            payment_method_id=request.payment_method_id,
            created_by=request.created_by)

        db.add(new_purchase_order_vendor_payment)
        db.commit()
        db.refresh(new_purchase_order_vendor_payment)
        purchase_order_vendor_payment = new_purchase_order_vendor_payment

    purchase_order_vendor_payment = db.query(API.Purchase_order_vendor_payment).filter(
        API.Purchase_order_vendor_payment.purchase_order_vendor_bill_id == purchase_order_bill.first().purchase_order_vendor_bill_id).first()

    new_purchase_order_payment = API.Purchase_order_payment(
        id=str(uuid4()),
        purchase_order_bill_id=request.purchase_order_bill_id,
        purchase_order_vendor_payment_id=purchase_order_vendor_payment.id,
        or_no="PO Payment No. " + last_4_uuid +
        "-" + str(random.randint(1111, 9999)),
        amount_paid=request.amount_paid,
        payment_method_id=request.payment_method_id,
        created_by=request.created_by)

    if request.hospital_cash_payment:
        new_hospital_cash_payment = API.Hospital_cash_payment(
            **request.hospital_cash_payment.dict(),
            id=str(uuid4()),
            cash_payment_no="POP-CP-" + str(random.randint(
                11111, 99999)))

        db.add(new_hospital_cash_payment)
        db.commit()
        db.refresh(new_hospital_cash_payment)
        new_purchase_order_payment.hospital_cash_payment_id = new_hospital_cash_payment.id

    if request.hospital_check_payment:
        new_hospital_check_payment = API.Hospital_check_payment(
            **request.hospital_check_payment.dict(),
            id=str(uuid4()))

        db.add(new_hospital_check_payment)
        db.commit()
        db.refresh(new_hospital_check_payment)
        new_purchase_order_payment.hospital_check_payment_id = new_hospital_check_payment.id

    db.add(new_purchase_order_payment)
    purchase_order_bill.update({
        'status': 'Paid',
        'updated_by': request.created_by})
    db.commit()
    db.refresh(new_purchase_order_payment)
    
    #Check if purchase_order_vendor_payment amount + purchase order payment amount == total_vendor_bill
    #   if true: purchase_order_vendor_bill status = "Paid" and remaining bal = total bill - total amount paid(purchase_order_vendor_payment)
    #   else: purchase_order_vendor_bill status = "Incomplete"

    curr_total_amount_paid = purchase_order_vendor_payment.total_amount_paid + request.amount_paid

    purchase_order_vendor_bill = db.query(API.Purchase_order_vendor_bill).filter(
        API.Purchase_order_vendor_bill.id == purchase_order_bill.first().purchase_order_vendor_bill_id)

    purchase_order_vendor_payment = db.query(API.Purchase_order_vendor_payment).filter(
        API.Purchase_order_vendor_payment.purchase_order_vendor_bill_id == purchase_order_bill.first().purchase_order_vendor_bill_id)
    
    if purchase_order_vendor_bill.first().total_vendor_bill == curr_total_amount_paid:
        purchase_order_vendor_bill.update({
        'remaining_balance': 0,
        'status': 'Paid',
        'updated_by': request.created_by})

        purchase_order_vendor_payment.update({
        'total_amount_paid': curr_total_amount_paid,
        'status': 'Completed',
        'updated_by': request.created_by})
    else:
        purchase_order_vendor_bill.update({
        'remaining_balance': purchase_order_vendor_bill.first().total_vendor_bill - curr_total_amount_paid,
        'status': 'Incomplete',
        'updated_by': request.created_by})        

        purchase_order_vendor_payment.update({
        'total_amount_paid': curr_total_amount_paid,
        'status': 'Incomplete',
        'updated_by': request.created_by})

    # purchase_order_vendor_bill = db.query(models.Purchase_order_vendor_bill).filter(
    #     models.Purchase_order_vendor_bill.id == request.purchase_order_bill_id)

    db.commit()
    return "Purchase order bill has been paid."


def update(id, request: UpdatePurchaseOrderPayment, db: Session):
    purchase_order_payment = db.query(API.Purchase_order_payment).filter(
        API.Purchase_order_payment.id == id)

    if not purchase_order_payment.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Purchase order payment is not available.")

    if request.hospital_cash_payment_id != '' and request.hospital_cash_payment != None :
        purchase_order_payment.update({
            'purchase_order_bill_id': request.purchase_order_bill_id,
            'payment_method_id': request.payment_method_id,
            #'payment_term_id': request.payment_term_id,
            'amount_paid': request.amount_paid,
            'hospital_cash_payment_id': request.hospital_cash_payment_id,
            # 'hospital_check_payment_id': request.hospital_check_payment_id,
            'date_of_payment':request.date_of_payment,
            'status':request.status,
            'updated_by':request.updated_by
        })

        db.commit()
        
        hospital_cash_payment = db.query(API.Hospital_cash_payment).filter(
        API.Hospital_cash_payment.id == request.hospital_cash_payment_id)
        hospital_cash_payment.update({
        'amount': request.amount_paid,
        'updated_by':request.updated_by
        })
        db.commit()
    
    elif request.hospital_cash_payment_id != '' and request.hospital_check_payment != None:
        print(request.hospital_cash_payment_id)
        hospital_cash_payment = db.query(API.Hospital_cash_payment).filter(
        API.Hospital_cash_payment.id == request.hospital_cash_payment_id)
        hospital_cash_payment.update({
        'status': 'Inactive',
        'updated_by':request.updated_by
        })
        db.commit()

        new_hospital_check_payment = API.Hospital_check_payment(
            **request.hospital_check_payment.dict(),
            id=str(uuid4()),check_status="Received")

        db.add(new_hospital_check_payment)
        db.commit()

        purchase_order_payment.update({
            'purchase_order_bill_id': request.purchase_order_bill_id,
            'payment_method_id': request.payment_method_id,
            'amount_paid': request.amount_paid,
            'date_of_payment':request.date_of_payment,
            'status':request.status,
            'updated_by':request.updated_by,
            'hospital_cash_payment_id': None,
            'hospital_check_payment_id': new_hospital_check_payment.id
        })
        db.commit()

    elif request.hospital_check_payment_id != '' and request.hospital_check_payment != None :
        purchase_order_payment.update({
            'purchase_order_bill_id': request.purchase_order_bill_id,
            'payment_method_id': request.payment_method_id,
            #'payment_term_id': request.payment_term_id,
            'amount_paid': request.amount_paid,
            #'hospital_cash_payment_id': request.hospital_cash_payment_id,
            'hospital_check_payment_id': request.hospital_check_payment_id,
            'date_of_payment':request.date_of_payment,
            'status':request.status,
            'updated_by':request.updated_by
        })
        db.commit()

        hospital_check_payment = db.query(API.Hospital_check_payment).filter(
        API.Hospital_check_payment.id == request.hospital_check_payment_id)

        hospital_check_payment_json = jsonable_encoder(request.hospital_check_payment)
        hospital_check_payment.update(hospital_check_payment_json)

        db.commit()
    
    elif request.hospital_check_payment_id != '' and request.hospital_cash_payment != None :
        print("ewq")
        hospital_check_payment = db.query(API.Hospital_check_payment).filter(
        API.Hospital_check_payment.id == request.hospital_check_payment_id)
        print(request.hospital_check_payment_id)
        hospital_check_payment.update({
        #'status': 'Inactive',
        'updated_by':request.updated_by
        })

        db.commit()

        new_hospital_cash_payment = API.Hospital_cash_payment(
            **request.hospital_cash_payment.dict(),
            id=str(uuid4()),
            cash_payment_no="POP-CP-" + str(random.randint(
                11111, 99999)))

        db.add(new_hospital_cash_payment)
        db.commit()

        purchase_order_payment.update({
            'purchase_order_bill_id': request.purchase_order_bill_id,
            'payment_method_id': request.payment_method_id,
            'amount_paid': request.amount_paid,
            'date_of_payment':request.date_of_payment,
            'status': request.status,
            'updated_by':request.updated_by,
            'hospital_check_payment_id': None,
            'hospital_cash_payment_id': new_hospital_cash_payment.id,
        })
        db.commit()
   
    return f"Purchase order payment has been updated."


def delete(id, updated_by: str, db: Session):
    purchase_order_payment = db.query(API.Purchase_order_payment).filter(
        API.Purchase_order_payment.id == id)
    if not purchase_order_payment.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Purchase order payment is not available.")
    purchase_order_payment.update({
        'status': 'Inactive',
        'updated_at': datetime.now(),
        'updated_by': updated_by})
    db.commit()
    return f"Purchase order payment has been deactivated."

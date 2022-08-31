from API.schemas.cms.disbursement.purchase_order_vendor_payment import ShowPurchaseOrderVendorPayment, CreatePurchaseOrderVendorPayment, UpdatePurchaseOrderVendorPayment
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models as API
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from uuid import uuid4
import random


def datatable(db: Session):
    purchase_order_vendor_payments = db.query(API.Purchase_order_vendor_payment).all()
    return purchase_order_vendor_payments


def find_all(db: Session):
    purchase_order_vendor_payments = db.query(API.Purchase_order_vendor_payment).filter(
        API.Purchase_order_vendor_payment.status != "Inactive").all()
    return purchase_order_vendor_payments


def find_one(id, db: Session):
    purchase_order_vendor_payment = db.query(API.Purchase_order_vendor_payment).filter(
        API.Purchase_order_vendor_payment.id == id).first()
    if not purchase_order_vendor_payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Purchase order vendor payment is not available.")
    return purchase_order_vendor_payment


def create(request: CreatePurchaseOrderVendorPayment, db: Session):

    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_purchase_order_vendor_payment = API.Purchase_order_vendor_payment(
        id=str(uuid4()),
        purchase_order_vendor_bill_id = request.purchase_order_vendor_bill_id,
        or_no="POVP OR No. "+ last_4_uuid + "-" + str(random.randint(1111, 9999)),
        total_amount_paid=request.total_amount_paid,
        payment_term_id=request.payment_term_id,
        payment_method_id=request.payment_method_id,
        status="Completed",
        created_by=request.created_by)

    if request.hospital_cash_payment:
        new_hospital_cash_payment = API.Hospital_cash_payment(
            **request.hospital_cash_payment.dict(),
            id=str(uuid4()),
            cash_payment_no="HCP-" + str(random.randint(
                11111, 99999)))

        db.add(new_hospital_cash_payment)
        db.commit()
        db.refresh(new_hospital_cash_payment)
        new_purchase_order_vendor_payment.hospital_cash_payment_id = new_hospital_cash_payment.id

    if request.hospital_check_payment:
        new_hospital_check_payment = API.Hospital_check_payment(
            **request.hospital_check_payment.dict(),
            id=str(uuid4()),check_status="Released")

        db.add(new_hospital_check_payment)
        db.commit()
        db.refresh(new_hospital_check_payment)
        new_purchase_order_vendor_payment.hospital_check_payment_id = new_hospital_check_payment.id

    db.add(new_purchase_order_vendor_payment)

    purchase_order_vendor_bill = db.query(API.Purchase_order_vendor_bill).filter(
        API.Purchase_order_vendor_bill.id == request.purchase_order_vendor_bill_id)
    purchase_order_bill = db.query(API.Purchase_order_bill).filter(
        API.Purchase_order_bill.purchase_order_vendor_bill_id == request.purchase_order_vendor_bill_id)


    purchase_order_bill.update({
        'status': 'Paid',
        'updated_by': request.created_by})

    purchase_order_vendor_bill.update({
        'remaining_balance': 0,
        'status': 'Paid',
        'updated_by': request.created_by})

    db.commit()
    db.refresh(new_purchase_order_vendor_payment)

    return "Purchase Order Vendor Bill has been paid."


def update(id, request: UpdatePurchaseOrderVendorPayment, db: Session):
    purchase_order_vendor_payment = db.query(API.Purchase_order_vendor_payment).filter(
        API.Purchase_order_vendor_payment.id == id)
    
    payment_term = db.query(API.Payment_term).filter(
        API.Payment_term.id == request.payment_term_id)
    
    print("hospital_cash_payment_id: "+ request.hospital_cash_payment_id)
    print(request.hospital_cash_payment)
    print("hospital_check_payment_id: "+ request.hospital_check_payment_id)
    print(request.hospital_check_payment)


    if not purchase_order_vendor_payment.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Purchase order vendor payment is not available.")

    if payment_term.first().term_name == 'Full Payment':
        print ("full payment")
        if request.hospital_cash_payment_id != '' and request.hospital_cash_payment != None :
            purchase_order_vendor_payment.update({
                'purchase_order_vendor_bill_id': request.purchase_order_vendor_bill_id,
                'payment_method_id': request.payment_method_id,
                'payment_term_id': request.payment_term_id,
                'total_amount_paid': request.total_amount_paid,
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
            'amount': request.total_amount_paid,
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
    
            purchase_order_vendor_payment.update({
                'purchase_order_vendor_bill_id': request.purchase_order_vendor_bill_id,
                'payment_method_id': request.payment_method_id,
                'payment_term_id': request.payment_term_id,
                'total_amount_paid': request.total_amount_paid,
                'date_of_payment':request.date_of_payment,
                'status':request.status,
                'updated_by':request.updated_by,
                'hospital_cash_payment_id': None,
                'hospital_check_payment_id': new_hospital_check_payment.id
            })
            db.commit()

        elif request.hospital_check_payment_id != '' and request.hospital_check_payment != None :
            purchase_order_vendor_payment.update({
                'purchase_order_vendor_bill_id': request.purchase_order_vendor_bill_id,
                'payment_method_id': request.payment_method_id,
                'payment_term_id': request.payment_term_id,
                'total_amount_paid': request.total_amount_paid,
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
                cash_payment_no="HCP-" + str(random.randint(
                    11111, 99999)))

            db.add(new_hospital_cash_payment)
            db.commit()

            purchase_order_vendor_payment.update({
                'purchase_order_vendor_bill_id': request.purchase_order_vendor_bill_id,
                'payment_method_id': request.payment_method_id,
                'payment_term_id': request.payment_term_id,
                'total_amount_paid': request.total_amount_paid,
                'date_of_payment':request.date_of_payment,
                'status': request.status,
                'updated_by':request.updated_by,
                'hospital_check_payment_id': None,
                'hospital_cash_payment_id': new_hospital_cash_payment.id,
            })
            db.commit()
    elif payment_term.first().term_name == 'Partial Payment':
        print ("partial payment")
        purchase_order_vendor_payment.update({
            'purchase_order_vendor_bill_id': request.purchase_order_vendor_bill_id,
            'payment_method_id': request.payment_method_id,
            'payment_term_id': request.payment_term_id,
            'total_amount_paid': request.total_amount_paid,
            # 'hospital_cash_payment_id': request.hospital_cash_payment_id,
            # 'hospital_check_payment_id': request.hospital_check_payment_id,
            'date_of_payment':request.date_of_payment,
            'status':request.status,
            'updated_by':request.updated_by
        })

        db.commit()

    return f"Purchase order vendor payment has been updated."


def delete(id, updated_by: str, db: Session):
    purchase_order_vendor_payment = db.query(API.Purchase_order_vendor_payment).filter(
        API.Purchase_order_vendor_payment.id == id)
    if not purchase_order_vendor_payment.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Purchase order vendor payment is not available.")
    purchase_order_vendor_payment.update({
        'status': 'Inactive',
        'updated_at': datetime.now(),
        'updated_by': updated_by})
    db.commit()
    return f"Purchase order vendor payment has been deactivated."

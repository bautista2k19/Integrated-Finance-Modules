from ntpath import join
import re
from fastapi.encoders import jsonable_encoder
from API.routers.ar_ap import doctor_fee_bill, inpatient_bills
from API.schemas.ar_ap.inpatient_bills import CreateInpatientBill, CreateInpatientBillWhenAdmitted,UpdateInpatientBill
from API.schemas.ar_ap.doctor_fee_bill import CreateDoctorFeeBill, DoctorFeeBill
from datetime import datetime , date


from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import false, or_, and_

import datetime

Current_Date = datetime.datetime.today()
print ('Current Date: ' + str(Current_Date))

Previous_Date = datetime.datetime.today() - datetime.timedelta(days=1)
print ('Previous Date: ' + str(Previous_Date))

NextDay_Date = datetime.datetime.today() + datetime.timedelta(days=1)
print ('Next Date: ' + str(NextDay_Date))

if(NextDay_Date =="2022-02-26 24:58:19.349881"):
    {print ('ALAS DOSE NAqq')

    }



def find_by_admission_id(admission_id, db: Session):
    inpatient_bills = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.admission_id == admission_id).first()
    if not inpatient_bills:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Inpatient Bill is not available.")
    return inpatient_bills

def datatable(db: Session):
    inpatient_bills = db.query(models.AR_InpatientBill).all()
    return inpatient_bills

def find_all(db: Session):
    inpatient_bills = db.query(models.AR_InpatientBill).filter(or_(models.AR_InpatientBill.status != "Inactive",models.AR_InpatientBill.status != "INACTIVE" )).all() 
    return inpatient_bills


def find_one(id, db: Session):
    inpatient_bills = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.id == id).first()
    if not inpatient_bills:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Inpatient Bill is not available.")
    return inpatient_bills

def find_by_invoice_no(invoice_no, db: Session):
    inpatient_bills = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.invoice_no == invoice_no).first()
    if not inpatient_bills:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Inpatient Bill is not available.")
  
    return inpatient_bills

    
def create(request: CreateInpatientBill, db: Session):
    # tmp_admission= request.admission_id
    d = datetime.now()
    curr_date = d.strftime("%Y%m%d")
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_hospital_services = models.AR_InpatientBill(
        id=str(uuid4()),
        admission_id = request.admission_id,
        inpatient_bill_no = "SOA"+ last_4_uuid + curr_date,
        date_of_billing= datetime.now(),
        due_date= datetime.now(),
        created_by= request.created_by,
        created_at= datetime.now()
        )
    admission_id_same = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.admission_id == request.admission_id)

    for row in admission_id_same:
        if row.admission_id == request.admission_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Inpatient Bill already exists.")
    
    db.add(new_hospital_services)
    db.commit()

    tmp_drfee= db.query(models.AR_SurgeryInCharge).select_from(models.AR_Inpatient).\
    join(models.AR_PatientRegistration).\
    join(models.AR_Surgery).\
    join(models.AR_SurgeryInCharge).\
    filter(models.AR_Inpatient.admission_id ==request.admission_id ).all()
    for i in range(len(tmp_drfee)):
        checkifexistingID= db.query(models.AR_DoctorFeeBill).filter(and_(models.AR_DoctorFeeBill.inpatient_bill_id ==new_hospital_services.id,models.AR_DoctorFeeBill.doctor_id == tmp_drfee[i].dr_in_charge_id)).first()
        dr_id = (tmp_drfee[i].dr_in_charge_id)

        for y in range(len(request.bill_doctor_fee)):
            if not checkifexistingID:
                new_doctor_fee = models.AR_DoctorFeeBill(
                        id=str(uuid4()),
                        invoice_no="DRFEEBill"+ "-" + str(random.randint(1111, 9999)),
                        invoice_date= datetime.now(),
                        inpatient_bill_id= new_hospital_services.id,
                        doctor_id= dr_id,
                        actual_pf= request.bill_doctor_fee[y].actual_pf,
                        patient_due = request.bill_doctor_fee[y].patient_due,
                        created_by= request.created_by,
                        created_at=datetime.now()
                        )     
                db.add(new_doctor_fee)
                db.commit()
                db.refresh(new_doctor_fee)
    db.refresh(new_hospital_services)
    return "Inpatient Bill and Doctor fee bill has been created."


# def update(id, request: UpdateInpatientBill, db: Session):
#     inpatient_bills = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.id == id)
#     invoice_no_same_name = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.id != id)

#     for row in invoice_no_same_name:
#         if row.invoice_no == request.invoice_no:
#             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail=f"Inpatient Bill already exists.")

#     if not inpatient_bills.first():
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail=f"Inpatient Bill is not available.")

    
#     inpatient_bills_json = jsonable_encoder(request)     
#     inpatient_bills.update(inpatient_bills_json)
                            
#     db.commit()
#     return f"Inpatient Bill has been updated."

# update
def update(id, request: UpdateInpatientBill, db : Session, current_user):
    purchase_request = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.id == id)
    purchase_request_all = db.query(models.AR_DoctorFeeBill).filter(models.AR_DoctorFeeBill.inpatient_bill_id == id).all()
    item_arr = []
    for x in range(len(purchase_request_all)):
        item_arr.append(purchase_request_all[x].doctor_id)

    print(item_arr)
    if not purchase_request.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Purchase Request with the {id} is not found')
    inpatient_bills.update(
       {
        'inpatient_payment_id' : request.inpatient_payment_id,
        'date_of_billing' : request.date_of_billing,
        'due_date':request.due_date,
        'balance_due':request.balance_due,
        'updated_by': current_user,
        'status' : request.status,
        # 'created_at' : request.created_at,
       }
    )
    
    # add if there are new purchase request items on update
    tmp_drfee= db.query(models.AR_SurgeryInCharge).select_from(models.AR_Inpatient).\
    join(models.AR_PatientRegistration).\
    join(models.AR_Surgery).\
    join(models.AR_SurgeryInCharge).\
    filter(models.AR_Inpatient.admission_id ==request.admission_id ).all()
    for i in range(len(tmp_drfee)):
        checkifexistingID= db.query(models.AR_DoctorFeeBill).filter(and_(models.AR_DoctorFeeBill.inpatient_bill_id ==id,models.AR_DoctorFeeBill.doctor_id == tmp_drfee[i].dr_in_charge_id)).first()
        dr_id = (tmp_drfee[i].dr_in_charge_id)

        for y in range(len(request.bill_doctor_fee)):
            if not checkifexistingID:
                new_doctor_fee = models.AR_DoctorFeeBill(
                        id=str(uuid4()),
                        invoice_no="DRFEEBill"+ "-" + str(random.randint(1111, 9999)),
                        invoice_date= datetime.now(),
                        inpatient_bill_id= inpatient_bills.id,
                        doctor_id= dr_id,
                        actual_pf= request.bill_doctor_fee[y].actual_pf,
                        patient_due = request.bill_doctor_fee[y].patient_due,
                        created_by= current_user,
                        created_at=datetime.now()
                        )     
                db.add(new_doctor_fee)
                db.commit()
                db.refresh(new_doctor_fee)
        else:
            print("false")
            # pass

    return request




def completed(id, updated_by:str, db: Session):
    inpatient_bills = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.id == id)
    if not inpatient_bills.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Inpatient Bill is not available.")
    inpatient_bills.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Inpatient Bill has been completed."

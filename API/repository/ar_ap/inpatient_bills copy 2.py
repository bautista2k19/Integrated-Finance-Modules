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
    new_inpatient_bill = models.AR_InpatientBill(
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
    
    db.add(new_inpatient_bill)
    db.commit()

    tmp_drfee= db.query(models.AR_SurgeryInCharge).select_from(models.AR_Inpatient).\
    join(models.AR_PatientRegistration).\
    join(models.AR_Surgery).\
    join(models.AR_SurgeryInCharge).\
    filter(models.AR_Inpatient.admission_id ==request.admission_id ).all()
    for i in range(len(tmp_drfee)):
        checkifexistingID= db.query(models.AR_DoctorFeeBill).filter(and_(models.AR_DoctorFeeBill.inpatient_bill_id ==new_inpatient_bill.id,models.AR_DoctorFeeBill.doctor_id == tmp_drfee[i].dr_in_charge_id)).first()
        dr_id = (tmp_drfee[i].dr_in_charge_id)

        for y in range(len(request.bill_doctor_fee)):
            if not checkifexistingID:
                new_doctor_fee = models.AR_DoctorFeeBill(
                        id=str(uuid4()),
                        invoice_no="DRFEEBill"+ "-" + str(random.randint(1111, 9999)),
                        invoice_date= datetime.now(),
                        inpatient_bill_id= new_inpatient_bill.id,
                        doctor_id= dr_id,
                        actual_pf= request.bill_doctor_fee[y].actual_pf,
                        patient_due = request.bill_doctor_fee[y].patient_due,
                        created_by= request.created_by,
                        created_at=datetime.now()
                        )     
                db.add(new_doctor_fee)
                db.commit()
                db.refresh(new_doctor_fee)
        
        #-----------------------------------------------------------------------# TREATMENT BILL
    treatment_bill_with_discharge= db.query(models.AR_Inpatient, models.AR_Treatment).\
            select_from(models.AR_Inpatient).\
                    join(models.AR_PatientRegistration).\
                    join(models.AR_Treatment).\
                    filter(and_(models.AR_Inpatient.admission_id == request.admission_id,
                                models.AR_Inpatient.patient_id == models.AR_Treatment.patient_id ,
                                models.AR_Treatment.status == "FOR BILLING")).all()
                    #filter(or_(models.AR_DischargeManagement.admission_id == request.admission_id))

    for i in range(len(treatment_bill_with_discharge)):
        checkifexistingID= db.query(models.AR_TreatmentBill).filter(and_(models.AR_TreatmentBill.inpatient_bill_id ==new_inpatient_bill.id,models.AR_TreatmentBill.treatment_id == treatment_bill_with_discharge[i].Treatment.id)).first()

        print(treatment_bill_with_discharge[i].Treatment.id)
        treatment_ids = (treatment_bill_with_discharge[i].Treatment.id)

        for y in range(len(request.bill_treatments)):
            if not checkifexistingID:
                new_treatment_bill = models.AR_TreatmentBill(
                        id=str(uuid4()),
                        invoice_no="TRTMNTBILL"+ "-" + str(random.randint(1111, 9999)),
                        invoice_date= datetime.datetime.now(),
                        inpatient_bill_id= new_inpatient_bill.id,
                        treatment_id= treatment_ids,
                        total_amount= 00,
                        cancellation_return= request.bill_treatments[y].cancellation_return,
                        created_by= request.created_by,
                        created_at=datetime.datetime.now()
                        )     
                db.add(new_treatment_bill)
                db.commit()
                db.refresh(new_treatment_bill)
    db.refresh(new_inpatient_bill)
    return "Inpatient Bill and Treatment fee bill has been created."




# update
def update(id, request_ito: UpdateInpatientBill, db : Session):
    inpt_bill = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.id == id)
    inpt_bill_all = db.query(models.AR_DoctorFeeBill).filter(models.AR_DoctorFeeBill.inpatient_bill_id == id).all()
    inpatient_bill_arr = []
    for i in range(len(inpt_bill_all)):
        inpatient_bill_arr.append(inpt_bill_all[i].doctor_id)

    print(inpatient_bill_arr)
    if not inpt_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Inpatient bill with the {id} is not found')

    inpt_bill.update(
       {
        'admission_id': request_ito.admission_id,
        'inpatient_payment_id' : request_ito.inpatient_payment_id,
        'date_of_billing' : request_ito.date_of_billing,
        'due_date':request_ito.due_date,
        'balance_due':request_ito.balance_due,
        'status' : request_ito.status,
        'updated_by': request_ito.updated_by,
        'updated_at' : request_ito.updated_at,
       }
    )
   
    tmp_drfee= db.query(models.AR_SurgeryInCharge).select_from(models.AR_Inpatient).\
    join(models.AR_PatientRegistration).\
    join(models.AR_Surgery).\
    join(models.AR_SurgeryInCharge).\
    filter(models.AR_Inpatient.admission_id ==request_ito.admission_id ).all()
    for i in range(len(tmp_drfee)):
        checkifexistingID= db.query(models.AR_DoctorFeeBill).filter(and_(models.AR_DoctorFeeBill.inpatient_bill_id ==id,models.AR_DoctorFeeBill.doctor_id == tmp_drfee[i].dr_in_charge_id)).first()
        dr_id = (tmp_drfee[i].dr_in_charge_id)

        for y in range(len(request_ito.bill_doctor_fee)):
            if not checkifexistingID:
                new_doctor_fee = models.AR_DoctorFeeBill(
                        id=str(uuid4()),
                        invoice_no="DRFEEBill"+ "-" + str(random.randint(1111, 9999)),
                        invoice_date=request_ito.updated_at,
                        inpatient_bill_id= id,
                        doctor_id= dr_id,
                        actual_pf= request_ito.bill_doctor_fee[y].actual_pf,
                        sc_pwd_discount= request_ito.bill_doctor_fee[y].sc_pwd_discount,
                        philhealth=request_ito.bill_doctor_fee[y].philhealth,
                        discount=request_ito.bill_doctor_fee[y].discount,
                        hmo=request_ito.bill_doctor_fee[y].hmo,
                        patient_due = request_ito.bill_doctor_fee[y].patient_due,
                        created_by= request_ito.updated_by,
                        created_at=request_ito.updated_at
                        )     
                db.add(new_doctor_fee)
                db.commit()
                db.refresh(new_doctor_fee)
        else:
            print("false")
            # pass

    return request_ito




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

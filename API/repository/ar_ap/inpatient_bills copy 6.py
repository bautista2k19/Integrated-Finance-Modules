from ntpath import join
from operator import mod
import re
from fastapi.encoders import jsonable_encoder
from API.routers.ar_ap import doctor_fee_bill, inpatient_bills
from API.schemas.ar_ap import room_bill
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

from datetime import datetime
import numpy as np

from datetime import timedelta

# def find_by_admission_id(admission_id, db: Session):
#     inpatient_bills = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.admission_id == admission_id).first()
#     if not inpatient_bills:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail="Inpatient Bill is not available.")
#     return inpatient_bills

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
        
        #-----------------------------------------------------------------------# TREATMENT
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
                        invoice_date= datetime.now(),
                        inpatient_bill_id= new_inpatient_bill.id,
                        treatment_id= treatment_ids,
                        total_amount= 00,
                        cancellation_return= request.bill_treatments[y].cancellation_return,
                        created_by= request.created_by,
                        created_at=datetime.now()
                        )     
                db.add(new_treatment_bill)
                db.commit()
                db.refresh(new_treatment_bill)

#---------------------------------------------------------------------------------LAB 
    lab_requests_bill= db.query(models.AR_Inpatient, models.AR_LabRequest).\
            select_from(models.AR_Inpatient).\
                    join(models.AR_PatientRegistration).\
                    join(models.AR_LabRequest).\
                    filter(and_(models.AR_Inpatient.admission_id == request.admission_id,
                                models.AR_Inpatient.patient_id == models.AR_LabRequest.patient_id ,
                                models.AR_LabRequest.status == "FOR BILLING")).all()


    for i in range(len(lab_requests_bill)):
        checkifexistingID= db.query(models.AR_LabRequestBill).filter(and_(models.AR_LabRequestBill.inpatient_bill_id ==new_inpatient_bill.id,models.AR_LabRequestBill.lab_requests_id == lab_requests_bill[i].LabRequest.id)).first()

        print(lab_requests_bill[i].LabRequest.id)
        lab_request_ids = (lab_requests_bill[i].LabRequest.id)

        for y in range(len(request.bill_lab_requests)):
            if not checkifexistingID:
                new_bill_lab_requests = models.AR_LabRequestBill(
                        id=str(uuid4()),
                        invoice_no="LABBILL"+ "-" + str(random.randint(1111, 9999)),
                        invoice_date= datetime.now(),
                        inpatient_bill_id= new_inpatient_bill.id,
                        lab_requests_id= lab_request_ids,
                        total_amount= 00,
                        cancellation_return= request.bill_lab_requests[y].cancellation_return,
                        created_by= request.created_by,
                        created_at=datetime.now()
                        )     
                db.add(new_bill_lab_requests)
                db.commit()
                db.refresh(new_bill_lab_requests)

    #-----------------------------------------------------------------------# PHARMACY
    pharmacy_bill= db.query(models.AR_Inpatient, models.AR_Prescription).\
            select_from(models.AR_Inpatient).\
                    join(models.AR_Prescription).\
                    filter(and_(models.AR_Prescription.admission_id == request.admission_id,
                                models.AR_Inpatient.admission_id == models.AR_Prescription.admission_id,
                                models.AR_Prescription.status == "FOR BILLING")).all()

    for i in range(len(pharmacy_bill)):
        checkifexistingID= db.query(models.AR_PharmacyBill).filter(and_(models.AR_PharmacyBill.inpatient_bill_id ==new_inpatient_bill.id,models.AR_PharmacyBill.prescription_id == pharmacy_bill[i].Prescription.prescription_id)).first()

        print(pharmacy_bill[i].Prescription.prescription_id)
        prescription_id_ids = (pharmacy_bill[i].Prescription.prescription_id)

        for y in range(len(request.bill_pharmacy)):
            if not checkifexistingID:
                new_pharmacy_bill = models.AR_PharmacyBill(
                        id=str(uuid4()),
                        invoice_no="PHRMCYBLL"+ "-" + str(random.randint(1111, 9999)),
                        invoice_date= datetime.now(),
                        inpatient_bill_id= new_inpatient_bill.id,
                        prescription_id= prescription_id_ids,
                        total_amount= 00,
                        cancellation_return= request.bill_pharmacy[y].cancellation_return,
                        created_by= request.created_by,
                        created_at=datetime.now()
                        )     
                db.add(new_pharmacy_bill)
                db.commit()
                db.refresh(new_pharmacy_bill)


    
    #-----------------------------------------------------------------------# Hospital Charges
    hospital_charges= db.query(models.AR_Inpatient, models.AR_HospitalServices).\
        select_from(models.AR_Inpatient).\
                join(models.AR_PatientRegistration).\
                join(models.AR_HospitalServices).\
                filter(and_(models.AR_Inpatient.admission_id == request.admission_id,
                            models.AR_Inpatient.admission_id == models.AR_HospitalServices.admission_id,
                            models.AR_HospitalServices.status == "FOR BILLING")).all()
    
    for i in range(len(hospital_charges)):
        checkifexistingID= db.query(models.AR_HospitalChargesBill).filter(and_(models.AR_HospitalChargesBill.inpatient_bill_id ==new_inpatient_bill.id,models.AR_HospitalChargesBill.hospital_services_id == hospital_charges[i].HospitalServices.id)).first()

        
        hospital_services_id = (hospital_charges[i].HospitalServices.id)

        for y in range(len(request.bill_hospital_charges)):
            if not checkifexistingID:
                new_hospital_charges = models.AR_HospitalChargesBill(
                        id=str(uuid4()),
                        invoice_no="HSPTLSRVCBLL"+ "-" + str(random.randint(1111, 9999)),
                        invoice_date= datetime.now(),
                        inpatient_bill_id= new_inpatient_bill.id,
                        hospital_services_id= hospital_services_id,
                        total_amount= 00,
                        cancellation_return= request.bill_hospital_charges[y].cancellation_return,
                        created_by= request.created_by,
                        created_at=datetime.now()
                        )     
                db.add(new_hospital_charges)
                db.commit()
                db.refresh(new_hospital_charges)


    #----------------------------------------------ROOM BILL
    room_bill= db.query(models.AR_Room, models.AR_Room_type, models.AR_DischargeManagement).\
                select_from(models.AR_Room).join(models.AR_Room_type)\
                        .join(models.AR_Inpatient)\
                        .join(models.AR_DischargeManagement)\
                        .filter(and_(models.AR_Room.admission_id == request.admission_id,
                            models.AR_Inpatient.patient_status == "Discharge")).order_by(models.AR_Room.date_admitted).all()

    discharge_date = room_bill[0].DischargeManagement.discharge_date
    dischargeStr = str(discharge_date)
    item_arr = []
    item_arr_datetime = []

    for i in range(len(room_bill)):
        date_admitted = room_bill[i].Room.date_admitted
        dateTimeStr = str(date_admitted)
        item_arr.append(dateTimeStr)
        item_arr_datetime.append(room_bill[i].Room.date_admitted)
        datetimeFormat = '%Y-%m-%d %H:%M:%S'

    last_index_of_room_bill= (len(room_bill)-1)
    last_room_rate= room_bill[last_index_of_room_bill].Room_type.amount
    last_index = (len(item_arr)-1)
    room_bill_last_index_not_included =0
    room_bill_last_index_only =0
    for i in range(len(item_arr)-1):
        v= datetime.strptime(item_arr[i+1], datetimeFormat) - datetime.strptime(item_arr[i], datetimeFormat)
        room_bill_last_index_not_included += v.days * room_bill[i].Room_type.amount
        # print(room_bill_last_index_not_included)
        
    date_last_index = item_arr[last_index]
    days_to_discharge = (datetime.strptime(dischargeStr, datetimeFormat)  - datetime.strptime(date_last_index, datetimeFormat))
    room_bill_last_index_only += days_to_discharge.days * last_room_rate +room_bill_last_index_not_included
    # print(room_bill_last_index_only)  
    

    admisision_id_same = db.query(models.AR_RoomBill).filter(models.AR_RoomBill.admission_id != request.admission_id)

    for row in admisision_id_same:
        if row.admission_id == request.admission_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Room Bill already exists.")
       
    for y in range(len(request.bill_room)):
        if not checkifexistingID:
            new_room_bill = models.AR_RoomBill(
                    id=str(uuid4()),
                    invoice_no="RMBLL"+ "-" + str(random.randint(1111, 9999)),
                    invoice_date= datetime.now(),
                    admission_id = request.admission_id,
                    inpatient_bill_id= new_inpatient_bill.id,
                    total_amount= room_bill_last_index_only,
                    created_by= request.created_by,
                    created_at=datetime.now()
                    )     
            db.add(new_room_bill)
            db.commit()
            db.refresh(new_room_bill)

    db.refresh(new_inpatient_bill)
    return "Inpatient Bill, Pharmacy, Treatment, Doctor Fee, Lab fee bill, and Room Bill has been created."



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
        # 'inpatient_payment_id' : request_ito.inpatient_payment_id,
        # 'date_of_billing' : request_ito.date_of_billing,
        # 'due_date':request_ito.due_date,
        'balance_due':request_ito.balance_due,
        'status' : "Pending",
        'updated_by': request_ito.updated_by,
        'updated_at' : datetime.now(),
       }
    )
   
    # tmp_drfee= db.query(models.AR_SurgeryInCharge).select_from(models.AR_Inpatient).\
    # join(models.AR_PatientRegistration).\
    # join(models.AR_Surgery).\
    # join(models.AR_SurgeryInCharge).\
    # filter(models.AR_Inpatient.admission_id ==request_ito.admission_id ).all()
    # for i in range(len(tmp_drfee)):
    #     checkifexistingID= db.query(models.AR_DoctorFeeBill).filter(and_(models.AR_DoctorFeeBill.inpatient_bill_id ==id,models.AR_DoctorFeeBill.doctor_id == tmp_drfee[i].dr_in_charge_id)).first()
    #     dr_id = (tmp_drfee[i].dr_in_charge_id)

    #     for y in range(len(request_ito.bill_doctor_fee)):
    #         if not checkifexistingID:
    #             new_doctor_fee = models.AR_DoctorFeeBill(
    #                     id=str(uuid4()),
    #                     invoice_no="DRFEEBill"+ "-" + str(random.randint(1111, 9999)),
    #                     invoice_date=request_ito.updated_at,
    #                     inpatient_bill_id= id,
    #                     doctor_id= dr_id,
    #                     actual_pf= request_ito.bill_doctor_fee[y].actual_pf,
    #                     sc_pwd_discount= request_ito.bill_doctor_fee[y].sc_pwd_discount,
    #                     philhealth=request_ito.bill_doctor_fee[y].philhealth,
    #                     discount=request_ito.bill_doctor_fee[y].discount,
    #                     hmo=request_ito.bill_doctor_fee[y].hmo,
    #                     patient_due = request_ito.bill_doctor_fee[y].patient_due,
    #                     created_by= request_ito.updated_by,
    #                     created_at=request_ito.updated_at
    #                     )     
    #             db.add(new_doctor_fee)
    #             db.commit()
    #             db.refresh(new_doctor_fee)
    #         else:
    #             print("false")
    #             # pass

    treatment_bill_with_discharge= db.query(models.AR_Inpatient, models.AR_Treatment).\
            select_from(models.AR_Inpatient).\
                    join(models.AR_PatientRegistration).\
                    join(models.AR_Treatment).\
                    filter(and_(models.AR_Inpatient.admission_id == request_ito.admission_id,
                                models.AR_Inpatient.patient_id == models.AR_Treatment.patient_id ,
                                models.AR_Treatment.status == "FOR BILLING")).\
            order_by(models.AR_Treatment.session_datetime.asc()).all()
    
    for i in range(len(treatment_bill_with_discharge)):
        ifExistingTreatmentBill= db.query(models.AR_TreatmentBill).filter(and_(models.AR_TreatmentBill.inpatient_bill_id ==id,models.AR_TreatmentBill.treatment_id == treatment_bill_with_discharge[i].Treatment.id)).first()

        ifExistingTreatmentBill1= db.query(models.AR_TreatmentBill).filter(and_(models.AR_TreatmentBill.inpatient_bill_id ==id,models.AR_TreatmentBill.treatment_id == treatment_bill_with_discharge[i].Treatment.id))

        

        # treatment_ids = (treatment_bill_with_discharge[i].Treatment.id)

        # for y in range(len(request_ito.bill_treatments)):
        if not ifExistingTreatmentBill:
            new_treatment_bill = models.AR_TreatmentBill(
                    id=str(uuid4()),
                    invoice_no="TRTMNTBILL"+ "-" + str(random.randint(1111, 9999)),
                    invoice_date= datetime.now(),
                    inpatient_bill_id= id,
                    treatment_id= treatment_bill_with_discharge[i].Treatment.id,
                    total_amount= request_ito.bill_treatments[i].total_amount,
                    cancellation_return= request_ito.bill_treatments[i].cancellation_return,
                    created_by= request_ito.updated_by,
                    created_at= datetime.now(),
                    )     
            db.add(new_treatment_bill)
            db.commit()
            db.refresh(new_treatment_bill)

        else:
            ifExistingTreatmentBill1.update(
                {
                    'total_amount': request_ito.bill_treatments[i].total_amount,
                    # 'inpatient_payment_id' : request_ito.inpatient_payment_id,
                    # 'date_of_billing' : request_ito.date_of_billing,
                    # 'due_date':request_ito.due_date,
                    'cancellation_return':request_ito.bill_treatments[i].cancellation_return,
                    'status' : "Pending",
                    'updated_by': request_ito.updated_by,
                    'updated_at' : datetime.now(),
                }
            )
            db.commit()
            # else:
            #     print("EXISSTINNNGGGG")
                
                # pass
    return request_ito

  



# def completed(id, updated_by:str, db: Session):
#     inpatient_bills = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.id == id)
#     if not inpatient_bills.first():
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail=f"Inpatient Bill is not available.")
#     inpatient_bills.update({
#                     'status': 'Completed',
#                     'updated_at': datetime.now(),
#                     'updated_by': updated_by})
#     db.commit()
#     return f"Inpatient Bill has been completed."




from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap import prescription
from API.schemas.ar_ap.medicine_pr import CreateMedicine_PR, UpdateMedicine_PR
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import false, null, or_, and_


def datatable(db: Session):
    medicine_pr = db.query(models.AR_Medicine_PR).all()
    return medicine_pr


def find_all_for_billing(id, db: Session):
    prescription = db.query(models.AR_Medicine_PR).\
        select_from(models.AR_Inpatient).\
        join(models.AR_InpatientBill).\
        join(models.AR_Prescription).\
        join(models.AR_Medicine_PR).\
        filter(and_(models.AR_Medicine_PR.med_pres_status == "FOR BILLING", 
                    models.AR_Prescription.status == "FOR BILLING")).\
        filter(models.AR_Medicine_PR.created_at <= datetime.now()).\
        filter(and_(models.AR_InpatientBill.admission_id == id ,
                    models.AR_Prescription.admission_id ==id)).\
                    order_by(models.AR_Medicine_PR.created_at.asc()).all()

   

    # check_discharge_date = db.query(models.AR_Prescription).\
    #     select_from(models.AR_Inpatient).\
    #     join(models.AR_InpatientBill).\
    #     join(models.AR_Prescription).\
    #     filter(and_(models.AR_InpatientBill.id == id ,
    #                 models.AR_Prescription.admission_id ==models.AR_InpatientBill.admission_id)).all()


    # check_discharge_date = db.query(models.AR_DischargeManagement).\
    #     select_from(models.AR_Inpatient).\
    #     join(models.AR_InpatientBill).\
    #     join(models.AR_DischargeManagement).\
    #     filter(and_(models.AR_Inpatient.admission_id ==prescription.admission_id, 
    #                 models.AR_Treatment.patient_id == models.AR_Inpatient.patient_id,
    #                 models.AR_DischargeManagement.admission_id == models.AR_InpatientBill.admission_id,
    #                 models.AR_DischargeManagement.discharge_date<= datetime.now())).\
    #     order_by(models.AR_Inpatient.date_admitted.desc()).first()

    return prescription
    # check_discharge_date = db.query(models.AR_DischargeManagement).\
    #     select_from(models.AR_DischargeManagement).\
    #     join(models.AR_Inpatient).\
    #     join(models.AR_InpatientBill).\
    #     join(models.AR_Prescription).\
    #     filter(and_(models.AR_InpatientBill.admission_id == models.AR_Prescription.admission_id,
    #     models.AR_Prescription.admission_id == admission_id == models.AR_DischargeManagement.admission_id == admission_id)).\
    #     first()


    # if not check_discharge_date:
    #     medicine_pr_current_date = db.query(models.AR_Medicine_PR ).\
    #         select_from(models.AR_Inpatient).\
    #         join(models.AR_PatientRegistration).\
    #         join(models.AR_Prescription).\
    #         join(models.AR_Medicine_PR).\
    #         filter(and_(
    #                     models.AR_Medicine_PR.created_at >= prescription.Inpatient.date_admitted,\
    #                     models.AR_Medicine_PR.created_at <= datetime.now(),
    #                     prescription.Prescription.status == "FOR BILLING",)).\
    #                     order_by(models.AR_Medicine_PR.created_at.asc()).all()
       
    #     return medicine_pr_current_date  

    # else: 
    #     medicine_pr_with_discharge_date = db.query(models.AR_Medicine_PR).\
    #     select_from(models.AR_Inpatient).\
    #     join(models.AR_PatientRegistration).\
    #     join(models.AR_Prescription).\
    #     join(models.AR_Medicine_PR).\
    #     filter(and_(models.AR_Prescription.admission_id == models.AR_DischargeManagement.admission_id, 
    #                 models.AR_Medicine_PR.created_at >= prescription.Inpatient.date_admitted,
    #                 models.AR_Medicine_PR.created_at <= check_discharge_date.discharge_date,
    #                 models.AR_Medicine_PR.created_at <= datetime.now(),
    #                 prescription.Prescription.status == "FOR BILLING")).all()
  
    #     print("Both has treatment and discharge date!")
    #     return medicine_pr_with_discharge_date
            
    
    

def find_all(db: Session):
    medicine_pr = db.query(models.AR_Medicine_PR).filter(models.AR_Medicine_PR.status != "Completed").all()
    return medicine_pr


def find_one(id, db: Session):
    medicine_pr = db.query(models.AR_Medicine_PR).filter(models.AR_Medicine_PR.id == id).first()
    if not medicine_pr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Medicine prescription is not available.")
    return medicine_pr

def find_by_lab_request_no(medicine_no, db: Session):
    medicine_pr = db.query(models.AR_Medicine_PR).filter(models.AR_Medicine_PR.medicine_no == medicine_no).first()
    if not medicine_pr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Medicine prescription is not available.")
    return medicine_pr


def create(request: CreateMedicine_PR, db: Session):
    d = datetime.now()
    curr_date = d.strftime("%Y%m%d")

    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_medicine_pr = models.AR_Medicine_PR(**request.dict(),
        medpr_id=str(uuid4()),
        medicine_no= str(random.randint(1111, 9999)) )
                            
    db.add(new_medicine_pr)
    db.commit()
    db.refresh(new_medicine_pr)
    return "Medicine prescription has been created."


def update(id, request: UpdateMedicine_PR, db: Session):
    medicine_pr = db.query(models.AR_Medicine_PR).filter(models.AR_Medicine_PR.medpr_id == id)
    medicine_pr_same_name = db.query(models.AR_Medicine_PR).filter(models.AR_Medicine_PR.medpr_id != id)

    for row in medicine_pr_same_name:
        if row.medicine_no == request.medicine_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Medicine prescription already exists.")

    if not medicine_pr.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Medicine prescription is not available.")

    
    medicine_pr_json = jsonable_encoder(request)     
    medicine_pr.update(medicine_pr_json)
                            
    db.commit()
    return f"Medicine prescription has been updated."


def completed(id, updated_by:str, db: Session):
    medicine_pr = db.query(models.AR_Medicine_PR).filter(models.AR_Medicine_PR.id == id)
    if not medicine_pr.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Medicine prescription is not available.")
    medicine_pr.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by
                    })
    db.commit()
    return f"Medicine_PR has been deleted."
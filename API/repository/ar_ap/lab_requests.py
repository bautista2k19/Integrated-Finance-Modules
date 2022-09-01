from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.lab_requests import CreateLabRequest, UpdateLabRequest
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import false, null, or_, and_


def find_all_for_billing(id, db: Session):
    latest_admission_id = db.query(models.AR_Inpatient).\
        select_from(models.AR_Inpatient).\
        join(models.AR_PatientRegistration).\
        filter(models.AR_Inpatient.patient_id == id).\
        order_by(models.AR_Inpatient.date_admitted.desc()).first()

    check_discharge_date = db.query(models.AR_DischargeManagement).\
        select_from(models.AR_DischargeManagement).\
        join(models.AR_Inpatient).\
        filter(and_(models.AR_Inpatient.patient_id == id, models.AR_DischargeManagement.patient_id == id)).\
        order_by(models.AR_Inpatient.date_admitted.desc()).first()

# lab_request DATE must be greater than or equal to DATE ADMITTED
# lab_request STATUS must be FOR BILLING
# lab_request DATE must be less than or equal to DATE DISCHARGE 
# OR lab_request DATE must be less than or equal to CURRENT DATETIME
    lab_request_with_discharge = db.query(models.AR_LabRequest).\
        select_from(models.AR_Inpatient).\
        join(models.AR_PatientRegistration).\
        join(models.AR_LabRequest).\
        join(models.AR_DischargeManagement).\
        filter(models.AR_LabRequest.patient_id == id).\
        filter(and_(models.AR_DischargeManagement.patient_id == id,
                    models.AR_LabRequest.created_at >= latest_admission_id.date_admitted,\
                    models.AR_LabRequest.created_at <= models.AR_DischargeManagement.discharge_date,\
                    models.AR_LabRequest.created_at <= datetime.now(),
                    models.AR_LabRequest.status == "FOR BILLING" )).\
        order_by(models.AR_LabRequest.created_at.asc()).all()

    lab_req_current_time = db.query(models.AR_LabRequest).\
        select_from(models.AR_Inpatient).\
        join(models.AR_PatientRegistration).\
        join(models.AR_LabRequest).\
        filter(models.AR_LabRequest.patient_id == id).\
        filter(and_(models.AR_LabRequest.created_at >= latest_admission_id.date_admitted,\
                    models.AR_LabRequest.status == "FOR BILLING",
                    models.AR_LabRequest.created_at <= datetime.now() )).\
                    order_by(models.AR_LabRequest.created_at.asc()).all()

    if not check_discharge_date:
        print("Has lab_request but does not have discharge date")
        return lab_req_current_time  
    else: 
        print("Both has lab_request and discharge date!")
        return lab_request_with_discharge
        


def datatable(db: Session):
    lab_requests = db.query(models.AR_LabRequest).all()
    return lab_requests

def find_all(db: Session):
    lab_requests = db.query(models.AR_LabRequest).filter(models.AR_LabRequest.status != "Completed").all()
    return lab_requests


def find_one(id, db: Session):
    lab_requests = db.query(models.AR_LabRequest).filter(models.AR_LabRequest.id == id).first()
    if not lab_requests:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Lab Request is not available.")
    return lab_requests

def find_by_lab_request_no(lab_request_no, db: Session):
    lab_requests = db.query(models.AR_LabRequest).filter(models.AR_LabRequest.lab_request_no == lab_request_no).first()
    if not lab_requests:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Lab Request is not available.")
    return lab_requests


def create(request: CreateLabRequest, db: Session):

    d = datetime.now()
    curr_date = d.strftime("%Y%m%d")
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_lab_requests = models.AR_LabRequest(**request.dict(),
        id=str(uuid4()),
        lab_request_no="LAB"+ last_4_uuid + "-" + curr_date
        )
                            
    db.add(new_lab_requests)
    db.commit()
    db.refresh(new_lab_requests)
    return "Lab Request has been created."


def update(id, request: UpdateLabRequest, db: Session):
    lab_requests = db.query(models.AR_LabRequest).filter(models.AR_LabRequest.id == id)
    lab_requests_same_name = db.query(models.AR_LabRequest).filter(models.AR_LabRequest.id != id)

    for row in lab_requests_same_name:
        if row.lab_request_no == request.lab_request_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lab Request already exists.")

    if not lab_requests.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Lab Request is not available.")

    
    lab_requests_json = jsonable_encoder(request)     
    lab_requests.update(lab_requests_json)
                            
    db.commit()
    return f"Lab Request has been updated."


def completed(id, updated_by:str, db: Session):
    lab_requests = db.query(models.AR_LabRequest).filter(models.AR_LabRequest.id == id)
    if not lab_requests.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Lab Request is not available.")
    lab_requests.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                     })
    db.commit()
    return f"LabRequest has been deleted."
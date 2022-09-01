from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.inpatients import CreateInpatient, UpdateInpatient
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import false, or_, and_


def find_all_patient_without_bill(db: Session):
    inpatients = db.query(models.AR_Inpatient).filter(models.AR_Inpatient.admission_id != models.AR_InpatientBill.admission_id).all()
    return inpatients


def find_by_room_number(room_number, db: Session):
    inpatients3 = db.query(models.AR_Inpatient).filter(or_(models.AR_Inpatient.room_number == room_number, models.AR_Inpatient.room_transfer_id)).all()

    # for i in range(len(inpatients3)):
    #     inpatients1 = db.query(models.AR_Inpatient).filter(models.AR_Inpatient.room_number == inpatients3[i].room_number).all()

    if not inpatients3:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Room number has no patient.")
    return inpatients3


def datatable(db: Session):
    inpatients = db.query(models.AR_Inpatient).all()
    return inpatients

def find_all(db: Session):
    inpatients = db.query(models.AR_Inpatient).filter(models.AR_Inpatient.patient_status != "Completed").all()
    return inpatients


def find_one(id, db: Session):
    inpatients = db.query(models.AR_Inpatient).filter(models.AR_Inpatient.admission_id == id).first()
    if not inpatients:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Inpatient is not available.")
    return inpatients

def create(request: CreateInpatient, db: Session):
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_inpatients = models.AR_Inpatient(**request.dict(),
        admission_id=str(uuid4()),
        inpatient_no="PT"+ last_4_uuid + "-" + str(random.randint(1111, 9999)))
        
    inpatient_no_var="PT"+ last_4_uuid + "-" + str(random.randint(1111, 9999))
    if db.query(models.AR_Inpatient).filter_by(inpatient_no= inpatient_no_var).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Inpatient already exists.")
                            
    db.add(new_inpatients)
    db.commit()
    db.refresh(new_inpatients)
  


    d = datetime.now()
    curr_date = d.strftime("%Y%m%d")
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_hospital_services = models.AR_InpatientBill(
        id=str(uuid4()),
        admission_id = new_inpatients.admission_id,
        inpatient_bill_no = "SOA"+ last_4_uuid + curr_date,
        date_of_billing= datetime.now(),
        due_date= datetime.now(),
        # created_by= request.created_by,
        created_at= datetime.now()
        )
    admission_id_same = db.query(models.AR_InpatientBill).filter(models.AR_InpatientBill.admission_id == new_inpatients.admission_id)

    for row in admission_id_same:
        if row.admission_id == new_inpatients.admission_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Inpatient Bill already exists.")
    
    db.add(new_hospital_services)
    db.commit()
    db.refresh(new_hospital_services)
    return "Inpatient has been created."

        #     patient_id=request.patient_id,
        # room_number= request.room_number,
        # room_transfer_id= request.room_transfer_id,
        # date_admitted=datetime.now(),
        # reason_of_admittance=request.reason_of_admittance,
        # department=request.department,
        # diagnosis=request.diagnosis,
        # tests=request.tests,
        # treatments=request.treatments,
        # surgery=request.surgery,
        # patient_status=request.patient_status


def update(id, request: UpdateInpatient, db: Session):
    inpatients = db.query(models.AR_Inpatient).filter(models.AR_Inpatient.admission_id == id)
    inpatients_same_name = db.query(models.AR_Inpatient).filter(models.AR_Inpatient.admission_id != id)

    # for row in inpatients_same_name:
    #     if row.patient_id == request.patient_id:
    #         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
    #                         detail=f"Inpatient already exists.")

    if not inpatients.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Inpatient is not available.")

    
    inpatients_json = jsonable_encoder(request)     
    inpatients.update(inpatients_json)
                            
    db.commit()
    return f"Inpatient has been updated."


def completed(id, updated_by:str, db: Session):
    inpatients = db.query(models.AR_Inpatient).filter(models.AR_Inpatient.admission_id == id)
    if not inpatients.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Inpatient is not available.")
    inpatients.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Inpatient has been completed."
from statistics import mode
from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.treatments import CreateTreatment, UpdateTreatment
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import false, null, or_, and_



def datatable(db: Session):
    treatments = db.query(models.AR_Treatment).all()
    return treatments

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
 
    if not check_discharge_date:
        treatment_current_time = db.query(models.AR_Treatment).\
        select_from(models.AR_Inpatient).\
        join(models.AR_PatientRegistration).\
        join(models.AR_Treatment).\
        filter(models.AR_Treatment.patient_id == id).\
        filter(and_(models.AR_Treatment.session_datetime >= latest_admission_id.date_admitted,\
                    models.AR_Treatment.status == "FOR BILLING",
                    models.AR_Treatment.session_datetime <= datetime.now() )).\
                    order_by(models.AR_Treatment.session_datetime.asc()).all()

        return treatment_current_time  
    else: 
        treatment_with_discharge = db.query(models.AR_Treatment).\
        select_from(models.AR_Inpatient).\
        join(models.AR_PatientRegistration).\
        join(models.AR_Treatment).\
        join(models.AR_DischargeManagement).\
        filter(models.AR_Treatment.patient_id == id).\
        filter(and_(models.AR_DischargeManagement.patient_id == id,
                    models.AR_Treatment.session_datetime >= latest_admission_id.date_admitted,\
                    models.AR_Treatment.session_datetime <= models.AR_DischargeManagement.discharge_date,\
                    models.AR_Treatment.session_datetime <= datetime.now(),
                    models.AR_Treatment.status == "FOR BILLING",)).\
        order_by(models.AR_Treatment.session_datetime.asc()).all()
        
        print("Both has treatment and discharge date!")
        return treatment_with_discharge
    
   
  

def find_one(id, db: Session):
    treatments = db.query(models.AR_Treatment).filter(models.AR_Treatment.id == id).first()
    if not treatments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Treatment is not available.")
    return treatments

def find_by_treatment_no(treatment_no, db: Session):
    treatments = db.query(models.AR_Treatment).filter(models.AR_Treatment.treatment_no == treatment_no).first()
    if not treatments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Treatment is not available.")
    return treatments


def create(request: CreateTreatment, db: Session):
    new_uuid = str(uuid4())
    last_4_uuid = str(new_uuid[-4:])
    new_treatments = models.AR_Treatment(**request.dict(),
        id=str(uuid4()),
        treatment_no="TRTMNT"+ last_4_uuid + "-" + str(random.randint(1111, 9999)),
        )
        
    treatment_no_var="TRTMNT"+ last_4_uuid + "-" + str(random.randint(1111, 9999))
    if db.query(models.AR_Treatment).filter_by(treatment_no= treatment_no_var).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Treatment already exists.")
                            
    db.add(new_treatments)
    db.commit()
    db.refresh(new_treatments)
    return "Treatment has been created."


def update(id, request: UpdateTreatment, db: Session):
    treatments = db.query(models.AR_Treatment).filter(models.AR_Treatment.id == id)
    treatments_same_name = db.query(models.AR_Treatment).filter(models.AR_Treatment.id != id)

    for row in treatments_same_name:
        if row.treatment_no == request.treatment_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Treatment already exists.")

    if not treatments.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Treatment is not available.")

    
    treatments_json = jsonable_encoder(request)     
    treatments.update(treatments_json)
                            
    db.commit()
    return f"Treatment has been updated."



def completed(id, updated_by:str, db: Session):
    treatments = db.query(models.AR_Treatment).filter(models.AR_Treatment.id == id)
    if not treatments.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Treatment is not available.")
    treatments.update({
                    'status': 'Inactive',
                    'updated_at': datetime.now(),
                     })
    db.commit()
    return f"Treatment has been deleted."
    
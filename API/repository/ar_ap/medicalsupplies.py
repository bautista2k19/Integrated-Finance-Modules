from datetime import date, datetime, timedelta
from API.schemas.ar_ap.medicalsupplies import CreateMedicalSupplies, MedicalSupplies,DeleteMedicalSupplies
from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4



def datatable(db: Session):
    medicalsupplies = db.query(models.AR_MedicalSupplies).all()
    #users = db.query(models.AR_User, models.AR_Employee).join(models.AR_User).join(models.AR_Employee)
    return medicalsupplies

def find_all(db: Session):
    medicalsupplies = db.query(models.AR_MedicalSupplies).filter(models.AR_MedicalSupplies.status == "High").all()
    
    return medicalsupplies

def find_one(id, db:Session):
    medicalsupplies = db.query(models.AR_MedicalSupplies).filter(models.AR_MedicalSupplies.id == id).first()
    if not medicalsupplies:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Medical Supplies with the id {id} is not available.")
    
    return medicalsupplies

def create(request: CreateMedicalSupplies , db: Session):
    new_medicalsupplies = models.AR_MedicalSupplies(
    ms_product_name = request.ms_product_name,
    ms_quantity = request.ms_quantity,
    ms_manufacturer = request.ms_manufacturer,
    ms_manufactured_date = request.ms_manufactured_date,
    ms_import_date = request.ms_import_date,
    ms_expiration_date= request.ms_expiration_date,
    ms_batch_number= request.ms_batch_number,
    ms_unit_price= request.ms_unit_price,
    ms_tax= request.ms_tax,
    ms_purpose= request.ms_purpose,
    condition= request.condition,
    status= request.status,
    #dosage= request.dosage,
    created_by= request.created_by,
    created_at= datetime.now(),
    id = str(uuid4())
   
    )
    if db.query(models.AR_MedicalSupplies).filter_by(ms_product_name=request.ms_product_name).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Medical Supplies {request.ms_product_name} already exists.")

    db.add(new_medicalsupplies)
    db.commit()
    db.refresh(new_medicalsupplies)

    # medicalsupplies = db.query(models.AR_MedicalSupplies)   #NEW1 COMMENT KO MUNA
    # medicalsupplies.update({
    # 'medical_qty' : request.medical_qty})
    # db.commit()
    return new_medicalsupplies

def update(id, request: MedicalSupplies, db: Session):
    medicalsupplies = db.query(models.AR_MedicalSupplies).filter(models.AR_MedicalSupplies.id == id)
    ms_product_name_same_name = db.query(models.AR_MedicalSupplies).filter(models.AR_MedicalSupplies.id != id)
    if not medicalsupplies.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Medical Supplies with the id {id} is not available.")
                            
    for row in ms_product_name_same_name:
        if row.ms_product_name == request.ms_product_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Medical Supplies Name already exist.")
    medicalsupplies.update({
    'ms_product_name' : request.ms_product_name,
    'ms_quantity' : request.ms_quantity,
    'ms_manufacturer' : request.ms_manufacturer,
    'ms_manufactured_date' : request.ms_manufactured_date,
    'ms_import_date' : request.ms_import_date,
    'ms_expiration_date' : request.ms_expiration_date,
    'ms_batch_number' : request.ms_batch_number,
    'ms_unit_price' : request.ms_unit_price,
    'ms_tax' : request.ms_tax,
    'ms_purpose' : request.ms_purpose,
    'condition' : request.condition,
    #'dosage': request.dosage,
    'updated_by' : request.updated_by,
    'updated_at' : datetime.now()})

    
    db.commit()
    return f"Medical Supplies with the id {id} has been updated."
    
def delete(id, updated_by:str, db: Session):
    user = db.query(models.AR_MedicalSupplies).filter(models.AR_MedicalSupplies.id == id)
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")
    user.update({'status': 'Inactive',
                    'updated_at': datetime.now(),'updated_by': updated_by})
    db.commit()
    return f"Medical Supplies with the id {id} has been deleted."
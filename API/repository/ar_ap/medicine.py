from datetime import date, datetime, timedelta
from API.schemas.ar_ap.medicine import CreateMedicine, Medicine,DeleteMedicine
from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4



def datatable(db: Session):
    medicine = db.query(models.AR_Medicine).all()
    #users = db.query(models.AR_User, models.AR_Employee).join(models.AR_User).join(models.AR_Employee)
    return medicine

def find_all(db: Session):
    medicine = db.query(models.AR_Medicine).filter(models.AR_Medicine.status == "High").all()
    return medicine

def find_one(id, db:Session):
    medicine = db.query(models.AR_Medicine).filter(models.AR_Medicine.id == id).first()
    if not medicine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Medicine with the id {id} is not available.")
    
    return medicine

def create(request: CreateMedicine , db: Session):
    new_medicine = models.AR_Medicine(
    med_product_name = request.med_product_name,
    med_quantity = request.med_quantity,
    med_manufacturer = request.med_manufacturer,
    med_manufactured_date = request.med_manufactured_date,
    med_import_date = request.med_import_date,
    med_expiration_date= request.med_expiration_date,
    med_batch_number= request.med_batch_number,
    med_unit_price= request.med_unit_price,
    med_tax= request.med_tax,
    med_purpose= request.med_purpose,
    condition= request.condition,
    status= request.status,
    dosage= request.dosage,
    created_by= request.created_by,
    created_at= datetime.now(),
    id = str(uuid4())
   
    )
    if db.query(models.AR_Medicine).filter_by(med_product_name=request.med_product_name).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Medicine {request.med_product_name} already exists.")

    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)
    
    # medicine = db.query(models.AR_Medicine)        #NEW1 COMMENT KO MUNA
    # medicine.update({
    # 'medicine_qty' : request.medicine_qty})
    # db.commit()
    return new_medicine
     
def update(id, request: Medicine, db: Session):
    medicine = db.query(models.AR_Medicine).filter(models.AR_Medicine.id == id)
    med_product_name_same_name = db.query(models.AR_Medicine).filter(models.AR_Medicine.id != id)
    if not medicine.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Medicine with the id {id} is not available.")
                            
    for row in med_product_name_same_name:
        if row.med_product_name == request.med_product_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Medicine Name already exist.")
    medicine.update({
    'med_product_name' : request.med_product_name,
    'med_quantity' : request.med_quantity,
    'med_manufacturer' : request.med_manufacturer,
    'med_manufactured_date' : request.med_manufactured_date,
    'med_import_date' : request.med_import_date,
    'med_expiration_date' : request.med_expiration_date,
    'med_batch_number' : request.med_batch_number,
    'med_unit_price' : request.med_unit_price,
    'med_tax' : request.med_tax,
    'med_purpose' : request.med_purpose,
    'condition' : request.condition,
    'dosage': request.dosage,
    'updated_by' : request.updated_by,
    'updated_at' : datetime.now()})

    
    db.commit()
    return f"Medicine with the id {id} has been updated."
    
def delete(id, updated_by:str, db: Session):
    user = db.query(models.AR_Medicine).filter(models.AR_Medicine.id == id)
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available.")
    user.update({'status': 'Out of Stock',
                    'updated_at': datetime.now(),'updated_by': updated_by})
    db.commit()
    return f"Medicine with the id {id} has been deleted."

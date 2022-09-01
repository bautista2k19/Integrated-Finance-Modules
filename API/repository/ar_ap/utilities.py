from datetime import date, datetime
from uuid import uuid4

from fastapi.param_functions import Form
from API.routers.ar_ap import utilities
from API.schemas.ar_ap.utilities import CreateUtilities, DeleteUtilities, Utilities, UpdateUtilities, ApprovedUtilities
from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status, File, UploadFile
import shutil




def datatable(db: Session):
    utilities = db.query(models.AR_Utilities).all()
    return utilities

def datatableApproved(db: Session):
    utilities = db.query(models.AR_Utilities).filter(models.AR_Utilities.status == "Approved").all()
    return utilities

def find_all(db: Session):
    utilities = db.query(models.AR_Utilities).filter(models.AR_Utilities.status != "Inactive").all()
    return utilities


def find_one(id, db: Session):
    utilities = db.query(models.AR_Utilities).filter(
        models.AR_Utilities.id == id).first()
    if not utilities:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Utilities with the id {id} is not available.")
    return utilities


def create(db: Session,
           utility_type: str = Form(...),
           utility_name: str = Form(...),
           utility_bill: float = Form(...),
           due_date: date = Form(...), 
           payment_method: str = Form(...),
           notes: str = Form(...),
           created_by: str = Form(None)
           ):  
 
 

    new_utilities = models.AR_Utilities(
        utility_type=utility_type,
        utility_name=utility_name,
        utility_bill=utility_bill,
        due_date=due_date, 
        payment_method=payment_method,
        notes=notes,
        created_by=created_by,
        created_at=datetime.now(),
        id=str(uuid4())
    )
 
    db.add(new_utilities)
    db.commit()
    db.refresh(new_utilities)
    return new_utilities  # {"detail": "New employee has been created."}


def update(id, db: Session,
           utility_type: str = Form(...),
           utility_name: str = Form(...),
           utility_bill: float = Form(...),
           due_date: date = Form(...), 
           payment_method: str = Form(...),
           notes: str = Form(...), 
           updated_by: str = Form(None)
           ):

    

    utilities = db.query(models.AR_Utilities).filter(models.AR_Utilities.id == id)
  

    if not utilities.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Utilities with the id {id} is not available.")
 
    
    utilities.update({
            'utility_type': utility_type,
            'utility_name': utility_name,
            'utility_bill': utility_bill,
            'due_date': due_date, 
            'payment_method': payment_method,
            'notes': notes, 
            'updated_by': updated_by,
            'updated_at': datetime.now()})
    db.commit()
    return f"Utilities with the id {id} has been updated."


def delete(id, updated_by:str, db: Session):
    delete_utility = db.query(models.AR_Utilities).filter(models.AR_Utilities.id == id)
    if not delete_utility.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Utilities with the id {id} is not available.")
    delete_utility.update({'status': 'Inactive',
                    'updated_at': datetime.now(),'updated_by': updated_by})
    db.commit()
    return f"Utilities has been deactivated."


def approved(id, updated_by:str, db: Session):
    approved_utility = db.query(models.AR_Utilities).filter(models.AR_Utilities.id == id)
    if not approved_utility.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Utility with the id {id} is not available.")
    approved_utility.update({'status': 'Approved',
                    'updated_at': datetime.now(),'updated_by': updated_by})
    db.commit()
    return f"Utility has been approved."
 
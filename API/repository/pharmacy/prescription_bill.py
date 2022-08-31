from sqlalchemy.orm.session import Session
from API import models as API


def datatable(db: Session):
    prescription_bill = db.query(API.Prescription_bill).all()
    return prescription_bill

def find_all(db: Session):
    prescription_bill = db.query(API.Prescription_bill).filter(
        API.Prescription_bill.status != "Inactive").all()
    return prescription_bill

def find_one(id, db: Session):
    prescription_bill = db.query(API.Prescription_bill).filter(API.Prescription_bill.id == id).first()
    return prescription_bill
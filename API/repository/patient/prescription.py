from sqlalchemy.orm.session import Session
from API import models as API


def datatable(db: Session):
    prescription = db.query(API.Prescription).all()
    return prescription

def find_one(id, db: Session):
    prescription = db.query(API.Prescription).filter(API.Prescription.id == id).first()
    return prescription
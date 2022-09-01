from datetime import date, datetime, timedelta
from API.schemas.ar_ap.pharmacy_invoice import PharmacyInvoice, CreateInvoice
from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4




def datatable(db: Session):
    pharmacy_invoice= db.query(models.AR_PharmacyInvoice).all()
    #users = db.query(models.AR_User, models.AR_Employee).join(models.AR_User).join(models.AR_Employee)
    return pharmacy_invoice

def find_all(db: Session):
   pharmacy_invoice = db.query(models.AR_PharmacyInvoice).all()
    
   return pharmacy_invoice


def find_one(id, db:Session):
    pharmacy_invoice= db.query(models.AR_PharmacyInvoice).filter(models.AR_PharmacyInvoice.id == id).first()
    if not pharmacy_invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Inpatient with the id {id} is not available.")
    return pharmacy_invoice

def create(request: CreateInvoice , db: Session):

    pharmacy_invoice = db.query(models.AR_PharmacyInvoice).order_by(models.AR_PharmacyInvoice.created_at.desc()).first()
    
    if not pharmacy_invoice:
        counter = 1001
    else:
        invoice_no = pharmacy_invoice.invoice_no
        curent_invoice_no = invoice_no.split("-")
        counter = int(curent_invoice_no[1])
        counter = counter + 1

    new_invoice = models.AR_PharmacyInvoice(
    id = str(uuid4()),
    admission_id = request.admission_id,
    invoice_date=datetime.now(),
    invoice_no ="IN-" + str(counter),
    medical_amount = request.medical_amount,
    medicine_amount = request.medicine_amount,
    subtotal = request.subtotal,
    total_amount = request.total_amount,
    created_by=request.created_by,
    created_at=datetime.now()
   
    # medicine_amount = MedicinePR.quantity * MedicineInfo.med_unit_price,
    # medical_amount = MedicalSuppliesPR.quantity * MedicalSuppliesInfo.ms_unit_price,
    # total_amount = (MedicinePR.quantity * MedicineInfo.med_unit_price) + (MedicalSuppliesPR.quantity * MedicalSuppliesInfo.ms_unit_price)
    # total_amount= PharmacyInvoice.prescription_id[MedicinePR.quantity]

   
    )
    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    

     #ADD INVOICE RECORD TO SALES RECORD
    # new_sales_invoice= models.AR_Sales(
    # invoice_id =pharmacy_invoice.id, 
    # created_by= request.created_by,
    #  created_at= datetime.now(),
    # id = str(uuid4())
    #     )

    # db.add(new_sales_invoice)
    # db.commit() 
    # db.refresh(new_sales_invoice)

    return  new_invoice

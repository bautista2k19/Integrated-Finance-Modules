from ntpath import join
import re
from fastapi.encoders import jsonable_encoder
from API.schemas.ar_ap.room_bill import CreateRoomBill, UpdateRoomBill
from datetime import datetime

from sqlalchemy.orm.session import Session
from API import models
from fastapi import HTTPException, status
from uuid import uuid4
import random
from sqlalchemy import or_
from sqlalchemy import false, null, or_, and_



def datatable(db: Session):
    room_bill = db.query(models.AR_RoomBill).all()
    return room_bill

def find_all(db: Session):
    room_bill = db.query(models.AR_RoomBill).filter(or_(models.AR_RoomBill.status != "Inactive",models.AR_RoomBill.status != "INACTIVE" )).all() 
    return room_bill

def find_all_for_billing(id, db: Session):
    #----------------------------------------------ROOM BILL
    room_bill= db.query(models.AR_Room).\
        select_from(models.AR_Room).join(models.AR_Room_type)\
        .join(models.AR_Inpatient)\
        .join(models.AR_DischargeManagement)\
        .filter(and_(models.AR_Room.admission_id == id,
                    models.AR_Inpatient.patient_status == "Discharge")).\
                    order_by(models.AR_Room.date_admitted).all()

    find_discharge_date= db.query(models.AR_DischargeManagement).\
        select_from(models.AR_Inpatient)\
        .join(models.AR_DischargeManagement)\
        .filter(and_(models.AR_Inpatient.admission_id == id,
                    models.AR_DischargeManagement.admission_id == id)).first() 

    
    discharge_date = find_discharge_date.discharge_date  
    dischargeStr = str(discharge_date)
    item_arr = []
    item_arr_datetime = []
    date_days =[]

    for i in range(len(room_bill)):
        date_admitted = room_bill[i].date_admitted
        dateTimeStr = str(date_admitted)
        item_arr.append(dateTimeStr)
        item_arr_datetime.append(room_bill[i].date_admitted)
        print(dateTimeStr)
        datetimeFormat = '%Y-%m-%d %H:%M:%S'

    last_index_of_room_bill= (len(room_bill)-1)
    last_room_rate= room_bill[last_index_of_room_bill].room_type_info.amount
    last_index = (len(item_arr)-1)
    room_bill_last_index_not_included =0
    room_bill_last_index_only =0
    for i in range(len(item_arr)-1):
        v= datetime.strptime(item_arr[i+1], datetimeFormat) - datetime.strptime(item_arr[i], datetimeFormat)
        room_bill_last_index_not_included += v.days * room_bill[i].room_type_info.amount
        print(v)
        date_days.append(v.days)
        
    date_last_index = item_arr[last_index]
    days_to_discharge = (datetime.strptime(dischargeStr, datetimeFormat)  - datetime.strptime(date_last_index, datetimeFormat))
    room_bill_last_index_only += days_to_discharge.days * last_room_rate +room_bill_last_index_not_included
    print(days_to_discharge)  
    date_days.append(days_to_discharge.days)

    
    return date_days, room_bill
  


def find_one(id, db: Session):
    room_bill = db.query(models.AR_RoomBill).filter(models.AR_RoomBill.id == id).first()
    if not room_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Room Bill is not available.")
    return room_bill

def find_by_invoice_no(invoice_no, db: Session):
    room_bill = db.query(models.AR_RoomBill).filter(models.AR_RoomBill.invoice_no == invoice_no).first()
    if not room_bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Room Bill is not available.")
  
    return room_bill

    
def create(request: CreateRoomBill, db: Session):
 
    tmp_room= db.query(models.AR_Inpatient,models.AR_Room,models.AR_Room_type).\
        select_from(models.AR_Inpatient).\
        join(models.AR_Room).\
        join(models.AR_Room_type).\
        filter(models.AR_Inpatient.admission_id == request.inpatient_id).\
        first()
     
    tmp_rm_transfer= db.query(models.AR_Inpatient,models.AR_RoomTransfer,models.AR_Room, models.AR_Room_type).\
        select_from(models.AR_Inpatient).\
        join(models.AR_RoomTransfer).\
        join(models.AR_Room).\
        join(models.AR_Room_type).\
        filter(models.AR_Inpatient.admission_id == request.inpatient_id).first()
    # print(tmp_room.Room_type.amount)
    total_amount = tmp_room.Room_type.amount + tmp_rm_transfer.Room_type.amount
    # print(f"tmp: {tmp} total_amount:{total_amount}")
    
    d = datetime.now()
    curr_date = d.strftime("%Y%m%d")
    new_uuid = str(uuid4())
    last_5_uuid = str(new_uuid[-5:])
    new_room_bill = models.AR_RoomBill(**request.dict(),
        id=str(uuid4()),
        invoice_no="RMBLL"+ last_5_uuid + curr_date,
        total_amount=total_amount
        )
        
    if db.query(models.AR_RoomBill).filter_by(inpatient_id= request.inpatient_id).count() == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Room Bill invoice already exists.")
                            
    db.add(new_room_bill)
    db.commit()
    db.refresh(new_room_bill)
    return "Room Bill invoice has been created."
 

def update(id, request: UpdateRoomBill, db: Session):
    room_bill = db.query(models.AR_RoomBill).filter(models.AR_RoomBill.id == id)
    invoice_no_same_name = db.query(models.AR_RoomBill).filter(models.AR_RoomBill.id != id)

    for row in invoice_no_same_name:
        if row.invoice_no == request.invoice_no:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Room Bill already exists.")

    if not room_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room Bill is not available.")

    
    room_bill_json = jsonable_encoder(request)     
    room_bill.update(room_bill_json)
                            
    db.commit()
    return f"Room Bill has been updated."


def completed(id, updated_by:str, db: Session):
    room_bill = db.query(models.AR_RoomBill).filter(models.AR_RoomBill.id == id)
    if not room_bill.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Room Bill is not available.")
    room_bill.update({
                    'status': 'Completed',
                    'updated_at': datetime.now(),
                    'updated_by': updated_by})
    db.commit()
    return f"Room Bill has been completed."

#Module
from operator import or_
from fastapi import HTTPException
from sqlalchemy import and_, or_, not_
from uuid import uuid4
#from datetime import datetime

#homies
from API import database as db, models



""" GET TABLE DATA """

def get_table_data(request: dict):
    with db.session() as session:
        session.begin()
        try:
            #Search value
            search_value = request['search']['value']

            #Get total no. of records
            sql = f""" SELECT COUNT(id) FROM data_sources """
            if search_value:
                sql += f""" WHERE name LIKE '%{search_value}%' 
                  OR endpoint LIKE '%{search_value}%' """
            records_total = (session.execute(sql)).scalar()
            records_total = records_total if records_total else 0

            #Base statement
            sql = f""" SELECT * FROM data_sources """

            #Search statement
            if search_value:
                sql += f""" WHERE name LIKE '%{search_value}%' 
                  OR endpoint LIKE '%{search_value}%' """

            #Order statement
            index = request['order'][0]['column']
            if index != 0:
                sql += f""" ORDER BY 
                   {request['columns'][index]['name']} {request['order'][0]['dir']},
                   created_at DESC """
            else:
                sql += """ ORDER BY name ASC """

            #Pagination statement
            if request['length'] != -1:
                sql += f""" LIMIT {request['start']}, {request['length']} """
            
            #Result set
            result_set = (session.execute(sql)).all()
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return {
        'draw': request['draw'],
        'recordsTotal': records_total,
        'recordsFiltered': records_total,
        'data': result_set
    }



""" CREATE """

def create(data: dict, user: str):
    with db.session() as session:
        session.begin()
        try:
            sql = """ 
              INSERT INTO data_sources(
                id,
                name,
                endpoint,
                description,
                created_by
              ) VALUES(
                :id,
                :name,
                :endpoint,
                :description,
                :created_by) """
            data['id'] = uuid4()
            data['name'] = data['name'].title()
            data['created_by'] = user
            session.execute(sql, data)
        except:
            session.rollback()
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        else:
            session.commit()
        finally:
            session.close()
    return {
        'detail': 'Successfully Created.',
        'type': 'success'
    }



""" VALIDATE INPUT """

def validate_input(id: str, column: str, value: str, closest: str):
    with db.session() as session:
        session.begin()
        try:
            sql = f""" 
                SELECT 1 FROM data_sources
                  WHERE {column} = :value
                    AND id != :id """
            result = session.execute(sql, {
                'value': value,
                'id': id
            }).first()
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return {
        'has_error': (True if result else False),
        'detail': ((column.capitalize() + ' already exists.') if result else None),
        'element': (column if result else None),
        'closest': (closest if result else None)
    }



""" GET ONE """

def get_one(id: str):
    try:
        session = db.session()
        session.begin()
        data_source = session.query(models.DataSource).filter(models.DataSource.id == id).first()
    except:
        session.close()
        raise HTTPException(status_code=500, detail='Internal Server Error.')
    if not data_source:
        session.close()
        raise HTTPException(status_code=404, detail='Record does`nt exist.')
    return data_source



""" GET ALL """

def get_all():
    with db.session() as session:
        session.begin()
        try:
            sql = """ SELECT endpoint AS id,
              name AS text
              FROM data_sources
              WHERE status = 'Active'
              ORDER BY text ASC """
            data_sources = []
            for idx, source in enumerate(session.execute(sql).all()):
                if len(get_data(source['id'][(source['id'].rfind('/'))+1:], session)) > 0:
                    data_sources.append(source)
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return data_sources


    
            
       
            
            
        
    



""" UPDATE """

def update(id: str, data: dict, user: str):
    with db.session() as session:
        session.begin()
        try:
            sql = """ UPDATE data_sources
              SET name = :name,
                endpoint = :endpoint,
                description = :description,
                updated_by = :updated_by 
              WHERE id = :id """
            data['id'] = id
            data['name'] = data['name'].title()
            data['updated_by'] = user
            success = session.execute(sql, data).rowcount
        except:
            session.rollback()
            session.close()
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        if not success:
            session.rollback()
            session.close()
            raise HTTPException(status_code=404, detail='Record does`nt exist.')
        else:
            session.commit()
    return {
        'detail': 'Successfully Updated.',
        'type': 'success'
    }
    
    
    
""" DEACTIVATE / ACTIVATE """

def de_activate(id: str, status: str, user: str):
    with db.session() as session:
        session.begin()
        try:
            sql = """ UPDATE data_sources
              SET status = :status,
                updated_by = :updated_by
              WHERE id = :id """
            success = session.execute(sql, {
                'status': status,
                'updated_by': user,
                'id': id
            }).rowcount
        except:
            session.rollback()
            session.close()
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        if not success:
            session.rollback()
            session.close()
            raise HTTPException(status_code=404, detail='Record does`nt exist.')
        else:
            session.commit()
    return {
        'detail': 'Successfully ' + (' Deactivated.' if status == 'Inactive' else ' Activated.'),
        'type': ('info' if status == 'Inactive' else 'success')
    }



""" GET TRANSACTION TABLE """
from sqlalchemy import func

class CustomException(Exception):
    """Custom Exception"""

def get_data(table_name, session):
    if  table_name == 'Prescription_bill':
        return session.query(models.Prescription_bill).filter(
            or_(
                and_(
                    func.lower(models.Prescription_bill.status2) == 'not journalized',
                    func.lower(models.Prescription_bill.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Prescription_bill.status) == "incomplete",
                        func.lower(models.Prescription_bill.status) == "incompleted",
                        func.lower(models.Prescription_bill.status) == "not complete",
                        func.lower(models.Prescription_bill.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Prescription_bill.id == models.JournalEntry.data_source,
                                models.Prescription_bill.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Inpatient_prescription_payment':
        return session.query(models.Inpatient_prescription_payment).filter(
            or_(
                and_(
                    func.lower(models.Inpatient_prescription_payment.status2) == 'not journalized',
                    func.lower(models.Inpatient_prescription_payment.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Inpatient_prescription_payment.status) == "incomplete",
                        func.lower(models.Inpatient_prescription_payment.status) == "incompleted",
                        func.lower(models.Inpatient_prescription_payment.status) == "not complete",
                        func.lower(models.Inpatient_prescription_payment.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Inpatient_prescription_payment.id == models.JournalEntry.data_source,
                                models.Inpatient_prescription_payment.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Lab_request_bill':
        return session.query(models.Lab_request_bill).filter(
            or_(
                and_(
                    func.lower(models.Lab_request_bill.status2) == 'not journalized',
                    func.lower(models.Lab_request_bill.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Lab_request_bill.status) == "incomplete",
                        func.lower(models.Lab_request_bill.status) == "incompleted",
                        func.lower(models.Lab_request_bill.status) == "not complete",
                        func.lower(models.Lab_request_bill.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Lab_request_bill.id == models.JournalEntry.data_source,
                                models.Lab_request_bill.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Inpatient_lab_request_payment':
        return session.query(models.Inpatient_lab_request_payment).filter(
            or_(
                and_(
                    func.lower(models.Inpatient_lab_request_payment.status2) == 'not journalized',
                    func.lower(models.Inpatient_lab_request_payment.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Inpatient_lab_request_payment.status) == "incomplete",
                        func.lower(models.Inpatient_lab_request_payment.status) == "incompleted",
                        func.lower(models.Inpatient_lab_request_payment.status) == "not complete",
                        func.lower(models.Inpatient_lab_request_payment.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Inpatient_lab_request_payment.id == models.JournalEntry.data_source,
                                models.Inpatient_lab_request_payment.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Outpatient_lab_request_payment':
        return session.query(models.Outpatient_lab_request_payment).filter(
            or_(
                and_(
                    func.lower(models.Outpatient_lab_request_payment.status2) == 'not journalized',
                    func.lower(models.Outpatient_lab_request_payment.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Outpatient_lab_request_payment.status) == "incomplete",
                        func.lower(models.Outpatient_lab_request_payment.status) == "incompleted",
                        func.lower(models.Outpatient_lab_request_payment.status) == "not complete",
                        func.lower(models.Outpatient_lab_request_payment.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Outpatient_lab_request_payment.id == models.JournalEntry.data_source,
                                models.Outpatient_lab_request_payment.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Treatment_bill':
        return session.query(models.Treatment_bill).filter(
            or_(
                and_(
                    func.lower(models.Treatment_bill.status2) == 'not journalized',
                    func.lower(models.Treatment_bill.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Treatment_bill.status) == "incomplete",
                        func.lower(models.Treatment_bill.status) == "incompleted",
                        func.lower(models.Treatment_bill.status) == "not complete",
                        func.lower(models.Treatment_bill.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Treatment_bill.id == models.JournalEntry.data_source,
                                models.Treatment_bill.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Inpatient_treatment_payment':
        return session.query(models.Inpatient_treatment_payment).filter(
            or_(
                and_(
                    func.lower(models.Inpatient_treatment_payment.status2) == 'not journalized',
                    func.lower(models.Inpatient_treatment_payment.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Inpatient_treatment_payment.status) == "incomplete",
                        func.lower(models.Inpatient_treatment_payment.status) == "incompleted",
                        func.lower(models.Inpatient_treatment_payment.status) == "not complete",
                        func.lower(models.Inpatient_treatment_payment.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Inpatient_treatment_payment.id == models.JournalEntry.data_source,
                                models.Inpatient_treatment_payment.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Outpatient_treatment_payment':
        return session.query(models.Outpatient_treatment_payment).filter(
            or_(
                and_(
                    func.lower(models.Outpatient_treatment_payment.status2) == 'not journalized',
                    func.lower(models.Outpatient_treatment_payment.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Outpatient_treatment_payment.status) == "incomplete",
                        func.lower(models.Outpatient_treatment_payment.status) == "incompleted",
                        func.lower(models.Outpatient_treatment_payment.status) == "not complete",
                        func.lower(models.Outpatient_treatment_payment.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Outpatient_treatment_payment.id == models.JournalEntry.data_source,
                                models.Outpatient_treatment_payment.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Surgery_bill':
        return session.query(models.Surgery_bill).filter(
            or_(
                and_(
                    func.lower(models.Surgery_bill.status2) == 'not journalized',
                    func.lower(models.Surgery_bill.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Surgery_bill.status) == "incomplete",
                        func.lower(models.Surgery_bill.status) == "incompleted",
                        func.lower(models.Surgery_bill.status) == "not complete",
                        func.lower(models.Surgery_bill.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Surgery_bill.id == models.JournalEntry.data_source,
                                models.Surgery_bill.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Inpatient_surgery_payment':
        return session.query(models.Inpatient_surgery_payment).filter(
            or_(
                and_(
                    func.lower(models.Inpatient_surgery_payment.status2) == 'not journalized',
                    func.lower(models.Inpatient_surgery_payment.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Inpatient_surgery_payment.status) == "incomplete",
                        func.lower(models.Inpatient_surgery_payment.status) == "incompleted",
                        func.lower(models.Inpatient_surgery_payment.status) == "not complete",
                        func.lower(models.Inpatient_surgery_payment.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Inpatient_surgery_payment.id == models.JournalEntry.data_source,
                                models.Inpatient_surgery_payment.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Room_bill':
        return session.query(models.Room_bill).filter(
            or_(
                and_(
                    func.lower(models.Room_bill.status2) == 'not journalized',
                    func.lower(models.Room_bill.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Room_bill.status) == "incomplete",
                        func.lower(models.Room_bill.status) == "incompleted",
                        func.lower(models.Room_bill.status) == "not complete",
                        func.lower(models.Room_bill.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Room_bill.id == models.JournalEntry.data_source,
                                models.Room_bill.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Inpatient_room_payment':
        return session.query(models.Inpatient_room_payment).filter(
            or_(
                and_(
                    func.lower(models.Inpatient_room_payment.status2) == 'not journalized',
                    func.lower(models.Inpatient_room_payment.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Inpatient_room_payment.status) == "incomplete",
                        func.lower(models.Inpatient_room_payment.status) == "incompleted",
                        func.lower(models.Inpatient_room_payment.status) == "not complete",
                        func.lower(models.Inpatient_room_payment.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Inpatient_room_payment.id == models.JournalEntry.data_source,
                                models.Inpatient_room_payment.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Purchase_order_vendor_bill':
        return session.query(models.Purchase_order_vendor_bill).filter(
            or_(
                and_(
                    func.lower(models.Purchase_order_vendor_bill.status2) == 'not journalized',
                    func.lower(models.Purchase_order_vendor_bill.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Purchase_order_vendor_bill.status) == "incomplete",
                        func.lower(models.Purchase_order_vendor_bill.status) == "incompleted",
                        func.lower(models.Purchase_order_vendor_bill.status) == "not complete",
                        func.lower(models.Purchase_order_vendor_bill.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Purchase_order_vendor_bill.id == models.JournalEntry.data_source,
                                models.Purchase_order_vendor_bill.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Purchase_order_vendor_payment':
        return session.query(models.Purchase_order_vendor_payment).filter(
            or_(
                and_(
                    func.lower(models.Purchase_order_vendor_payment.status2) == 'not journalized',
                    func.lower(models.Purchase_order_vendor_payment.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Purchase_order_vendor_payment.status) == "incomplete",
                        func.lower(models.Purchase_order_vendor_payment.status) == "incompleted",
                        func.lower(models.Purchase_order_vendor_payment.status) == "not complete",
                        func.lower(models.Purchase_order_vendor_payment.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Purchase_order_vendor_payment.id == models.JournalEntry.data_source,
                                models.Purchase_order_vendor_payment.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Purchase_order_bill':
        return session.query(models.Purchase_order_bill).filter(
            or_(
                and_(
                    func.lower(models.Purchase_order_bill.status2) == 'not journalized',
                    func.lower(models.Purchase_order_bill.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Purchase_order_bill.status) == "incomplete",
                        func.lower(models.Purchase_order_bill.status) == "incompleted",
                        func.lower(models.Purchase_order_bill.status) == "not complete",
                        func.lower(models.Purchase_order_bill.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Purchase_order_bill.id == models.JournalEntry.data_source,
                                models.Purchase_order_bill.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Purchase_order_payment':
        return session.query(models.Purchase_order_payment).filter(
            or_(
                and_(
                    func.lower(models.Purchase_order_payment.status2) == 'not journalized',
                    func.lower(models.Purchase_order_payment.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.Purchase_order_payment.status) == "incomplete",
                        func.lower(models.Purchase_order_payment.status) == "incompleted",
                        func.lower(models.Purchase_order_payment.status) == "not complete",
                        func.lower(models.Purchase_order_payment.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.Purchase_order_payment.id == models.JournalEntry.data_source,
                                models.Purchase_order_payment.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'AR_Utilities':
        return session.query(models.AR_Utilities).filter(
            or_(
                and_(
                    func.lower(models.AR_Utilities.status2) == 'not journalized',
                    func.lower(models.AR_Utilities.status) != "inactive",
                ),
                and_(
                    or_(
                        func.lower(models.AR_Utilities.status) == "incomplete",
                        func.lower(models.AR_Utilities.status) == "incompleted",
                        func.lower(models.AR_Utilities.status) == "not complete",
                        func.lower(models.AR_Utilities.status) == "not completed"
                    ),
                    or_(
                        session.query(models.JournalEntry).first() is None,
                        not_(
                            and_(
                                models.AR_Utilities.id == models.JournalEntry.data_source,
                                models.AR_Utilities.updated_at == models.JournalEntry.data_source_date,
                                models.JournalEntry.status == 'Deleted'
                            )
                        )
                    )
                )
            )
        ).all()
    elif  table_name == 'Deposit':
        return session.query(models.Deposit).filter(
            and_(
                func.lower(models.Deposit.status2) == 'not journalized',
                func.lower(models.Deposit.status) != "inactive",
            ),
        ).all()
    elif  table_name == 'Withdrawal':
        return session.query(models.Withdrawal).filter(
            and_(
                func.lower(models.Withdrawal.status2) == 'not journalized',
                func.lower(models.Withdrawal.status) != "inactive",
            ),
        ).all()
    elif  table_name == 'Sales':
        return session.query(models.Sales).filter(
            and_(
                func.lower(models.Sales.status2) == 'not journalized',
                func.lower(models.Sales.status) != "inactive",
            ),
        ).all()
    
def get_transaction_table_data(table_name: str, db1):
    try:
        session = db.session()
        session.begin()
       
        data = get_data(table_name, session)
        if not data:
            raise CustomException
    except CustomException: 
        session.close()
        raise HTTPException(status_code=404, detail=f"""No transactions available for { table_name.replace('_',' ').lower() } .""")
    except:
        session.close()
        raise HTTPException(status_code=500, detail='Internal Server Error.')
    return data


       
       
   

        
    
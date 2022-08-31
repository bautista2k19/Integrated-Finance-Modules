# module
from fastapi import HTTPException
from uuid import uuid4
from datetime import datetime

# homies
from API import database as db
# general_ledger
from API.models import AccountType





""" GET TABLE DATA """

def get_table_data(request: dict):
    with db.session() as session:
        session.begin()
        try:
            #Get total no. of records
            sql = """
                SELECT COUNT(id) 
                  FROM account_types
                  WHERE status = 'Active'"""
            if request['search']['value']:
                sql += f""" AND (name LIKE '%{request['search']['value']}%'"""
                sql += f""" OR code LIKE '%{request['search']['value']}%')"""
            records_total = (session.execute(sql)).scalar()
            records_total = records_total if records_total else 0
            #Base statement
            sql = """
                SELECT * 
                  FROM account_types
                  WHERE status = 'Active'"""
            #Searching statement
            if request['search']['value']:
                sql += f""" AND (name LIKE '%{request['search']['value']}%'"""
                sql += f""" OR code LIKE '%{request['search']['value']}%')"""
            #Ordering statement
            if request['order']:
                index = request['order'][0]['column']
                sql += f""" ORDER BY {request['columns'][index]['name']} {request['order'][0]['dir']}"""
            else: 
                sql += ' ORDER BY name ASC'
            #Paging statement
            if request['length'] != -1:
                sql += f""" LIMIT {request['start']}, {request['length']}"""
            #Resultset
            resultset = (session.execute(sql)).all()
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return { 
        'draw': request['draw'],
        'recordsTotal': records_total,
        'recordsFiltered': records_total,
        'data': resultset
    } 





""" CREATE """

def create(data: dict, user: str):
    with db.session() as session:
        session.begin()
        try:
            data['id'] = uuid4()
            data['name'] = data['name'].title()
            data['created_by'] = user
            sql = """
                INSERT INTO account_types(
                  id,
                  name,
                  code,
                  description,
                  created_by
                ) VALUES(
                  :id,
                  :name,
                  :code,
                  :description,
                  :created_by)"""
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





""" GET AVAILABLE CODES """

def get_available_codes():
    with db.session() as session:
        session.begin()
        try:
            available_codes = ['1000','2000','3000','4000','5000','6000','7000','8000','9000']
            sql = """
                SELECT code 
                  FROM account_types
                  WHERE status = 'Active'
                  ORDER BY code ASC"""
            saved_codes = [code[0] for code in (session.execute(sql).all())]
            for code in available_codes.copy():
                if code in saved_codes:
                    available_codes.remove(code)
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return available_codes




    
""" VALIDATE INPUT """

def validate_input(id: str, column: str, value: str, closest: str):
    with db.session() as session:
        session.begin()
        try:
            sql = f"""
                SELECT {column} 
                  FROM account_types 
                  WHERE status = 'Active'
                    AND id != :id
                    AND {column} = :value"""
            result = session.execute(sql, {
                'id': id,
                'value': value
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
        account_type = session.query(AccountType).filter(AccountType.id == id).first()
    except:
        session.close()
        raise HTTPException(status_code=500, detail='Internal Server Error.')
    if not account_type:
        session.close()
        raise HTTPException(status_code=404, detail='Record does`nt exist.')
    return account_type
        




""" GET ALL """

def get_all():
    with db.session() as session:
        session.begin()
        try:
            sql = """
                SELECT id,
                  name AS text,
                  code
                  FROM account_types
                  WHERE status = 'Active'
                  ORDER BY code ASC"""
            account_types = session.execute(sql).all()
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return account_types





""" UPDATE """

def update(id: str, account_type: dict, user: str):
    with db.session() as session:
        session.begin()
        try:
            account_type['name'] = account_type['name'].title()
            #Create account_types
            sql = """
                INSERT INTO account_types(
                    id,
                    name,
                    code,
                    description,
                    replaced_record,
                    created_by,
                    created_at,
                    updated_by,
                    updated_at
                ) VALUES(
                    :id,
                    :name,
                    :code,
                    :description,
                    :replaced_record,
                    :created_by,
                    :created_at,
                    :updated_by,
                    :updated_at)""" 
            session.execute(sql, {
                'id': uuid4(),
                **account_type,
                'replaced_record': id,
                'updated_by': user,
                'updated_at': datetime.now()
            })
            #Update account_types
            sql = """
                UPDATE account_types
                  SET status = 'Overwritten',
                    updated_by = :updated_by
                  WHERE id = :id"""
            success = session.execute(sql, { 
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
        'detail': 'Successfully Updated.',
        'type': 'success'
    }
    




""" DELETE """

def delete(id: str, operation_type: int, user: str):
    with db.session() as session:
        session.begin()
        try:
            sql = """
                UPDATE account_types 
                  SET status = 'Deleted',
                    updated_by = :updated_by
                  WHERE id = :id"""
            success = session.execute(sql, {
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
        'detail': 'Successfully Deleted.',
        'type': 'info'
    }
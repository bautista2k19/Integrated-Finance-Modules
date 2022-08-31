# module
from fastapi import HTTPException
from uuid import uuid4
from datetime import datetime

# homies
from API import database as db
# general_ledger
from API.models import ChartAccount





""" GET TABLE DATA """

def get_table_data(request: dict):
    with db.session() as session:
        session.begin()
        try:
            #Get total no. of records
            sql = """
                SELECT COUNT(CA.id) 
                  FROM chart_accounts AS CA
                  INNER JOIN account_types AS AT
                    ON CA.account_type = AT.id
                  WHERE CA.status = 'Active'"""
            if request['search']['value']:
                sql += f""" AND (CA.account_number LIKE '%{request['search']['value']}%'"""
                sql += f""" OR CA.account_title LIKE '%{request['search']['value']}%'"""
                sql += f""" OR AT.name LIKE '%{request['search']['value']}%')"""
            records_total = (session.execute(sql)).scalar()
            records_total = records_total if records_total else 0
            #Base statement
            sql = """
                SELECT CA.account_number,
                  CA.account_title,
                  AT.name AS account_type,
                  CA.description,
                  CA.status,
                  CA.id
                  FROM chart_accounts AS CA
                  INNER JOIN account_types AS AT
                    ON CA.account_type = AT.id
                  WHERE CA.status = 'Active'"""
            #Searching statement
            if request['search']['value']:
                sql += f""" AND (CA.account_number LIKE '%{request['search']['value']}%'"""
                sql += f""" OR CA.account_title LIKE '%{request['search']['value']}%'"""
                sql += f""" OR account_type LIKE '%{request['search']['value']}%')"""
            #Ordering statement
            if request['order']:
                index = request['order'][0]['column']
                sql += f""" ORDER BY {request['columns'][index]['name']} {request['order'][0]['dir']}"""
            else: 
                sql += ' ORDER BY CA.account_number ASC'
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
            data['account_title'] = data['account_title'].title()
            data['created_by'] = user
            sql = """
                INSERT INTO chart_accounts(
                  id,
                  account_title,
                  account_type,
                  account_number,
                  description,
                  created_by
                ) VALUES(
                  :id,
                  :account_title,
                  :account_type,
                  :account_number,
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





""" VALIDATE INPUT """

def validate_input(id: str, column: str, value: str, closest: str):
    with db.session() as session:
        session.begin()
        try:
            sql = f"""
                SELECT {column} 
                  FROM chart_accounts 
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
        chart_account = session.query(ChartAccount).filter(ChartAccount.id == id).first()
    except:
        session.close()
        raise HTTPException(status_code=500, detail='Internal Server Error.')
    if not chart_account:
        session.close()
        raise HTTPException(status_code=404, detail='Record does`nt exist.')
    return chart_account
        




""" GET ALL """

def get_all():
    with db.session() as session:
        session.begin()
        try:
            sql = """
                SELECT CONCAT(id, '&', CAST(account_number AS CHAR)) AS id,
                  account_title AS text
                  FROM chart_accounts
                  WHERE status = 'Active'
                  ORDER BY account_number ASC"""
            chart_accounts = session.execute(sql).all()
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return chart_accounts





""" UPDATE """

def update(id: str, chart_account: dict, user: str):
    with db.session() as session:
        session.begin()
        try:
            chart_account['account_title'] = chart_account['account_title'].title()
            sql = """
                INSERT INTO chart_accounts(
                    id,
                    account_title,
                    account_type,
                    account_number,
                    description,
                    replaced_record,
                    created_by,
                    created_at,
                    updated_by,
                    updated_at
                ) VALUES(
                    :id,
                    :account_title,
                    :account_type,
                    :account_number,
                    :description,
                    :replaced_record,
                    :created_by,
                    :created_at,
                    :updated_by,
                    :updated_at)"""
            session.execute(sql, {
                'id': uuid4(),
                **chart_account,
                'replaced_record': id,
                'updated_by': user,
                'updated_at': datetime.now()
            })
            #Update chart_accounts
            sql = """
                UPDATE chart_accounts
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
                UPDATE chart_accounts 
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
   



""" GET ALL total_accounts """

def get_all_total_accounts():
    with db.session() as session:
        session.begin()
        try:
            total_accounts = {}
            #total_assets
            sql = """
                SELECT COUNT(CA.id)
                  FROM chart_accounts AS CA
                   INNER JOIN account_types AS AT
                     ON CA.account_type = AT.id 
                  WHERE CA.status = 'Active'
                    AND AT.name = 'Asset'"""
            total_accounts['total_assets'] = (session.execute(sql)).scalar()
            #total_contra_assets
            sql = """
                SELECT COUNT(CA.id)
                  FROM chart_accounts AS CA
                   INNER JOIN account_types AS AT
                     ON CA.account_type = AT.id 
                  WHERE CA.status = 'Active' 
                    AND AT.name = 'Contra Asset'"""
            total_accounts['total_contra_assets'] = (session.execute(sql)).scalar()
            #total_revenues
            sql = """
                SELECT COUNT(CA.id)
                  FROM chart_accounts AS CA
                   INNER JOIN account_types AS AT
                     ON CA.account_type = AT.id 
                  WHERE CA.status = 'Active'
                    AND AT.name = 'Revenue'"""
            total_accounts['total_revenues'] = (session.execute(sql)).scalar()
            #total_equities
            sql = """
                SELECT COUNT(CA.id)
                  FROM chart_accounts AS CA
                   INNER JOIN account_types AS AT
                     ON CA.account_type = AT.id 
                  WHERE CA.status = 'Active'
                    AND AT.name = 'Equity'"""
            total_accounts['total_equities'] = (session.execute(sql)).scalar()
            #total_liabilities
            sql = """
                SELECT COUNT(CA.id)
                  FROM chart_accounts AS CA
                   INNER JOIN account_types AS AT
                     ON CA.account_type = AT.id 
                  WHERE CA.status = 'Active' 
                    AND AT.name = 'Liability'"""
            total_accounts['total_liabilities'] = (session.execute(sql)).scalar()
            #total_expenses
            sql = """
                SELECT COUNT(CA.id)
                  FROM chart_accounts AS CA
                   INNER JOIN account_types AS AT
                     ON CA.account_type = AT.id 
                  WHERE CA.status = 'Active' 
                    AND AT.name = 'Expense'"""
            total_accounts['total_expenses'] = (session.execute(sql)).scalar()
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return total_accounts





""" GET LAST ACCOUNT NO. """

def get_last_account_no(code: str):
    with db.session() as session:
        session.begin()
        try:
            min = int(code)
            max = int(code) + 1000
            sql = f"""
                SELECT account_number
                  FROM chart_accounts
                  WHERE account_number > {min}
                    AND account_number < {max}
                    AND status = 'Active'
                  ORDER BY account_number DESC
                  LIMIT 1"""
            result = (session.execute(sql)).scalar()
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return {
        'account_number': ( (int(result)+1) if result else (min+1) ),
    }
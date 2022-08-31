#Module
from fastapi import HTTPException
from uuid import uuid4
#from datetime import datetime

#homies
from API import database as db
from API.models import DataSource



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
        data_source = session.query(DataSource).filter(DataSource.id == id).first()
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
            data_sources = session.execute(sql).all()
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
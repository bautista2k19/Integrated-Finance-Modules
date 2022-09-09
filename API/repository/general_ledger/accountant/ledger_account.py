# module
from fastapi import HTTPException
from datetime import datetime

# homies
from API import database as db 





""" GET TABLE DATA """

def get_table_data(data: dict):
    with db.session() as session:
        session.begin()
        try:
            # Determine records total
            sql = f"""
                SELECT COUNT(DISTINCT CA.account_title) 
                  FROM journal_entries AS JE
                  INNER JOIN journal_accounts AS JA
                    ON JE.id = JA.journal_entry
                  INNER JOIN chart_accounts AS CA
                    ON JA.account_title = CA.id
                  WHERE JE.status = 'Posted'
                    AND JE.date LIKE '%{data['period']}%'"""
            if data['search']['value']:
                sql += f""" AND (CA.account_title LIKE '%{data['search']['value']}%'
                    OR CA.account_number LIKE '%{data['search']['value']}%')"""
           

            records_total = (session.execute(sql)).scalar()
            records_total = records_total if records_total else 0
            # MySQL statement
            sql = f"""
                SELECT CA.account_title,
                  CA.account_number,
                  JE.status,
                  JE.date,
                  JE.explanation,
                  JA.debit,
                  JA.credit,
                  JE.id AS entry,
                  JE.entry_type
                  FROM journal_entries AS JE
                  INNER JOIN journal_accounts AS JA
                    ON JE.id = JA.journal_entry
                  INNER JOIN chart_accounts AS CA
                    ON JA.account_title = CA.id
                  WHERE JE.status = 'Posted'
                    AND JE.date LIKE '%{data['period']}%'"""
            # For searching
            if data['search']['value']:
                sql += f""" AND (CA.account_title LIKE '%{data['search']['value']}%'
                    OR CA.account_number LIKE '%{data['search']['value']}%')"""
            # For grouping
            #sql += f""" GROUP BY CA.account_number"""
            # For ordering
            if data['order']:
                index = data['order'][0]['column']
                sql += f""" ORDER BY {data['columns'][index]['name']} {data['order'][0]['dir']}, JE.date ASC, JA.debit DESC, JA.credit DESC"""
            else: 
                sql += ' ORDER BY CA.account_number ASC, JE.date ASC, JA.debit DESC, JA.credit DESC'
            # For pagination
            if data['length'] != -1:
                sql += f""" LIMIT {data['start']}, {data['length']}"""
            # Resultset
            resultset = (session.execute(sql)).all()
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return { 
        'draw': data['draw'],
        'recordsTotal': records_total,
        'recordsFiltered': records_total,
        'data': resultset
    } 





""" POST """

def post(id: str, user: str):
    with db.session() as session:
        session.begin()
        try:
            sql = """
                UPDATE journal_entries 
                  SET status = 'Posted',
                    posted_by = :posted_by,
                    posted_at = :posted_at
                  WHERE id = :id"""
            success = session.execute(sql, {
                'posted_by': user,
                'posted_at': datetime.now(),
                'id': id
            }).rowcount
        except:
            session.rollback()
            session.close()
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        if not success:
            session.rollback()
            session.close()
            raise HTTPException(status_code=404, detail='Record doesn`t exist.')
        else:
            session.commit()
    return { 
        'detail': 'Successfully Posted.',
        'type': 'success'
    }
   




""" UNPOST """

def unpost(data: list, user: str):
    with db.session() as session:
        session.begin()
        try:
            # Unpost entries
            for entry in data:
                sql = """
                    UPDATE journal_entries
                      SET status = 'Journalized',
                        posted_by = NULL,
                        posted_at = NULL,
                        updated_by = :updated_by
                      WHERE id = :id"""
                success = session.execute(sql, {
                    'updated_by': user,
                    'id': entry
                }).rowcount
        except: 
            session.rollback()
            session.close()
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        if not success:
            session.rollback()
            session.close()
            raise HTTPException(status_code=404, detail='Record doesn`t exist.')
        else:
            session.commit()
    return { 
        'detail': 'Successfully Unposted.',
        'type': 'info'
    }
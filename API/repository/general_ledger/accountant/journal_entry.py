#Module
from audioop import add
from fastapi import HTTPException
from sqlalchemy import and_
from uuid import uuid4
from datetime import datetime

#homies
from API import database as db
#general_ledger
from API.models import JournalEntry, JournalAccount
from API.helpers import file_saver





""" GET TABLE DATA """

def get_table_data(request: dict):
    with db.session() as session:
        session.begin()
        try:
            #Get total no. of records
            sql = f"""
                SELECT COUNT(id) 
                  FROM journal_entries"""
            if request['search']['value']:
                sql += f""" WHERE date LIKE '%{request['search']['value']}%'"""
            else:
                sql += f""" WHERE date LIKE '%{request['period']}%'"""
            sql += f""" AND status = '{request['status']}'
                AND entry_type = '{request['type']}'"""
            records_total = (session.execute(sql)).scalar()
            records_total = records_total if records_total else 0
            #Base statement
            sql = f"""
                SELECT JE.id,
                  JE.entry_type,
                  JE.date,
                  JE.is_adjustable,
                  JE.explanation,
                  JE.status,
                  JE.originating_entry,
                  CA.account_title,
                  JA.pr,
                  JA.debit,
                  JA.credit,
                  (CASE
                    WHEN EXISTS (
                      SELECT 1 FROM journal_entries AS AE
                        WHERE AE.originating_entry = JE.id
                    )
                      THEN 1
                    ELSE 0
                  END) AS hasAdjustment
                  FROM journal_entries AS JE
                  INNER JOIN journal_accounts AS JA
                    ON JE.id = JA.journal_entry
                  INNER JOIN chart_accounts AS CA
                    ON JA.account_title = CA.id"""
            #Searching statement
            if request['search']['value']:
                sql += f""" WHERE (JE.date LIKE '%{request['search']['value']}%' 
                    OR CA.account_title LIKE '%{request['search']['value']}%')"""
            else:
                sql += f""" WHERE JE.date LIKE '%{request['period']}%'"""
            sql += f""" AND JE.status = '{request['status']}'
                AND JE.entry_type = '{request['type']}'"""
            #Ordering statement
            if request['order']:
                index = request['order'][0]['column']
                sql += f""" ORDER BY {request['columns'][index]['name']} {request['order'][0]['dir']}, JE.journalized_at ASC, JE.id, JA.debit DESC, JA.credit DESC"""
            else: 
                sql += ' ORDER BY JE.date ASC, JE.journalized_at ASC, JE.id, JA.debit DESC, JA.credit DESC'
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



def add_entry(data, user, session, id, originating_entry=None):
    #Manipulate originating entry
    if data['originating_entry'] != None:
        amount_column, adjustable_column = list(data['originating_entry']['account'].keys())
        #Update adjusted account
        sql = f"""
            UPDATE journal_accounts
              SET {amount_column} = :{amount_column},
                {adjustable_column} = :{adjustable_column}
              WHERE id = :id"""
        session.execute(sql, {
            amount_column: data['originating_entry']['account'][amount_column],
            adjustable_column: data['originating_entry']['account'][adjustable_column],
            'id': data['adjusted_account']
        })
        #Update originating entry
        sql = """
            UPDATE journal_entries
              SET is_adjustable = (
                CASE
                  WHEN EXISTS (
                    SELECT 1 FROM journal_accounts
                      WHERE (is_adjustable = 1
                        OR is_interest_adjustable = 1)
                        AND journal_entry = :id
                  )
                    THEN 1
                  ELSE 0
                END
              )
              WHERE id = :id"""
        session.execute(sql, {'id': data['originating_entry']['id']})
        if originating_entry == None:
          data['originating_entry'] = data['originating_entry']['id']
    #Create journal_entries
    sql = """
        INSERT INTO journal_entries(
          id,
          source_document_path,
          entry_type,
          date,
          is_adjustable,
          explanation,
          status,
          originating_entry,
          adjusted_account,
          adjusted_balance,
          journalized_by,
          posted_at,
          posted_by,
          data_source,
          data_source_date
        ) VALUES(
          :id,
          :source_document_path,
          :entry_type,
          :date,
          :is_adjustable,
          :explanation,
          :status,
          :originating_entry,
          :adjusted_account,
          :adjusted_balance,
          :journalized_by,
          :posted_at,
          :posted_by,
          :data_source,
          :data_source_date)"""
    data['id'] = id
    data['journalized_by'] = user
    data['posted_at'] = (datetime.now() if data['status'] == 'Posted' else None)
    data['posted_by'] = (user if data['status'] == 'Posted' else None)
    data['data_source_date'] = None if data['data_source_date'] == 'null' else data['data_source_date']
    data['data_source'] = None if data['data_source'] == 'null' else data['data_source']
    session.execute(sql, data)
    #Create journal_accounts
    for account in data['new_accounts']:
        account['id'] = uuid4()
        account['journal_entry'] = data['id']
        sql = """
            INSERT INTO journal_accounts(
              id,
              account_title,
              pr,
              debit,
              credit,
              is_adjustable,
              salvage_value,
              useful_life,
              rate,
              month_no,
              balance,
              interest,
              is_interest_adjustable,
              journal_entry
            ) VALUES(
              :id,
              :account_title,
              :pr,
              :debit,
              :credit,
              :is_adjustable,
              :salvage_value,
              :useful_life,
              :rate,
              :month_no,
              :balance,
              :interest,
              :is_interest_adjustable,
              :journal_entry)"""
        session.execute(sql, account)


""" CREATE """

def create(data: dict, user: str):
    with db.session() as session:
        session.begin()
        try:
            
                if data['data_source_status2'].lower() == 'not journalized':
                    
                    session.execute(f""" UPDATE {data['data_source_table_name']} 
                        SET status2 = 'Journalized' 
                        WHERE id = '{data['data_source']}' """)

                    if data['data_source_table_name'] == 'ar_utilities':
                        #'pending','active','approved'
                        if data['data_source_status'].lower() in ['pending','active','approved']:
                            add_entry(data, user, session, uuid4())
                            
                        #'paid','incomplete','incompleted','complete','completed','not complete','not completed'
                        elif data['data_source_status'].lower() in ['paid','incomplete','incompleted','complete','completed','not complete','not completed']:
                            
                            id = uuid4()
                            
                            #From incomplete
                            # from_incomplete_data['originating_entry']['account'] = {
                            #   'balance': amount,
                            #   'is_adjustable': False if data['data_source_status'].lower() in ['paid','complete','completed'] else True
                            # }
                            data['entry_type'] = 'Initial'
                            data['is_adjustable'] = True
                            from_incomplete_data = data.copy()
                            add_entry(from_incomplete_data, user, session, uuid4(), id)
                            
                            data['entry_type'] = 'Adjusting'
                            data['is_adjustable'] = False
                            
                            amount = data['new_accounts'][0]['debit'] if float(data['new_accounts'][0]['debit']) > 0 else data['new_accounts'][0]['credit']
                            
                            account = session.execute(f""" SELECT id, account_number FROM chart_accounts WHERE account_title = 'Utilities Expense' """).first()
                            data['new_accounts'][0]['account_title'] = account[0]
                            data['new_accounts'][0]['pr'] = account[1]
                            data['new_accounts'][0]['debit'] = amount
                            data['new_accounts'][0]['credit'] = 0
                            data['new_accounts'][0]['balance'] = amount
                            data['new_accounts'][0]['is_adjustable'] = False
                            
                            account = session.execute(f""" SELECT id, account_number FROM chart_accounts WHERE account_title = 'Utilities Payable' """).first()
                            data['new_accounts'][1]['account_title'] = account[0]
                            data['new_accounts'][1]['pr'] = account[1]
                            data['new_accounts'][1]['debit'] = 0
                            data['new_accounts'][1]['credit'] = amount
                            data['new_accounts'][1]['balance'] = amount
                            data['new_accounts'][1]['is_adjustable'] = False if data['data_source_status'].lower() in ['paid','complete','completed'] else True
        
                            #Something pending
                            add_entry(data, user, session, id)
                    else:
                        add_entry(data, user, session, uuid4())
                #'incomplete','incompleted','not complete','not completed'
                elif data['data_source_table_name'] == 'ar_utilities' and data['data_source_status'].lower() in ['incomplete','incompleted','not complete','not completed']:
                    add_entry(data, user, session, uuid4())
                elif data['data_source_status2'] is None:
                    add_entry(data, user, session, uuid4())
        except:
            session.rollback()
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        else:
            session.commit()
            #Save file
            if data['source_document_path'] != None:
                file_saver.save_file(data['source_document_path'], data['source_document_content'])
        finally:
            session.close()
    return { 
        'detail': 'New entry has been ' + (
            'journalized' if data['entry_type'] == 'Initial' else 'adjusted'
        ) + (
            ' and posted.' if data['status'] == 'Posted' else '.' 
        ),
        'type': 'success'
    }





""" VALIDATE """

def validate(originating_entry: str):
    with db.session() as session:
        session.begin()
        try:
            sql = f"""
                SELECT 1 
                  FROM journal_entries 
                  WHERE id = :id
                    AND status = 'Posted'"""
            postable = session.execute(sql, {'id': originating_entry}).first()
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return { 
        'detail': None if postable else 'Unable to post the entry, its originating entry is not posted.', 
        'type': None if postable else 'info'
    }





""" GET ONE """

def get_one(id: str):
    try:
        session = db.session()
        session.begin()
        journal_entry = session.query(JournalEntry).filter(JournalEntry.id == id).first()
    except:
        session.close()
        raise HTTPException(status_code=500, detail='Internal Server Error.')
    if not journal_entry:
        session.close()
        raise HTTPException(status_code=404, detail='Record does`nt exist.')
    else:
        adjusted_account_id = journal_entry.adjusted_account
        if adjusted_account_id != None:
            journal_entry.adjusted_account = session.query(JournalAccount)\
                .filter(JournalAccount.id == adjusted_account_id).first()
    return journal_entry





""" GET ALL """

def get_all(period: str):
    with db.session() as session:
        session.begin()
        try:
            sql = f"""
                SELECT JE.id,
                  CONCAT('JE-', JE.date) AS text
                  FROM journal_entries AS JE
                  WHERE JE.date LIKE '%{period}%'
                    AND JE.status = 'Journalized'
                  ORDER BY JE.date ASC"""
            journal_entries = session.execute(sql).all()
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return journal_entries




    
""" UPDATE """

def overwrite(old_id: str, data: dict, user: str):
    with db.session() as session:
        session.begin()
        try:
            #Manipulate originating entry
            if data['originating_entry'] != None:
                amount_column, adjustable_column = list(data['originating_entry']['account'].keys())
                #Update adjusted account
                sql = f"""
                    UPDATE journal_accounts
                      SET {amount_column} = :{amount_column},
                        {adjustable_column} = :{adjustable_column}
                      WHERE id = :id"""
                session.execute(sql, {
                    amount_column: data['originating_entry']['account'][amount_column],
                    adjustable_column: data['originating_entry']['account'][adjustable_column],
                    'id': data['adjusted_account']
                })
                #Update originating entry
                sql = """
                    UPDATE journal_entries
                      SET is_adjustable = (
                        CASE
                          WHEN EXISTS (
                            SELECT 1 FROM journal_accounts
                              WHERE (is_adjustable = 1
                                OR is_interest_adjustable = 1)
                                AND journal_entry = :id
                          )
                            THEN 1
                          ELSE 0
                        END
                      ) 
                      WHERE id = :id"""
                session.execute(sql, {'id': data['originating_entry']['id']})
                data['originating_entry'] = data['originating_entry']['id']
            #Overwrite journal_entries
            sql = """
                INSERT INTO journal_entries(
                  id,
                  source_document_path,
                  entry_type,
                  date,
                  is_adjustable,
                  explanation,
                  status,
                  originating_entry,
                  adjusted_account,
                  adjusted_balance,
                  journalized_at,
                  journalized_by,
                  posted_at,
                  posted_by,
                  updated_at,
                  updated_by,
                  replaced_record,
                  data_source,
                  data_source_date
                ) VALUES(
                    :id,
                    :source_document_path,
                    :entry_type,
                    :date,
                    :is_adjustable,
                    :explanation,
                    :status,
                    :originating_entry,
                    :adjusted_account,
                    :adjusted_balance,
                    :journalized_at,
                    :journalized_by,
                    :posted_at,
                    :posted_by,
                    :updated_at,
                    :updated_by,
                    :replaced_record,
                    :data_source,
                    :data_source_date)""" 
            data['id'] = uuid4()
            data['journalized_at'] = datetime.strptime(data['journalized_at'], '%Y-%m-%dT%H:%M:%S')
            data['posted_at'] = (
                datetime.strptime(data['posted_at'], '%Y-%m-%dT%H:%M:%S') 
                if data['posted_at'] != None 
                else  
                    datetime.now() 
                    if data['status'] == 'Posted' 
                    else 
                    None
            )
            data['posted_by'] = (
                data['posted_by']
                if data['posted_by'] != None
                else
                    user
                    if data['status'] == 'Posted'
                    else
                    None
            )
            data['updated_at'] = datetime.now()
            data['updated_by'] = user
            data['replaced_record'] = old_id
            data['data_source_date'] = None if data['data_source_date'] == 'null' else data['data_source_date']
            session.execute(sql, data)
            
            #Overwrite journal_accounts
            for account in data['new_accounts']:
                account['id'] = uuid4()
                account['journal_entry'] = data['id']
                sql = """
                    INSERT INTO journal_accounts(
                        id,
                        account_title,
                        pr,
                        debit,
                        credit,
                        is_adjustable,
                        salvage_value,
                        useful_life,
                        rate,
                        month_no,
                        balance,
                        interest,
                        is_interest_adjustable,
                        journal_entry
                    ) VALUES(
                        :id,
                        :account_title,
                        :pr,
                        :debit,
                        :credit,
                        :is_adjustable,
                        :salvage_value,
                        :useful_life,
                        :rate,
                        :month_no,
                        :balance,
                        :interest,
                        :is_interest_adjustable,
                        :journal_entry)"""
                session.execute(sql, account)
            
            #Update journal_entries
            sql = """
                UPDATE journal_entries
                  SET status = 'Overwritten',
                    updated_by = :updated_by
                  WHERE id = :id"""
            success = session.execute(sql, {
                'updated_by': user,
                'id': old_id
            }).rowcount
            #Delete adjustments for initial entry
            if data['entry_type'] == 'Initial':
                #Delete accounts
                sql = """
                    DELETE FROM journal_accounts
                      WHERE journal_entry IN (
                        SELECT id FROM journal_entries
                          WHERE originating_entry = :originating_entry
                      )"""
                session.execute(sql, {'originating_entry': old_id})
                #Delete entry
                sql = """
                    DELETE FROM journal_entries
                      WHERE originating_entry = :originating_entry"""
                session.execute(sql, {'originating_entry': old_id})

            sql = """ UPDATE 
                SET status2 = 'Journalized'
                WHERE id = :data_source """
            session.execute(sql, {'data_source': data['data_source']})
            
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
            #Save file
            if data['source_document_path'] != None:
                file_saver.save_file(data['source_document_path'], data['source_document_content'])
    return {
        'detail': 'Successfully Updated.',
        'type': 'success'
    }





""" POST / UNPOST """

def post_or_unpost(old_id: str, operation_type: int, user: str):
    with db.session() as session:
        session.begin()
        try:
            #Get journal_entry
            sql = """
                SELECT * 
                  FROM journal_entries
                  WHERE id = :id"""
            journal_entry = session.execute(sql, {'id': old_id}).first()
            #Get journal_accounts
            sql = """
                SELECT * 
                  FROM journal_accounts
                  WHERE journal_entry = :journal_entry"""
            journal_accounts = session.execute(sql, {'journal_entry': old_id}).all()
            #Overwrite the existing journal_entry
            sql = """
                UPDATE journal_entries
                  SET status = 'Overwritten',
                    updated_by = :updated_by
                  WHERE id = :id"""
            success = session.execute(sql, {
                'updated_by': user,
                'id': old_id
            }).rowcount

            #Create new journal_entry
            entry = dict(journal_entry)
            entry.update({
                'id': str(uuid4()),
                'status': ('Posted' if operation_type == 2 else 'Journalized'),
                'posted_at': (datetime.now() if operation_type == 2 else None),
                'posted_by': (user if operation_type == 2 else None),
                'updated_at': datetime.now(),
                'updated_by': user,
                'replaced_record': old_id
            })
            columns = get_columns(entry) 
            sql = f""" INSERT INTO journal_entries VALUES ({columns}) """
            session.execute(sql, entry)
            
            #Create new journal_accounts
            for account in journal_accounts:
                account = dict(account)
                account.update({
                    'id': uuid4(),
                    'journal_entry': entry['id']
                })
                columns = get_columns(account)
                sql = f""" INSERT INTO journal_accounts VALUES ({columns}) """
                session.execute(sql, account)

            #Delete adjustments for initial entry
            if operation_type != 2 and entry['entry_type'] == 'Initial':
                #Reset the balance & is_adjustable of all new accounts
                sql = """
                    UPDATE journal_accounts AS NA
                      INNER JOIN journal_accounts AS OA
                      ON NA.account_title = OA.account_title
                        AND (
                            (NA.debit > 0 AND OA.debit > 0 AND NA.debit = OA.debit)
                          OR (NA.credit > 0 AND OA.credit > 0 AND NA.credit = OA.credit)
                        )
                      SET NA.balance = (
                        CASE
                          WHEN NA.salvage_value > 0 AND NA.useful_life > 0
                            THEN 0
                          WHEN NA.debit > 0
                            THEN NA.debit
                          ELSE NA.credit
                        END
                      ), NA.is_adjustable = (
                        CASE
                          WHEN EXISTS (
                            SELECT 1 FROM journal_entries AS AE
                              WHERE AE.originating_entry = :old_id
                                AND AE.adjusted_account = OA.id
                          ) OR OA.is_adjustable = 1
                            OR OA.is_interest_adjustable = 1
                            THEN 1
                          ELSE 0
                        END
                      ), NA.interest = 0,
                      NA.is_interest_adjustable = (
                        CASE
                          WHEN (
                            OA.is_interest_adjustable = 1
                            OR (NA.rate > 0 AND NA.month_no > 0)
                          )
                            THEN 1
                          ELSE 0
                        END
                      )
                      WHERE NA.journal_entry = :journal_entry
                        AND OA.journal_entry = :old_id"""
                session.execute(sql, {
                    'old_id': old_id,
                    'journal_entry': entry['id']
                })
                #Reset the is_adjustable of new entry
                sql = """
                  UPDATE journal_entries
                    SET is_adjustable = (
                      CASE
                        WHEN EXISTS (
                          SELECT 1 FROM journal_accounts
                            WHERE (is_adjustable = 1
                              OR is_interest_adjustable = 1)
                              AND journal_entry = :id
                        )
                          THEN 1
                        ELSE 0
                      END
                    )
                    WHERE id = :id"""
                session.execute(sql, {'id': entry['id']})
                #Delete accounts
                sql = """
                    DELETE FROM journal_accounts
                      WHERE journal_entry IN (
                        SELECT id FROM journal_entries
                          WHERE originating_entry = :originating_entry)"""
                session.execute(sql, {'originating_entry': old_id})
                #Delete entry
                sql = """
                    DELETE FROM journal_entries
                      WHERE originating_entry = :originating_entry"""
                session.execute(sql, {'originating_entry': old_id})
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
        'detail': ('Successfully ' + ('Posted.' if operation_type == 2 else 'Unposted.')),
        'type': ('success' if operation_type == 2 else 'info')
    }
        
        
       
       

""" DELETE """

def delete(id: str, operation_type: int, entry_type: str, user: str):
    with db.session() as session:
        session.begin()
        try:
            #Delete initial entry & its adjustment/s | adjusting entry
            sql = """
                UPDATE journal_entries
                  SET status = 'Deleted',
                    updated_by = :updated_by
                  WHERE id = :id
                    OR originating_entry = :id"""
            success = session.execute(sql, {
                'updated_by': user,
                'id': id
            }).rowcount

            #Update originating entry
            if entry_type == 'Adjusting':
                #Update entry
                sql = """
                    UPDATE journal_entries AS OE
                      INNER JOIN journal_entries AS AE
                        ON OE.id = AE.originating_entry
                      SET OE.is_adjustable = 1
                      WHERE AE.id = :id"""
                session.execute(sql, {'id': id})
                #Update account
                sql = """
                  UPDATE journal_accounts AS OA
                    INNER JOIN journal_entries AS AE
                      ON OA.id = AE.adjusted_account
                    INNER JOIN journal_accounts AS AA
                      ON AE.id = AA.journal_entry
                    INNER JOIN chart_accounts AS CA
                      ON AA.account_title = CA.id
                    SET OA.balance = (
                        CASE 
                          WHEN OA.salvage_value > 0 AND OA.useful_life > 0
                            THEN OA.balance - IFNULL(AE.adjusted_balance, 0)
                          WHEN NOT CA.account_title BETWEEN 'interest expense' AND 'interest payable'
                            THEN OA.balance + IFNULL(AE.adjusted_balance, 0)
                          ELSE OA.balance
                        END
                    ), OA.is_adjustable = (
                      CASE
                        WHEN NOT CA.account_title BETWEEN 'interest expense' AND 'interest payable'
                          THEN 1
                        ELSE OA.is_adjustable
                      END
                    )
                    , OA.interest = (
                      CASE
                        WHEN CA.account_title BETWEEN 'interest expense' AND 'interest payable'
                          THEN OA.interest - IFNULL(AE.adjusted_balance, 0)
                        ELSE OA.interest
                      END
                    )
                    , OA.is_interest_adjustable = (
                      CASE
                        WHEN CA.account_title BETWEEN 'interest expense' AND 'interest payable'
                          THEN 1
                        ELSE OA.is_interest_adjustable
                      END
                    )
                    WHERE AE.id = :id"""
                session.execute(sql, {'id': id})
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
   




""" GET ALL total_entries """

def get_all_total_entries():
    with db.session() as session:
        session.begin()
        try:
            total_entries = {}
            #Total journalized
            sql = """
                SELECT COUNT(id)
                  FROM journal_entries
                  WHERE status = 'Journalized'"""
            total_entries['total_journalized'] = (session.execute(sql)).scalar()
            #Total posted
            sql = """
                SELECT COUNT(id)
                  FROM journal_entries
                  WHERE status = 'Posted'"""
            total_entries['total_posted'] = (session.execute(sql)).scalar()
            #Total entries
            total_entries['total_entries'] = total_entries['total_journalized'] + total_entries['total_posted']
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
        finally:
            session.close()
    return total_entries





#Get columns
def get_columns(dataset):
    keys = list(dataset.keys())
    columns = ''
    for key in keys:
        columns += (':' + key + ',')
    return columns[:-1]
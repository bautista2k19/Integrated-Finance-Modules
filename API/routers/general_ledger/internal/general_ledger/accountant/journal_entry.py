#Module
from fastapi import APIRouter, Request, Depends, responses, UploadFile, File, Form
from fastapi.responses import HTMLResponse
from typing import List, Optional
import json

import dotenv

#Homies 
from API.routers.__init__ import templates
from API.helpers import file_reader
from API import security 
from API.schemas.general_ledger.journal_entry import JournalEntryGetForTable, JournalEntryGetAll, JournalEntryGetForSelect 
from API.repository.general_ledger.accountant import journal_entry

# Load .env file
dotenv_file = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_file)

#Router for general_journal
router = APIRouter(
    prefix='/general_ledger/accountant',
    tags=['GeneralJournal'],
    include_in_schema=False
)





""" REDIRECT TO 'general_journal' """

@router.get('/general_journal', status_code=200, response_class=HTMLResponse)
async def redirect_to_general_journal(
    request: Request, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/general_ledger/accountant/general_journal.html", 
            {
                'request': request,
                'home_url': '../../main_dashboard',
                'cd_url': dotenv.get_key(dotenv_file, "CD_ACCOUNTANT_URL"),
                'is_finance_active': 'text-primary',
                'is_gl_active': 'active',
                'sidebar': 'internal/general_ledger/accountant_sidebar',
                'general_journal_menu_item': 'active'
            }
        )

    



""" GET TABLE DATA """

@router.post('/general_journal/datatable', status_code=200, response_model=JournalEntryGetForTable, response_model_exclude_none=True) 
async def get_table_data(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        #Parse json to dict
        request = await request.json()
        return journal_entry.get_table_data(request)




    
""" CREATE """

@router.post("/general_journal", status_code=201) 
async def create(
    source_document: UploadFile = File(None),
    entry_type: str = Form(...),
    date: str = Form(...),
    new_accounts: str = Form(...),
    is_adjustable: bool = Form(False),
    explanation: str = Form(''),
    status: str = Form(...),
    originating_entry: Optional[str] = Form(None),
    adjusted_account: Optional[str] = Form(None),
    adjusted_balance: Optional[float] = Form(0),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        #Get source document path & content
        source_document_path = source_document_content = None
        filename = source_document.filename
        if filename != '':
            source_document_path, source_document_content = \
                await file_reader.read_file(
                    source_document, 
                    filename, 
                    'source_documents/'
                )
        #Collect data
        data = {
            'source_document_path': source_document_path,
            'source_document_content': source_document_content,
            'entry_type': entry_type,
            'date': date,
            'new_accounts': json.loads(new_accounts),
            'is_adjustable': is_adjustable,
            'explanation': explanation,
            'status': status,
            'originating_entry': (json.loads(originating_entry) if originating_entry else None),
            'adjusted_account': adjusted_account,
            'adjusted_balance': adjusted_balance
        }
        return journal_entry.create(data, result['user'].id)
               
    



""" VALIDATE """

@router.get('/general_journal/validate', status_code=200)
async def validate(
    originating_entry: str,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return journal_entry.validate(originating_entry)





""" GET ALL total_entries """

@router.get('/general_journal/total_entries', status_code=200)
async def get_all_total_entries(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return journal_entry.get_all_total_entries()





""" GET ONE """

@router.get('/general_journal/{id}', status_code=200, response_model=JournalEntryGetAll, response_model_exclude_none=True)
async def get_one(
    id: str,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return journal_entry.get_one(id)





""" GET ALL """

@router.get('/journal_entries', status_code=200, response_model=List[JournalEntryGetForSelect])
async def get_all(
    period: str,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return journal_entry.get_all(period)





""" UPDATE """

@router.post('/general_journal/{id}', status_code=201)
async def overwrite(
    id: str,
    source_document: UploadFile = File(None),
    entry_type: str = Form(...),
    date: str = Form(...),
    new_accounts: str = Form(...),
    is_adjustable: bool = Form(False),
    explanation: str = Form(''),
    status: str = Form(...),
    originating_entry: Optional[str] = Form(None),
    adjusted_account: Optional[str] = Form(None),
    adjusted_balance: Optional[float] = Form(0),
    journalized_at: str = Form(...),
    journalized_by: str = Form(...),
    posted_at: Optional[str] = Form(None),
    posted_by: Optional[str] = Form(None),
    saved_filename: Optional[str] = Form(None),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        #Get source document path & content
        source_document_path = source_document_content = None
        if saved_filename != None:
            source_document_path = "assets/img/source_documents/" + saved_filename
        else:
            filename = source_document.filename
            if filename != '':
                source_document_path, source_document_content = \
                    await file_reader.read_file(
                        source_document, 
                        filename, 
                        'source_documents/'
                    )
        #Collect data
        data = {
            'source_document_path': source_document_path,
            'source_document_content': source_document_content,
            'entry_type': entry_type,
            'date': date,
            'new_accounts': json.loads(new_accounts),
            'is_adjustable': is_adjustable,
            'explanation': explanation,
            'status': status,
            'originating_entry': (json.loads(originating_entry) if originating_entry else None),
            'adjusted_account': adjusted_account,
            'adjusted_balance': adjusted_balance,
            'journalized_at': journalized_at,
            'journalized_by': journalized_by,
            'posted_at': posted_at,
            'posted_by': posted_by 
        }
        return journal_entry.overwrite(id, data, result['user'].id)





"""" POST / UNPOST """

@router.put('/general_journal/{id}', status_code=200)
async def post_or_unpost(
    id: str,
    operation_type: int,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return journal_entry.post_or_unpost(id, operation_type, result['user'].id)





""" DELETE """

@router.delete('/general_journal/{id}', status_code=200)
async def delete(
    id: str, 
    operation_type: int,
    entry_type: str, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return journal_entry.delete(id, operation_type, entry_type, result['user'].id)
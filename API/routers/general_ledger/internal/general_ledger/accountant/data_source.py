#Module
from fastapi import APIRouter, Request, Depends, responses
from fastapi.responses import HTMLResponse
from typing import List

from sqlalchemy.orm import Session

import dotenv

#Homies
from API.routers.__init__ import templates
from API import security, database
from API.schemas.general_ledger.data_source import DataSourceGetForTable, DataSourceGetAll, DataSourceGetForSelect, DataSourceSchema
from API.repository.general_ledger.accountant import data_source

# Load .env file
dotenv_file = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_file)

#Router for data source
router = APIRouter(
    prefix='/general_ledger/accountant',
    tags=['DataSource'],
    include_in_schema=False
)



""" REDIRECT TO 'data source' """

@router.get('/data_source', status_code=200, response_class=HTMLResponse)
async def redirect_to_data_source(
    request: Request, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/general_ledger/accountant/data_source.html", 
            {
                'request': request,
                'home_url': '../../main_dashboard',
                'cd_url': dotenv.get_key(dotenv_file, "CD_ACCOUNTANT_URL"),
                'is_finance_active': 'text-primary',
                'is_gl_active': 'active',
                'sidebar': 'internal/general_ledger/accountant_sidebar',
                'data_source_menu_item': 'active'
            }
        )



""" GET TABLE DATA """

@router.post('/data_source/datatable', status_code=200, response_model=DataSourceGetForTable)
async def get_table_data(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        #Parse json to dict
        request = await request.json()
        return data_source.get_table_data(request)



""" CREATE """

@router.post("/data_source", status_code=201) 
async def create(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        #Parse json to dict
        data = await request.json()
        return data_source.create(data, result['user'].id)



""" VALIDATE INPUT """

@router.get('/data_source/validate_input', status_code=200)
async def validate_input(
    id: str,
    column: str,
    value: str,
    closest: str,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return data_source.validate_input(id, column, value, closest)



""" GET ALL """

@router.get('/data_sources', status_code=200, response_model=List[DataSourceGetForSelect])
async def get_all(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return data_source.get_all()



""" UPDATE """

@router.post('/data_source/{id}', status_code=200)
async def update(
    id: str,
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        #Parse json to dict
        data = await request.json()
        return data_source.update(id, data, result['user'].id)
   


""" DEACTIVATE / ACTIVATE """

@router.delete('/data_source/{id}', status_code=200)
async def de_activate(
    id: str,
    status: str,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return data_source.de_activate(id, status, result['user'].id)



""" GET TRANSACTION TABLE DATA """

@router.get('/data_source/transaction_table/{table_name}', status_code=200, response_model=List[DataSourceSchema])
async def get_transaction_table_data(
    table_name: str,
    db: Session = Depends(database.get_db),
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return data_source.get_transaction_table_data(table_name, db)



""" GET ONE """

@router.get('/data_source/{id}', status_code=200, response_model=DataSourceGetAll, response_model_exclude_none=True)
async def get_one(
    id: str,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return data_source.get_one(id)
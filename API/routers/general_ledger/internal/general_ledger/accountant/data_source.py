#Module
from fastapi import APIRouter, Request, Depends, responses
from fastapi.responses import HTMLResponse
from typing import List

import dotenv

#Homies
from API.routers.__init__ import templates
from API import security
from API.schemas.general_ledger.data_source import DataSourceGetForTable, DataSourceGetAll, DataSourceGetForSelect
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



""" FIRST ENDPOINT """

@router.get('/data_source/am', status_code=200)
async def get_first_endpoint_data(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return [
            {
                'date': '01/01/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 1000.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '01/02/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 1200.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '01/03/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 1400.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '01/04/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 1600.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '01/05/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 1800.00,
                'description': 'Lorem ipsum'
            }
        ]



""" SECOND ENDPOINT """

@router.get('/data_source/procurement', status_code=200)
async def get_second_endpoint_data(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return [
            {
                'date': '02/06/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 2000.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '02/07/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 2200.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '02/08/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 2400.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '02/09/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 2600.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '02/10/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 2800.00,
                'description': 'Lorem ipsum'
            }
        ]



""" THIRD ENDPOINT """

@router.get('/data_source/pharmacy', status_code=200)
async def get_third_endpoint_data(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return [
            {
                'date': '03/11/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 3000.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '03/12/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 3200.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '03/13/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 3400.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '03/14/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 3600.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '03/15/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 3800.00,
                'description': 'Lorem ipsum'
            }
        ]



""" FOURTH ENDPOINT """

@router.get('/data_source/warehousing', status_code=200)
async def get_fourth_endpoint_data(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return [
            {
                'date': '04/16/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 4000.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '04/17/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 4200.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '04/18/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 4400.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '04/19/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 4600.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '04/20/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 4800.00,
                'description': 'Lorem ipsum'
            }
        ]



""" FIFTH ENDPOINT """

@router.get('/data_source/ap_ar', status_code=200)
async def get_fifth_endpoint_data(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return [
            {
                'date': '05/21/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 5000.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '05/22/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 5200.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '05/23/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 5400.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '05/24/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 5600.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '05/25/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 5800.00,
                'description': 'Lorem ipsum'
            }
        ]



""" SIXTH ENDPOINT """

@router.get('/data_source/cd', status_code=200)
async def get_sixth_endpoint_data(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return [
            {
                'date': '06/26/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 6000.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '06/27/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 6200.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '06/28/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 6400.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '06/29/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 6600.00,
                'description': 'Lorem ipsum'
            },
            {
                'date': '06/30/2022',
                'source_document': 'static/images/source_documents/cc3fe90a5fbebe9eec7b.jpeg',
                'amount': 6800.00,
                'description': 'Lorem ipsum'
            }
        ]
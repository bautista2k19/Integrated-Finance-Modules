# module
from fastapi import APIRouter, Request, Depends, responses
from fastapi.responses import HTMLResponse

import dotenv

# homies 
from API.routers.__init__ import templates
from API import security
from API.schemas.general_ledger.ledger_account import LedgerAccountGetForTable
from API.repository.general_ledger.accountant import ledger_account

# Load .env file
dotenv_file = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_file)

# router for ledger
router = APIRouter(
    prefix='/general_ledger/accountant',
    tags=['Ledger'],
    include_in_schema=False
)





""" REDIRECT TO 'ledger' """

@router.get('/ledger', status_code=200, response_class=HTMLResponse)
async def redirect_to_ledger(
    request: Request, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse('internal/user/general_ledger/accountant/ledger.html', 
            {
                'request': request,
                'home_url': '../../main_dashboard',
                'cd_url': dotenv.get_key(dotenv_file, "CD_ACCOUNTANT_URL"),
                'is_finance_active': 'text-primary',
                'is_gl_active': 'active',
                'sidebar': 'internal/general_ledger/accountant_sidebar',
                'ledger_menu_item': 'active'
            }
        ) 





""" GET TABLE DATA """

@router.post('/ledger/datatable', status_code=200, response_model=LedgerAccountGetForTable, response_model_exclude_none=True) 
async def get_table_data(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        # parse json to dict
        data = await request.json()
        return ledger_account.get_table_data(data)





""" POST """

@router.put('/ledger', status_code=200)
async def post(
    id: str,  
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return ledger_account.post(id, result['user'].id)





""" UNPOST """

@router.post('/ledger', status_code=200)
async def unpost(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        # parse json to dict
        data = await request.json()
        return ledger_account.unpost(data, result['user'].id)

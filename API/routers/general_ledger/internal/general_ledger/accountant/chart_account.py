#Module
from fastapi import APIRouter, Request, Depends, responses
from fastapi.responses import HTMLResponse
from typing import List

import dotenv

#Homies 
from API.routers.__init__ import templates
from API import security
from API.schemas.general_ledger.chart_account import ChartAccountGetForTable, ChartAccountGetAll, ChartAccountGetForSelect  
from API.repository.general_ledger.accountant import chart_account

# Load .env file
dotenv_file = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_file)

#Router for chart of accounts
router = APIRouter(
    prefix='/general_ledger/accountant',
    tags=['ChartOfAccounts'],
    include_in_schema=False
)





""" REDIRECT TO 'chart of accounts' """

@router.get('/chart_of_accounts', status_code=200, response_class=HTMLResponse)
async def redirect_to_chart_of_accounts(
    request: Request, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/general_ledger/accountant/chart_of_accounts.html", 
            {
                'request': request,
                'home_url': '../../main_dashboard',
                'cd_url': dotenv.get_key(dotenv_file, "CD_ACCOUNTANT_URL"),
                'is_finance_active': 'text-primary',
                'is_gl_active': 'active',
                'sidebar': 'internal/general_ledger/accountant_sidebar',
                'chart_of_accounts_menu_item': 'active'
            }
        ) 

    



""" GET TABLE DATA """

@router.post('/chart_of_accounts/datatable', status_code=200, response_model=ChartAccountGetForTable) 
async def get_table_data(
    request: Request,
    result = Depends(security.auth)
):  
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        #Parse json to dict
        request = await request.json()
        return chart_account.get_table_data(request)
    




""" CREATE """

@router.post("/chart_of_accounts", status_code=201) 
async def create(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        #Parse json to dict
        data = await request.json()
        return chart_account.create(data, result['user'].id)





""" VALIDATE INPUT """

@router.get('/chart_of_accounts/validate_input', status_code=200)
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
        return chart_account.validate_input(id, column, value, closest)





""" GET ALL total_accounts """

@router.get('/chart_of_accounts/total_accounts', status_code=200)
async def get_all_total_accounts(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return chart_account.get_all_total_accounts()
        




""" GET LAST ACCOUNT NO. """

@router.get('/chart_of_accounts/get_last_account_no', status_code=200)
async def get_last_account_no(
    code: str,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return chart_account.get_last_account_no(code)




        
""" GET ONE """

@router.get('/chart_of_accounts/{id}', status_code=200, response_model=ChartAccountGetAll, response_model_exclude_none=True)
async def get_one(
    id: str, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return chart_account.get_one(id)





""" GET ALL """

@router.get('/chart_accounts', status_code=200, response_model=List[ChartAccountGetForSelect])
async def get_all(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return chart_account.get_all()





""" UPDATE """

@router.post('/chart_of_accounts/{id}', status_code=200)
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
        return chart_account.update(id, data, result['user'].id)
   




""" DELETE """

@router.delete('/chart_of_accounts/{id}', status_code=200)
async def delete(
    id: str, 
    operation_type: int, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return chart_account.delete(id, operation_type, result['user'].id)



    

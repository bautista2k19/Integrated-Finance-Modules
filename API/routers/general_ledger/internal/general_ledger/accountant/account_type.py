#Module
from fastapi import APIRouter, Request, Depends, responses
from fastapi.responses import HTMLResponse
from typing import List

import dotenv

#Homies 
from API.routers.__init__ import templates
from API import security
from API.schemas.general_ledger.account_type import AccountTypeGetForTable, AccountTypeGetAll, AccountTypeGetForSelect  
from API.repository.general_ledger.accountant import account_type

# Load .env file
dotenv_file = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_file)


#Router for account type
router = APIRouter(
    prefix='/general_ledger/accountant',
    tags=['AccountType'],
    include_in_schema=False
)





""" REDIRECT TO 'account type' """

@router.get('/account_type', status_code=200, response_class=HTMLResponse)
async def redirect_to_account_type(
    request: Request, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/general_ledger/accountant/account_type.html", 
            {
                'request': request,
                'home_url': '../../main_dashboard',
                'cd_url': dotenv.get_key(dotenv_file, "CD_ACCOUNTANT_URL"),
                'is_finance_active': 'text-primary',
                'is_gl_active': 'active',
                'sidebar': 'internal/general_ledger/accountant_sidebar',
                'account_type_menu_item': 'active'
            }
        )

    



""" GET TABLE DATA """

@router.post('/account_type/datatable', status_code=200, response_model=AccountTypeGetForTable) 
async def get_table_data(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        #Parse json to dict
        request = await request.json()
        return account_type.get_table_data(request)
    




""" CREATE """

@router.post("/account_type", status_code=201) 
async def create(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        #Parse json to dict
        data = await request.json()
        return account_type.create(data, result['user'].id)





""" GET AVAILABLE CODES """

@router.get('/account_type/codes', status_code=200)
async def get_available_codes(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return account_type.get_available_codes()





""" VALIDATE INPUT """

@router.get('/account_type/validate_input', status_code=200)
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
        return account_type.validate_input(id, column, value, closest)




    
""" GET ONE """

@router.get('/account_type/{id}', status_code=200, response_model=AccountTypeGetAll, response_model_exclude_none=True)
async def get_one(
    id: str, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return account_type.get_one(id)





""" GET ALL """

@router.get('/account_types', status_code=200, response_model=List[AccountTypeGetForSelect])
async def get_all(
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return account_type.get_all()



    
    
""" UPDATE """

@router.post('/account_type/{id}', status_code=200)
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
        return account_type.update(id, data, result['user'].id)
   




""" DELETE """

@router.delete('/account_type/{id}', status_code=200)
async def delete(
    id: str, 
    operation_type: int, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return account_type.delete(id, operation_type, result['user'].id)
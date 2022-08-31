# module
from fastapi import APIRouter, Request, Depends, responses
from fastapi.responses import HTMLResponse

import dotenv

# homies 
from API.routers.__init__ import templates
from API import security
#from homies.schemas.recruitment_management.user import UserGet

# Load .env file
dotenv_file = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_file)

# router for dashboard
router = APIRouter(
    prefix='/general_ledger/accountant',
    tags=['Dashboard'],
    include_in_schema=False
)





""" REDIRECT TO 'dashboard' """

@router.get('/dashboard', status_code=200, response_class=HTMLResponse)
async def redirect_to_dashboard(
    request: Request, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse('internal/user/general_ledger/accountant/dashboard.html', 
            {
                'request': request,
                'home_url': '../../main_dashboard',
                'cd_url': dotenv.get_key(dotenv_file, "CD_ACCOUNTANT_URL"),
                'is_finance_active': 'text-primary',
                'is_gl_active': 'active',
                'sidebar': 'internal/general_ledger/accountant_sidebar',
                'dashboard_menu_item': 'active'
            }
        )


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

# router for Index
router = APIRouter(
    prefix='',
    tags=['Index'],
    include_in_schema=False
)





""" REDIRECT TO 'index' """

@router.get('/main_dashboard', status_code=200, response_class=HTMLResponse)
async def redirect_to_main_dashboard(
    request: Request, 
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        user_type = result['user'].user_type
        return templates.TemplateResponse('internal/shared/main_dashboard.html', 
            {
                'request': request,
                'is_home_active': 'text-primary',
                'is_system_admin_online': 'd-block' if user_type == 'System Administrator' else 'd-none',
                'system_admin_url': '../system_admin' if user_type == 'System Administrator' else '#',
                'gl_url': dotenv.get_key(dotenv_file, "GENERAL_LEDGER_ACCOUNTANT_URL") if user_type == 'Accountant' else dotenv.get_key(dotenv_file, "GENERAL_LEDGER_INTERNAL_USER_URL"),
                'cd_url': dotenv.get_key(dotenv_file, "CD_ACCOUNTANT_URL") if user_type == 'Accountant' else '#',
                #'ar_ap_url': dotenv.get_key(dotenv_file, "AR_AP_ACCOUNTANT_URL") if user_type == 'Accountant' else '#',
                'sidebar': 'internal/index_sidebar',
                'main_dashboard_menu_item': 'active',
            }
        )

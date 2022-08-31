# module
from fastapi import APIRouter, Request, Depends, responses
from fastapi.responses import HTMLResponse

# homies 
from API.routers.__init__ import templates
from API import security
#from homies.schemas.recruitment_management.user import UserGet

# router for dashboard
router = APIRouter(
    prefix='/general_ledger/internal_user',
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
        user_type = result['user'].user_type
        return templates.TemplateResponse('internal/user/general_ledger/internal_user/dashboard.html', 
            {
                'request': request,
                'home_url': '../../main_dashboard',
                'is_system_admin_online': 'd-block' if user_type == 'System Administrator' else 'd-none',
                'system_admin_url': '../../system_admin' if user_type == 'System Administrator' else '#',
                'is_finance_active': 'text-primary',
                'is_gl_active': 'active',
                'sidebar': 'internal/general_ledger/internal_user_sidebar',
                'dashboard_menu_item': 'active'
            }
        ) 


# module
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

# homies 
from API.routers.__init__ import templates

# router for public index
router = APIRouter(
    prefix='',
    tags=['PublicIndex'],
    include_in_schema=False
)





""" REDIRECT TO 'index' """

@router.get('/', status_code=200, response_class=HTMLResponse)
async def redirect_to_index(request: Request):
    response = templates.TemplateResponse("public/home.html", {'request': request})
    # Delete tokens
    response.set_cookie(
        key="refresh_token", 
        value="", 
        expires=1, # 1 second
        max_age=1, # 1 second
        path='/',
        httponly=True, 
        samesite="Strict",
        secure=True
    )
    response.set_cookie(
        key="access_token", 
        value="", 
        expires=1, # 1 second
        max_age=1, # 1 second
        path='/',
        httponly=True, 
        samesite="Strict",
        secure=True
    )
    return response










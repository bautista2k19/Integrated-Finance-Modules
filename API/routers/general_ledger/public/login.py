# module
from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from fastapi.responses import HTMLResponse

# homies 
from API.routers.__init__ import templates
from API import database
from API.repository import login

# router for login
router = APIRouter(
    prefix='',
    tags=['Login'],
    include_in_schema=False
)



""" get request for login """

@router.get('/login', status_code=200, response_class=HTMLResponse)
async def log_in(request: Request):
    response = templates.TemplateResponse("public/login.html", {'request': request})
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
   


""" post request to login """

@router.post("/login", status_code=200) 
async def log_in(request: Request, db: Session = Depends(database.get_db)):
    request = await request.json()
    return login.authenticate(db, request)
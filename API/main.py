# module
from fastapi import FastAPI, Request, Depends, responses
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import secrets, dotenv

from fastapi.responses import HTMLResponse

# homies
from API.routers.base import base_router     
from API.__init__ import Base 
from API import database as db

from API.routers.__init__ import templates
from API import security

# create fastapi instance 
app = FastAPI(title='HoMIES', version='1.0.0')



""" CMS """

@app.get("/cms/user/dashboard", status_code=200, response_class=HTMLResponse, tags=['Core'])
async def dashboard(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/cms/dashboard.html", {'request': request})

@app.get("/cms/user/payment_methods", status_code=200, response_class=HTMLResponse, tags=['CMS Payment Agreement'])
async def payment_methods(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/cms/payment_agreement/payment_method.html", {"request": request})


@app.get("/cms/user/payment_terms", status_code=200, response_class=HTMLResponse, tags=['CMS Payment Agreement'])
async def payment_methods(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/cms/payment_agreement/payment_term.html", {"request": request})


@app.get("/cms/user/inpatient_bills", status_code=200, response_class=HTMLResponse, tags=['CMS AP & AR'])
async def inpatient_bills(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ap_ar/inpatient_bill.html", {"request": request})


@app.get("/cms/user/lab_request_bills", status_code=200, response_class=HTMLResponse, tags=['CMS AP & AR'])
async def lab_request_bills(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ap_ar/lab_request_bill.html", {"request": request})


@app.get("/cms/user/prescription_bills", status_code=200, response_class=HTMLResponse, tags=['CMS AP & AR'])
async def prescription_bills(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/pharmacy/prescription_bill.html", {"request": request})


@app.get("/cms/user/treatment_bills", status_code=200, response_class=HTMLResponse, tags=['CMS AP & AR'])
async def treatment_bills(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ap_ar/treatment_bill.html", {"request": request})


@app.get("/cms/user/surgery_bills", status_code=200, response_class=HTMLResponse, tags=['CMS AP & AR'])
async def surgery_bills(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ap_ar/surgery_bill.html", {"request": request})


@app.get("/cms/user/room_bills", status_code=200, response_class=HTMLResponse, tags=['CMS AP & AR'])
async def room_bills(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ap_ar/room_bill.html", {"request": request})


@app.get("/cms/user/purchase_order_vendor_bills", status_code=200, response_class=HTMLResponse, tags=['CMS AP & AR'])
async def purchase_order_vendor_bills(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ap_ar/purchase_order_vendor_bill.html", {"request": request})


@app.get("/cms/user/purchase_order_bills", status_code=200, response_class=HTMLResponse, tags=['CMS AP & AR'])
async def purchase_order_bills(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ap_ar/purchase_order_bill.html", {"request": request})

# collection


@app.get("/cms/user/fees_and_rates", status_code=200, response_class=HTMLResponse, tags=['CMS Collection'])
async def fees_and_rates(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/cms/collection/fees_and_rates.html", {"request": request})


@app.get("/cms/user/inpatient_payments", status_code=200, response_class=HTMLResponse, tags=['CMS Collection'])
async def inpatient_payments(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/cms/collection/inpatient_payment.html", {"request": request})

@app.get("/cms/user/outpatient_payments", status_code=200, response_class=HTMLResponse, tags=['CMS Collection'])
async def outpatient_payments(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/cms/collection/outpatient_payment.html", {"request": request})

# disbursement
@app.get("/cms/user/hospital_payments", status_code=200, response_class=HTMLResponse, tags=['CMS Disbursement'])
async def hospital_payments(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/cms/disbursement/hospital_payment.html", {"request": request})


# bank accounts
@app.get("/cms/user/bank_accounts", status_code=200, response_class=HTMLResponse, tags=['CMS Bank Management'])
async def bank_accounts(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/cms/bank_management/bank_accounts.html", {"request": request})

@app.get("/cms/user/employees", status_code=200, response_class=HTMLResponse)
async def employee_page(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/employee/employee.html", {"request": request})

@app.get("/cms/user/users", status_code=200, response_class=HTMLResponse)
async def user_page(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/employee/user.html", {"request": request})

@app.get("/cms/user/account_settings", status_code=200, response_class=HTMLResponse)
async def account_settings(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/account_settings/account_settings.html", {"request": request})

@app.get("/cms/user/profile", status_code=200, response_class=HTMLResponse)
async def profile(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/profile/profile.html", {"request": request})

""" /CMS """



""" AR / AP """

@app.get("/AR_AP/user/dashboard", response_class=HTMLResponse)
async def ar_ap_dashboard_page(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/dashboard.html", {"request": request})

@app.get("/AR_AP/user/employees", response_class=HTMLResponse)
async def ar_ap_employee_page(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/employee.html", {"request": request})

@app.get("/AR_AP/user/users", response_class=HTMLResponse)
async def ar_ap_user_page(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/user.html", {"request": request})

@app.get("/AR_AP/user/account_settings", response_class=HTMLResponse)
async def ar_ap_account_settings(
    request: Request,
    result = Depends(security.auth)
): 
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/account_settings.html", {"request": request})

@app.get("/AR_AP/user/profile", response_class=HTMLResponse)
async def ar_ap_profile(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/profile.html", {"request": request})

@app.get("/AR_AP/user/inpatient_bills", response_class=HTMLResponse)
async def ar_ap_method1(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/inpatient_bill.html", {"request": request})

@app.get("/AR_AP/user/bill", response_class=HTMLResponse)
async def ar_ap_method2(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/bill.html", {"request": request})

@app.get("/AR_AP/user/fees&rates", response_class=HTMLResponse)
async def ar_ap_fee(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/fee.html", {"request": request})

@app.get("/AR_AP/user/purchase_order", response_class=HTMLResponse)
async def ar_ap_purchase_order(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/purchase_order.html", {"request": request})

@app.get("/AR_AP/user/utilities", response_class=HTMLResponse)
async def ar_ap_utilities(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/utilities.html", {"request": request})

@app.get("/AR_AP/user/voucher_PO", response_class=HTMLResponse)
async def ar_ap_voucher_PO(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/voucher_PO.html", {"request": request})

@app.get("/AR_AP/user/voucher_U", response_class=HTMLResponse)
async def ar_ap_voucher_U(
    request: Request,
    result = Depends(security.auth)
):
    try:
        return responses.RedirectResponse(result['url'], status_code=302)
    except:
        return templates.TemplateResponse("internal/user/ar_ap/voucher_U.html", {"request": request})

# # bank accounts
# @app.get("/AR_AP/user/payment_terms", response_class=HTMLResponse, tags=['CMS Bank Management'])
# async def ar_ap_bank_accounts(request: Request):
#     return templates.TemplateResponse("payment_term.html", {"request": request})

""" /AR / AP """



# origins
origins = [
    "http://127.0.0.1:8000/",
    "http://localhost:8000/",
    # temporary
    "*"
]

# add middleware to allow specified different origins
app.add_middleware(
    CORSMiddleware,
    allow_credentials = True,
    allow_origins = origins,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

# load static directory
app.mount("/assets", StaticFiles(directory="FRONT_END/assets"), name="assets")

# include base_router
app.include_router(base_router)



# create all tables 
Base.metadata.create_all(db.engine)

# Set secret keys
dotenv_file = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_file)
""" dotenv.set_key(dotenv_file, 'ACCESS_SECRET_KEY', secrets.token_hex(64))
dotenv.set_key(dotenv_file, 'REFRESH_SECRET_KEY', secrets.token_hex(64)) """

# Middleware to renew access_token & close left db session
@app.middleware("http")
async def renew_close(request: Request, call_next):
    response = await call_next(request)
    if dotenv.get_key(dotenv_file, 'ACCESS_TOKEN'):
        # Renew access_token
        response.set_cookie(
            key="access_token", 
            value=f"bearer {dotenv.get_key(dotenv_file, 'ACCESS_TOKEN')}", 
            path='/',
            expires=900, # 15 min
            max_age=900, # 15 min
            httponly=True, 
            samesite="Strict",
            secure=True
        )
        dotenv.unset_key(dotenv_file, 'ACCESS_TOKEN')
    # Close left db session
    with db.session() as session:
        session.close()
    return response

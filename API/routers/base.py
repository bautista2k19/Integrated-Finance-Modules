# module
from fastapi import APIRouter

# public 
from API.routers.general_ledger.public import index as public_index, find_doctor, login
# internal 
from API.routers.general_ledger.internal import index as internal_index
# general_ledger > accountant
from API.routers.general_ledger.internal.general_ledger.accountant import dashboard as accountant_dashboard, account_type, chart_account, journal_entry, data_source, ledger_account
# general_ledger > internal_user
from API.routers.general_ledger.internal.general_ledger.internal_user import dashboard as internal_user_dashboard

# base router to include all routers
base_router = APIRouter()

""" public """
# public_index router
base_router.include_router(public_index.router)
# find_doctor router
base_router.include_router(find_doctor.router)
# login router
base_router.include_router(login.router)

""" internal """
# internal_index router
base_router.include_router(internal_index.router)

""" general_ledger > accountant """
# accountant_dashboard router
base_router.include_router(accountant_dashboard.router)
# account_type router
base_router.include_router(account_type.router)
# chart_account router
base_router.include_router(chart_account.router)
# journal_entry router
base_router.include_router(journal_entry.router)
# ledger_account router
base_router.include_router(ledger_account.router)
#data_source router
base_router.include_router(data_source.router)

""" general_ledger > internal_user """
# internal_user_dashboard router
base_router.include_router(internal_user_dashboard.router)



""" CD """
from API.routers import user#, authentication
from API.routers.employee import employee, department, job, employee_type, user_type
from API.routers.cms.dashboard import dashboard
from API.routers.cms.collection import lab_test_type, treatment_type, room_type, surgery_type
from API.routers.cms.collection import inpatient_payment, inpatient_prescription_payment, inpatient_room_payment, inpatient_lab_request_payment, inpatient_treatment_payment, inpatient_surgery_payment
from API.routers.cms.collection import outpatient_lab_request_payment, outpatient_treatment_payment
from API.routers.cms.disbursement import purchase_order_vendor_payment, purchase_order_payment
from API.routers.cms.payment_agreement import payment_method, payment_term
from API.routers.cms.bank_management import bank_account,deposit, withdrawal
from API.routers.ap_ar import inpatient_bill, lab_request_bill, treatment_bill, surgery_bill, room_bill, purchase_order_vendor_bill, purchase_order_bill
from API.routers.pharmacy import prescription_bill
from API.routers.patient import inpatient, prescription
from API.routers.treatment import lab_request, treatment



#base_router.include_router(authentication.router)
base_router.include_router(user.router)

# employee
base_router.include_router(employee.router)
base_router.include_router(department.router)
base_router.include_router(job.router)
base_router.include_router(employee_type.router)
base_router.include_router(user_type.router)

# patient
base_router.include_router(inpatient.router)
base_router.include_router(prescription.router)

#treatment
base_router.include_router(lab_request.router)
base_router.include_router(treatment.router)

# payment agreement
base_router.include_router(payment_method.router)
base_router.include_router(payment_term.router)

# ap ar
base_router.include_router(inpatient_bill.router)
base_router.include_router(lab_request_bill.router)
base_router.include_router(treatment_bill.router)
base_router.include_router(surgery_bill.router)
base_router.include_router(room_bill.router)
base_router.include_router(purchase_order_vendor_bill.router)
base_router.include_router(purchase_order_bill.router)

# pharmacy
base_router.include_router(prescription_bill.router)

#dashboard
base_router.include_router(dashboard.router)

# collection
# fees
base_router.include_router(lab_test_type.router)
base_router.include_router(treatment_type.router)
base_router.include_router(room_type.router)
base_router.include_router(surgery_type.router)

#payment
base_router.include_router(inpatient_payment.router)
base_router.include_router(inpatient_prescription_payment.router)
base_router.include_router(inpatient_room_payment.router)
base_router.include_router(inpatient_lab_request_payment.router)
base_router.include_router(inpatient_treatment_payment.router)
base_router.include_router(inpatient_surgery_payment.router)

base_router.include_router(outpatient_lab_request_payment.router)
base_router.include_router(outpatient_treatment_payment.router)

#disbursement
base_router.include_router(purchase_order_vendor_payment.router)
base_router.include_router(purchase_order_payment.router)

#bank management
base_router.include_router(bank_account.router)
base_router.include_router(deposit.router)
base_router.include_router(withdrawal.router)
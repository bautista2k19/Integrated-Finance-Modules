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



""" AR / AP """

from API.routers.ar_ap import user as ar_user, employee as ar_employee
from API.routers.ar_ap import \
    discharge_management as ar_discharge_management, \
    discount_privillages as ar_discount_privillages, \
    doctor_profile       as ar_doctor_profile, \
    inpatients           as ar_inpatients, \
    insurances           as ar_insurances, \
    lab_requests         as ar_lab_requests, \
    lab_service_name     as ar_lab_service_name, \
    lab_test_types       as ar_lab_test_types, \
    patient_registration as ar_patient_registration, \
    patient_rooms        as ar_patient_rooms, \
    room_types           as ar_room_types, \
    rooms                as ar_rooms, \
    specialization       as ar_specialization, \
    surgery_in_charge    as ar_surgery_in_charge, \
    surgery_types        as ar_surgery_types, \
    surgeries            as ar_surgeries, \
    treatment_service_name as ar_treatment_service_name, \
    treatment_types        as ar_treatment_types, \
    treatments             as ar_treatments, \
    pharmacy_invoice       as ar_pharmacy_invoice, \
    medicalsupplies        as ar_medicalsupplies, \
    medicine               as ar_medicine, \
    prescription           as ar_prescription, \
    hospital_service_name  as ar_hospital_service_name, \
    hospital_services      as ar_hospital_services, \
    hospital_charges_bill  as ar_hospital_charges_bill, \
    treatment_bill         as ar_treatment_bill, \
    lab_requests_bill      as ar_lab_requests_bill, \
    medicine_pr            as ar_medicine_pr, \
    medicalsupplies_pr     as ar_medicalsupplies_pr, \
    pharmacy_bill          as ar_pharmacy_bill, \
    room_bill              as ar_room_bill, \
    doctor_fee_bill        as ar_doctor_fee_bill, \
    inpatient_bills        as ar_inpatient_bills, \
    purchase_order         as ar_purchase_order, \
    utilities              as ar_utilities



base_router.include_router(ar_employee.router)
base_router.include_router(ar_user.router)

base_router.include_router(ar_room_types.router)
base_router.include_router(ar_rooms.router)
base_router.include_router(ar_discount_privillages.router)
base_router.include_router(ar_insurances.router)

base_router.include_router(ar_patient_registration.router)

base_router.include_router(ar_inpatients.router)
base_router.include_router(ar_discharge_management.router)
base_router.include_router(ar_patient_rooms.router)

base_router.include_router(ar_specialization.router)
base_router.include_router(ar_doctor_profile.router)


base_router.include_router(ar_treatment_types.router)
base_router.include_router(ar_treatment_service_name.router)
base_router.include_router(ar_treatments.router)

base_router.include_router(ar_lab_test_types.router)
base_router.include_router(ar_lab_service_name.router)
base_router.include_router(ar_lab_requests.router)

base_router.include_router(ar_surgery_types.router)
base_router.include_router(ar_surgeries.router)
base_router.include_router(ar_surgery_in_charge.router)

base_router.include_router(ar_medicine.router)
base_router.include_router(ar_medicalsupplies.router)

base_router.include_router(ar_medicine_pr.router)
base_router.include_router(ar_medicalsupplies_pr.router)
base_router.include_router(ar_prescription.router)

base_router.include_router(ar_pharmacy_invoice.router)

base_router.include_router(ar_hospital_service_name.router)
base_router.include_router(ar_hospital_services.router)

base_router.include_router(ar_hospital_charges_bill.router)
base_router.include_router(ar_treatment_bill.router)
base_router.include_router(ar_lab_requests_bill.router)
base_router.include_router(ar_pharmacy_bill.router)
base_router.include_router(ar_room_bill.router)
base_router.include_router(ar_doctor_fee_bill.router)
base_router.include_router(ar_inpatient_bills.router)

base_router.include_router(ar_purchase_order.router)
base_router.include_router(ar_utilities.router)




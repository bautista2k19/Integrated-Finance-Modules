from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel


class ShowDepartment(BaseModel):
    id:str
    main_department_name:str
    main_department_desc:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ShowJob(BaseModel):
    id:str
    job_title:str
    job_desc:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ShowEmployee(BaseModel):
    id: str
    photo: str
    first_name: str
    middle_name: Optional[str]
    last_name: str
    extension_name: Optional[str]
    birthdate: date
    birthplace: str
    gender: str
    civil_status: str
    house_number: Optional[str]
    street: Optional[str]
    barangay: str
    city: str
    province: str
    region:str
    zip_code:str
    country: str
    contact_number: str
    department_id: str
    job_id: str
    employee_type_id: str
    leave_balance:float
    hire_date: date
    manager: str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    department: ShowDepartment = []
    job: ShowJob = []

    class Config:
        orm_mode = True

class ShowUserType(BaseModel):
    id:str
    user_type:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    employee: ShowEmployee = []

    class Config:
        orm_mode = True

class UserBase(BaseModel):

    email: str
    user_type_id: str
    employee_id: str

class CreateUser(UserBase):

    password: str

class ShowUser(UserBase):
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    user_type: ShowUserType = []
    employee: ShowEmployee = []
    
    class Config:
        orm_mode = True

# class ShowUser(UserBase):
#     status: str
#     created_by: Optional[str] = None
#     created_at: datetime
#     updated_by: Optional[str] = None
#     updated_at: Optional[datetime] = None

#     user_type: ShowUserType = []
#     employee: ShowEmployee = []
    
#     class Config:
#         orm_mode = True

class ShowPatient(BaseModel):
    id:str
    first_name:str
    middle_name:str
    last_name:str
    sex:str
    birthdate:date
    weight:str
    height:str
    blood_type:str
    guardian:str
    address:str
    contact_number:str
    patient_type:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ShowRoomType(BaseModel):
    id : str
    name: str
    description: str
    fee: float
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ShowRoom(BaseModel):
    id : str
    name: str
    description: str
    fee: float
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    room_room_type: ShowRoomType = []

    class Config:
        orm_mode = True

class ShowInpatient(BaseModel):
    id : str
    inpatient_no: str
    patient_id: str
    date_admitted: date
    reason_admittance:str
    department:str
    diagnosis:str
    tests:str
    treatment:str
    surgery:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    inpatient_patient: ShowPatient = []

    class Config:
        orm_mode = True

class ShowRoomAdmission(BaseModel):
    id : str
    inpatient_id: str
    room_id: str
    admission_date: date
    discharge_date: date
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    room_admission_inpatient: ShowPatient = []
    room_admission_room: ShowRoom = []
    
    class Config:
        orm_mode = True

class ShowPrescription(BaseModel):
    id : str
    prescription_no: str
    inpatient_id: str
    outpatient_id: str
    date_prescribed: date
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ShowMedicinePrescription(BaseModel):
    id : str
    medicine_prescription_no: str
    prescription_id: str
    medicine_id: str
    quantity: int
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ShowMedicalSuppPrescription(BaseModel):
    id : str
    medical_supply_prescription_no: str
    prescription_id: str
    medical_supply_id: str
    quantity: int
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ShowDischarge(BaseModel):
    id : str
    discharge_no: str
    inpatient_id: str
    discharge_date: date
    discharge_diagnosis:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ShowOutpatient(BaseModel):
    id : str
    outpatient_no: str
    patient_id: str
    walk_in_date: date
    purpose:str
    tests:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ShowDiscountPrivilege(BaseModel):
    id : str
    patient_id: str
    phil_health_id: str
    end_of_validity: date
    senior_citizen_id: str
    municipality:str
    senior_citizen_id:str
    type_of_disability:str
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ShowLabTestType(BaseModel):
    id : str
    name: str
    description: str
    fee: float
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowLabRequest(BaseModel):
    id : str
    lab_request_no: str
    lab_test_type_id: str
    inpatient_id: Optional[str]
    outpatient_id: Optional[str]
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowLabResult(BaseModel):
    id : str
    lab_result_no: str
    lab_request_id: str
    specimen: str
    result: str
    reference: str
    unit: str
    detailed_result:str
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowTreatmentType(BaseModel):
    id : str
    name: str
    description: str
    fee: float
    status : str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowTreatment(BaseModel):
    id: str
    treatment_no: str
    inpatient_id: Optional[str]
    outpatient_id: Optional[str]
    treatment_type_id: str
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowTreatmentInCharge(BaseModel):
    id: str
    treatment_id: str
    employee_id: str
    professional_fee: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowSurgeryType(BaseModel):
    id: str
    name: str
    description: str
    fee: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowSurgey(BaseModel):
    id: str
    surgery_no: str
    inpatient_id: str
    start_time: time
    end_time: time
    surgery_type_id:str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowSurgeryInCharge(BaseModel):
    id: str
    surgery_id: str
    employee_id: str
    professional_fee: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowMedicine(BaseModel):
    id: str
    med_product_name: str
    med_quantity: int
    med_manufactured_date: date
    med_import_date: date
    med_expiration_date: date
    med_manufacturer: str
    med_batch_number: int
    med_unit_price: float
    med_tax: float
    med_purpose: str
    dosage: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowMedicalSupply(BaseModel):
    id: str
    ms_product_name: str
    ms_quantity: int
    ms_manufactured_date: date
    ms_import_date: date
    ms_expire_date: date
    ms_manufacturer: str
    ms_batch_number: int
    ms_unit_price: float
    ms_tax: float
    ms_purpose: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPrescriptionBill(BaseModel):
  
    id: str
    prescription_bill_no: str
    #prescription_id: str
    inpatient_id: str
    billing_date: date
    medicine_amount: float
    medical_amount: float
    sub_total:float
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowSales(BaseModel):
    id: str
    product_name: str
    date: date
    gross_margin: float
    total_amount: float 
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowVendor(BaseModel):
    id: str
    vendor_name: str
    region: str
    city: str
    street: str
    industry: str
    contact_person: str
    contact_number: str
    email: str
    password: str
    blacklist_reason: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowProductCategory(BaseModel):
    id: str
    category_name: str
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowProduct(BaseModel):
    id: str
    product_category_id: str
    product_pic: str
    product_name: str
    product_details: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPurchaseRequisition(BaseModel):
    id: str
    purchase_requisition_number: str
    purpose: str
    date_requested: date
    department_id: str
    approved_by: str
    reason: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPurchaseRequisitionDetail(BaseModel):
    id: str
    purchase_requisition_id: str
    new_product_category: str
    new_product_name: str
    product_id: str
    quantity: int
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowRequestQuotation(BaseModel):
    id: str
    request_quotation_number: str
    vendor_id: str
    purchase_requisition_id: str
    message: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowVendorProposal(BaseModel):
    id: str
    subtotal: Optional[str]
    discount: Optional[float]
    tax: Optional[float]
    total_amount: Optional[str]
    message: Optional[str]
    request_quotation_id: Optional[str]
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowVendorBiddingItem(BaseModel):
    id: str
    product_name: Optional[str]
    quantity: Optional[int]
    product_category: Optional[str]
    product_bidding_price: Optional[str]
    total_cost: Optional[str]
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPurchaseOrder(BaseModel):
    id: str
    purchase_order_number: str
    vendor_bidding_item_id: Optional[str]
    order_date: date
    expected_delivery_date: date
    payment_method: str
    shipping_method: str
    notes: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPurchaseOrderDetail(BaseModel):
    id: str
    purchase_order_id: str
    product_name: str
    product_category: str
    quantity: int
    product_price: float
    total_cost: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowInpatientBill(BaseModel):
    id: str
    inpatient_id: str
    inpatient_bill_no: str
    total_professional_fee: float
    total_lab_test_fee: float
    total_treatment_fee: float
    total_surgery_fee: float
    total_room_fee: float
    total_discounts: float
    total_bill: float
    date_of_billing: date
    due_date: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
    
class ShowLabRequestBill(BaseModel):
    id: str
    lab_request_bill_no: str
    lab_request_id: str
    inpatient_bill_id: str
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
    
class ShowTreatmentBill(BaseModel):
    id: str
    treatment_bill_no: str
    treatment_id: str
    inpatient_bill_id: str
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowSurgeryBill(BaseModel):
    id: str
    surgery_bill_no: str
    surgery_id: str
    inpatient_bill_id: str
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowRoomBill(BaseModel):
    id: str
    room_bill_no: str
    room_admission_id: str
    inpatient_bill_id: str
    total_amount: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPurchaseOrderVendorBill(BaseModel):
    id: str
    purchase_order_vendor_bill_no: str
    vendor_id: str
    total_vendor_bill: float
    date_of_billing: date
    due_date: date
    remaining_balance: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPurchaseOrderBill(BaseModel):
    id: str
    purchase_order_bill_no: str
    purchase_order_vendor_bill_id: str
    purchase_order_id: str
    total_bill: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPaymentMethod(BaseModel):
    id: str
    method_name: str
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
    
class ShowPaymentTerm(BaseModel):
    id: str
    term_name: str
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPatientCashPayment(BaseModel):
    id: str
    cash_payment_no: str
    amount: float
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
    
class ShowPatientCheckPayment(BaseModel):
    id: str
    check_no: str
    check_date: date
    account_name: str
    account_no: str
    rt_number: str
    payee_name: str
    amount: float
    bank_name: str
    bank_address: str
    description: str
    check_status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowHospitalCashPayment(BaseModel):
    id: str
    cash_payment_no: str
    amount: float
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowHospitalCheckPayment(BaseModel):
    id: str
    check_no: str
    check_date: date
    account_name: str
    account_no: str
    rt_number: str
    payee_name: str
    amount: float
    bank_name: str
    bank_address: str
    description: str
    check_status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowInpatientPayment(BaseModel):
    id: str
    or_no: str
    inpatient_bill_id: str
    total_amount_paid: float
    payment_term_id: str
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowInpatientLabRequestPayment(BaseModel):
    id: str
    or_no: Optional[str]
    lab_request_id: str
    inpatient_payment_id: str
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    payment_method_id: str
    amount_paid: float
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowInpatientPrescriptionPayment(BaseModel):
    id: str
    or_no: Optional[str]
    prescription_bill_id: str
    inpatient_payment_id: str
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    payment_method_id: str
    amount_paid: float
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowInpatientTreatmentPayment(BaseModel):
    id: str
    or_no: Optional[str]
    treatment_bill_id: str
    inpatient_payment_id: str
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    payment_method_id: str
    amount_paid: float
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowInpatientSurgeryPayment(BaseModel):
    id: str
    or_no: Optional[str]
    surgery_bill_id: str
    inpatient_payment_id: str
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    payment_method_id: str
    amount_paid: float
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowInpatientRoomPayment(BaseModel):
    id: str
    or_no: Optional[str]
    room_bill_id: str
    inpatient_payment_id: str
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    payment_method_id: str
    amount_paid: float
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowOutpatientLabRequestPayment(BaseModel):
    id: str
    or_no: Optional[str]
    lab_request_id: str
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    payment_method_id: str
    payment_term_id: str
    amount_paid: float
    date_of_payment: date
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowOutpatientTreatmentPayment(BaseModel):
    id: str
    or_no: Optional[str]
    treatment_id: str
    patient_cash_payment_id: Optional[str]
    patient_check_payment_id: Optional[str]
    payment_method_id: str
    payment_term_id: str
    amount_paid: float
    date_of_payment: date
    description: str
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
    
class ShowDeposit(BaseModel):
    id: str
    deposit_no: str
    bank_name: str
    account_no: str
    account_name: str
    amount: float
    amount_in_words: str
    description: str
    type: str
    date_of_deposit: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
    
class Collection(BaseModel):
    id: str
    inpatient_payment_id: str
    account_credited: str
    posting_reference: str
    explanation: str
    cash: float
    sales_discount: float
    accounts_receivable: float
    accounts_payable: float
    sales: float
    other_accounts: float
    cods_inventory: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
    
class ShowPurchaseOrderVendorPayment(BaseModel):
    id: str
    or_no: Optional[str]
    purchase_order_vendor_bill_id: str
    total_amount_paid: float
    payment_term_id: str
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowPurchaseOrderPayment(BaseModel):
    id: str
    or_no: Optional[str]
    purchase_order_vendor_payment_id: str
    purchase_order_bill_id: str
    hospital_cash_payment_id: Optional[str]
    hospital_check_payment_id: str
    payment_method_id: str
    amount_paid: float
    date_of_payment: date
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True

class ShowDisbursement(BaseModel):
    id: str
    check_no: str
    payee_name: str
    account_credited: str
    posting_reference: str
    cash: float
    inventory: float
    other_accounts: float
    accounts_payable: float
    status: str
    created_by : str
    created_at : datetime
    updated_by : Optional[str]
    updated_at : Optional[datetime]

    class Config():
        orm_mode = True
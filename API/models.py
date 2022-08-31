

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, CHAR, DateTime

from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.schema import UniqueConstraint
from sqlalchemy.sql.sqltypes import DECIMAL, TEXT, Date, Float, SmallInteger, Text, Time

# homies 
from API.database import Base

#Employee
    
class Employee(Base):
    __tablename__ = "employees"

    id = Column(CHAR(60), primary_key=True, index=True)
    photo = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)
    middle_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=False)
    extension_name = Column(String(255), nullable=True)
    birth_date = Column(Date, nullable=False)
    gender = Column(String(255), nullable=False)
    civil_status = Column(String(255), nullable=False, server_default="Active")
    house_number = Column(String(255), nullable=True)
    street = Column(String(255), nullable=True)
    barangay = Column(String(255), nullable=True)
    city = Column(String(255), nullable=False)
    province = Column(String(255), nullable=False)
    region= Column(String(255),nullable=False)
    zip_code = Column(CHAR(4), nullable=False)
    contact_number = Column(CHAR(11), nullable=False,unique=True, index=True)
    job_id=Column(CHAR(36), ForeignKey('jobs.id'))
    department_id=Column(CHAR(36), ForeignKey('departments.id'))
    employee_type_id = Column(CHAR(36),ForeignKey('employee_types.id'))
    leave_balance=Column(SmallInteger,server_default='0',nullable=True)
    hire_date = Column(Date, nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    user_credentials = relationship("User", primaryjoin="and_(Employee.id==User.employee_id)", back_populates="employee")
    job = relationship("Job", primaryjoin="and_(Employee.job_id==Job.id)",back_populates="employee_job")
    department = relationship("Department", primaryjoin="and_(Department.id == Employee.department_id)",back_populates="department_employee")
    employee_treatment_in_charge = relationship("Treatment_in_charge", primaryjoin="and_(Treatment_in_charge.employee_id==Employee.id)", back_populates="treatment_in_charge_employee")
    employee_surgery_in_charge = relationship("Surgery_in_charge", primaryjoin="and_(Surgery_in_charge.employee_id==Employee.id)", back_populates="surgery_in_charge_employee")

class Employee_type(Base):
    __tablename__ = 'employee_types'

    id=Column(CHAR(36),primary_key=True)
    employee_type=Column(String(15))
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())


class Department(Base):
    __tablename__ = 'departments'

    id = Column(CHAR(36),primary_key=True)
    main_department_name = Column(CHAR(36))
    main_department_desc = Column(TEXT)
    status= Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    department_employee = relationship("Employee", primaryjoin="and_(Employee.department_id==Department.id)",back_populates="department")

class Sub_Department(Base):
    __tablename__ = 'sub_departments'

    id=Column(CHAR(36),primary_key=True)
    main_department_id = Column(CHAR(36), ForeignKey("departments.id"))
    sub_department_name=Column(CHAR(36))
    department_desc=Column(TEXT)
    department_place=Column(CHAR(36))
    department_manager=Column(CHAR(36), ForeignKey("employees.id"),nullable=True)
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

class Job(Base):
    __tablename__ = 'jobs'

    id= Column(CHAR(36), primary_key=True)
    job_title=Column(String(40))
    job_desc=Column(TEXT)
    sub_department_id = Column(CHAR(36), ForeignKey("sub_departments.id"))
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    employee_job = relationship("Employee", primaryjoin="and_(Job.id== Employee.job_id)",back_populates="job")

class User_type(Base):
    __tablename__ = 'user_types'

    id=Column(CHAR(36),primary_key=True)
    user_type=Column(String(15))
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())
    
    user= relationship("User",primaryjoin="and_(User_type.id==User.user_type_id)",back_populates="user_type")

class User(Base):
    __tablename__ = "users"

    id = Column(CHAR(36), primary_key=True, index=True)
    email = Column(String(255),nullable=False, unique=True, index=True)
    password = Column(String(255),nullable=False)
    user_type_id = Column(CHAR(36), ForeignKey('user_types.id'))
    employee_id = Column(CHAR(36), ForeignKey('employees.id'))

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    user_type= relationship("User_type",primaryjoin="and_(User.user_type_id==User_type.id)",back_populates="user")
    employee = relationship("Employee", primaryjoin="and_(User.employee_id==Employee.id)", back_populates="user_credentials")


#Patient

class Patient(Base):
    __tablename__ = "patients"
    id = Column(CHAR(36), primary_key=True)
    first_name = Column(String(255), nullable=False)
    middle_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=False)
    sex = Column(String(255), nullable=False)
    birthdate = Column(Date, nullable=False) 
    weight = Column(String(255), nullable=False)
    height = Column(String(255), nullable=False)
    blood_type = Column(String(255), nullable=False)
    guardian = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    contact_number = Column(String(255), nullable=False)
    patient_type = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    patient_inpatient = relationship("Inpatient", primaryjoin="and_(Inpatient.patient_id==Patient.id)", back_populates="inpatient_patient")
    patient_outpatient = relationship("Outpatient", primaryjoin="and_(Outpatient.patient_id==Patient.id)", back_populates="outpatient_patient")

class Room_type(Base):
    __tablename__ = "room_types"
    id = Column(CHAR(36), primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    fee = Column(Float, nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    room_type_room = relationship("Room", primaryjoin="and_(Room.room_type_id==Room_type.id)", back_populates="room_room_type")

class Room(Base):
    __tablename__ = "rooms"
    id = Column(CHAR(36), primary_key=True)
    room_number = Column(String(255), nullable=False)
    room_type_id = Column(CHAR(36), ForeignKey("room_types.id"), nullable=False)
    description = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    room_room_type = relationship("Room_type", primaryjoin="and_(Room_type.id==Room.room_type_id)", back_populates="room_type_room")
    room_room_admission = relationship("Room_admission", primaryjoin="and_(Room_admission.room_id==Room.id)", back_populates="room_admission_room")

class Inpatient(Base):
    __tablename__ = "inpatients"
    id = Column(CHAR(36), primary_key=True)
    inpatient_no = Column(String(255), nullable=False)
    patient_id = Column(CHAR(36), ForeignKey("patients.id"), nullable=False)
    date_admitted = Column(Date, nullable=False)
    reason_admittance = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    diagnosis = Column(String(255), nullable=False)
    tests = Column(String(255), nullable=True)
    treatment = Column(String(255), nullable=True)
    surgery = Column(String(255), nullable=True)
    patient_status = Column(String(255), nullable=False, server_default="Admitted")

    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    inpatient_patient = relationship("Patient", primaryjoin="and_(Patient.id==Inpatient.patient_id)", back_populates="patient_inpatient")
    inpatient_room_admission = relationship("Room_admission", primaryjoin="and_(Room_admission.inpatient_id==Inpatient.id)", back_populates="room_admission_inpatient")
    inpatient_prescription = relationship("Prescription", primaryjoin="and_(Prescription.inpatient_id==Inpatient.id)", back_populates="prescription_inpatient")
    inpatient_prescription_bill = relationship("Prescription_bill", primaryjoin="and_(Prescription_bill.inpatient_id==Inpatient.id)", back_populates="prescription_bill_inpatient")
    inpatient_lab_request = relationship("Lab_request", primaryjoin="and_(Lab_request.inpatient_id==Inpatient.id)", back_populates="lab_request_inpatient")
    inpatient_treatment = relationship("Treatment", primaryjoin="and_(Treatment.inpatient_id==Inpatient.id)", back_populates="treatment_inpatient")
    inpatient_surgery = relationship("Surgery", primaryjoin="and_(Surgery.inpatient_id==Inpatient.id)", back_populates="surgery_inpatient")
    inpatient_inpatient_bill = relationship("Inpatient_bill", primaryjoin="and_(Inpatient_bill.inpatient_id==Inpatient.id)", back_populates="inpatient_bill_inpatient")

class Room_admission(Base):
    __tablename__ = "room_admissions"
    id = Column(CHAR(36), primary_key=True)
    inpatient_id = Column(CHAR(36), ForeignKey("inpatients.id"), nullable=False)
    room_id = Column(CHAR(36), ForeignKey("rooms.id"), nullable=False)
    admission_date = Column(Date, nullable=False)
    discharge_date = Column(Date, nullable=True)
    status = Column(String(255), nullable=False, server_default="Admitted")
    #total_fee = Column(Float, nullable=False)
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    room_admission_inpatient = relationship("Inpatient", primaryjoin="and_(Inpatient.id==Room_admission.inpatient_id)", back_populates="inpatient_room_admission")
    room_admission_room = relationship("Room", primaryjoin="and_(Room.id==Room_admission.room_id)", back_populates="room_room_admission")
    room_admission_room_bill = relationship("Room_bill", primaryjoin="and_(Room_bill.room_admission_id==Room_admission.id)", back_populates="room_bill_room_admission")

class Prescription(Base):
    __tablename__ = "prescriptions"
    id = Column(CHAR(36), primary_key=True)
    prescription_no = Column(String(255), nullable=False)
    inpatient_id = Column(CHAR(36), ForeignKey("inpatients.id"), nullable=True)
    outpatient_id = Column(CHAR(36), ForeignKey("outpatients.id"), nullable=True)
    date_prescribed = Column(Date, nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    prescription_inpatient = relationship("Inpatient", primaryjoin="and_(Inpatient.id==Prescription.inpatient_id)", back_populates="inpatient_prescription")
    prescription_outpatient = relationship("Outpatient", primaryjoin="and_(Outpatient.id==Prescription.outpatient_id)", back_populates="outpatient_prescription")
    prescription_medicine_prescription = relationship("Medicine_prescription", primaryjoin="and_(Medicine_prescription.prescription_id==Prescription.id)", back_populates="medicine_prescription_prescription")
    prescription_medical_prescription = relationship("Medical_supplies_prescription", primaryjoin="and_(Medical_supplies_prescription.prescription_id==Prescription.id)", back_populates="medical_prescription_prescription")

class Medicine_prescription(Base):
    __tablename__ = "medicine_prescriptions"
    id = Column(CHAR(36), primary_key=True)
    medicine_prescription_no = Column(String(255), nullable=False)
    prescription_id = Column(CHAR(36), ForeignKey("prescriptions.id"), nullable=False)
    medicine_id = Column(CHAR(36), ForeignKey("medicines.id"), nullable=False)
    quantity= Column(Integer, nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    medicine_prescription_prescription = relationship("Prescription", primaryjoin="and_(Prescription.id==Medicine_prescription.prescription_id)", back_populates="prescription_medicine_prescription")
    medicine_prescription_medicine = relationship("Medicine", primaryjoin="and_(Medicine.id==Medicine_prescription.medicine_id)", back_populates="medicine_medicine_prescription")
    

class Medical_supplies_prescription(Base):
    __tablename__ = "medical_supplies_prescriptions"
    id = Column(CHAR(36), primary_key=True)
    medical_supply_prescription_no = Column(String(255), nullable=False)
    prescription_id = Column(CHAR(36), ForeignKey("prescriptions.id"), nullable=True)
    medical_supply_id = Column(CHAR(36), ForeignKey("medical_supplies.id"), nullable=True)
    quantity= Column(Integer, nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    medical_prescription_prescription = relationship("Prescription", primaryjoin="and_(Prescription.id==Medical_supplies_prescription.prescription_id)", back_populates="prescription_medical_prescription")
    medical_prescription_medical = relationship("Medical_supply", primaryjoin="and_(Medical_supply.id==Medical_supplies_prescription.medical_supply_id)", back_populates="medical_medical_prescription")

class Discharge(Base): #incomplete column
    __tablename__ = "discharges"
    id = Column(CHAR(36), primary_key=True)
    discharge_no = Column(String(255), nullable=False)
    inpatient_id = Column(CHAR(36), ForeignKey("inpatients.id"), nullable=False)
    discharge_date = Column(DateTime, nullable=False)
    discharge_diagnosis = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

class Outpatient(Base):
    __tablename__ = "outpatients"
    id = Column(CHAR(36), primary_key=True)
    outpatient_no = Column(String(255), nullable=False)
    patient_id = Column(CHAR(36), ForeignKey("patients.id"), nullable=True)
    walk_in_date = Column(Date, nullable=False)
    purpose =Column(String(255), nullable=False)
    tests = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")

    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    outpatient_patient = relationship("Patient", primaryjoin="and_(Patient.id==Outpatient.patient_id)", back_populates="patient_outpatient")
    outpatient_prescription = relationship("Prescription", primaryjoin="and_(Prescription.outpatient_id==Outpatient.id)", back_populates="prescription_outpatient")
    outpatient_lab_request = relationship("Lab_request", primaryjoin="and_(Lab_request.outpatient_id==Outpatient.id)", back_populates="lab_request_outpatient")
    outpatient_treatment = relationship("Treatment", primaryjoin="and_(Treatment.outpatient_id==Outpatient.id)", back_populates="treatment_outpatient")

class Discount_privilege(Base):
    __tablename__ = "Discount_privileges"
    id = Column(CHAR(36), primary_key=True)
    patient_id = Column(CHAR(36), ForeignKey("patients.id"), nullable=True)
    phil_health_id = Column(String(255), nullable=True)
    end_of_validity =Column(Date, nullable=True)
    senior_citizen_id = Column(String(255), nullable=True)
    municipality = Column(String(255), nullable=True)
    pwd_id = Column(String(255), nullable=True)
    type_of_disability = Column(String(255), nullable=True)
    status = Column(String(255), nullable=False, server_default="Active")

    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())


#Treatment

class Lab_test_type(Base):
    __tablename__ = "lab_test_types"    
    id = Column(CHAR(36), primary_key=True)
    name = Column(String(255),nullable=False,unique=True)
    description = Column(Text,nullable=False)
    fee = Column(Float,nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    lab_test_type_lab_request = relationship("Lab_request", primaryjoin="and_(Lab_request.lab_test_type_id==Lab_test_type.id)", back_populates="lab_request_lab_test_type")

class Lab_request(Base):
    __tablename__ = "lab_requests"    
    id = Column(CHAR(36), primary_key=True)
    lab_request_no = Column(String(255),nullable=False,unique=True)
    lab_test_type_id = Column(CHAR(36), ForeignKey("lab_test_types.id"),nullable=False)
    inpatient_id = Column(CHAR(36), ForeignKey("inpatients.id"),nullable=True)
    outpatient_id = Column(CHAR(36), ForeignKey("outpatients.id"),nullable=True)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    lab_request_lab_test_type = relationship("Lab_test_type", primaryjoin="and_(Lab_test_type.id==Lab_request.lab_test_type_id)", back_populates="lab_test_type_lab_request")
    lab_request_inpatient = relationship("Inpatient", primaryjoin="and_(Inpatient.id==Lab_request.inpatient_id)", back_populates="inpatient_lab_request")
    lab_request_outpatient = relationship("Outpatient", primaryjoin="and_(Outpatient.id==Lab_request.outpatient_id)", back_populates="outpatient_lab_request")
    lab_request_lab_result = relationship("Lab_result", primaryjoin="and_(Lab_result.lab_request_id==Lab_request.id)", back_populates="lab_result_lab_request")
    lab_request_request_bill = relationship("Lab_request_bill", primaryjoin="and_(Lab_request_bill.lab_request_id==Lab_request.id)", back_populates="request_bill_lab_request")
    out_request_out_request_payment = relationship("Outpatient_lab_request_payment", primaryjoin="and_(Outpatient_lab_request_payment.lab_request_id==Lab_request.id)", back_populates="out_request_payment_out_request")

class Lab_result(Base):
    __tablename__ = "lab_results"    
    id = Column(CHAR(36), primary_key=True)
    lab_result_no = Column(String(255), nullable=False)
    lab_request_id =  Column(CHAR(36), ForeignKey("lab_requests.id"), nullable=False)
    specimen = Column(String(255),nullable=False)
    result = Column(String(255),nullable=False)
    reference = Column(String(255),nullable=False)
    unit = Column(String(255),nullable=False)
    detailed_result = Column(Text,nullable=False)
    
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    lab_result_lab_request = relationship("Lab_request", primaryjoin="and_(Lab_request.id==Lab_result.lab_request_id)", back_populates="lab_request_lab_result")

class Treatment_type(Base):
    __tablename__ = "treatment_types"    
    id = Column(CHAR(36), primary_key=True)
    name = Column(String(255),nullable=False,unique=True)
    description = Column(Text,nullable=False)
    fee = Column(Float,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    treatment_type_treatment = relationship("Treatment", primaryjoin="and_(Treatment.treatment_type_id==Treatment_type.id)", back_populates="treatment_treatment_type")

class Treatment(Base):
    __tablename__ = "treatments"    
    id = Column(CHAR(36), primary_key=True)
    treatment_no = Column(String(255), nullable=False, unique=True)
    inpatient_id = Column(CHAR(36), ForeignKey("inpatients.id"),nullable=True)
    outpatient_id = Column(CHAR(36), ForeignKey("outpatients.id"),nullable=True)
    treatment_type_id = Column(CHAR(36), ForeignKey("treatment_types.id"), nullable=False)
    description = Column(Text,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")

    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    treatment_treatment_type = relationship("Treatment_type", primaryjoin="and_(Treatment_type.id==Treatment.treatment_type_id)", back_populates="treatment_type_treatment")
    treatment_inpatient = relationship("Inpatient", primaryjoin="and_(Inpatient.id==Treatment.inpatient_id)", back_populates="inpatient_treatment")
    treatment_outpatient = relationship("Outpatient", primaryjoin="and_(Outpatient.id==Treatment.outpatient_id)", back_populates="outpatient_treatment")
    treatment_treatment_in_charge = relationship("Treatment_in_charge", primaryjoin="and_(Treatment_in_charge.treatment_id==Treatment.id)", back_populates="treatment_in_charge_treatment")
    treatment_treatment_bill = relationship("Treatment_bill", primaryjoin="and_(Treatment_bill.treatment_id==Treatment.id)", back_populates="treatment_bill_treatment")
    out_treatment_out_treatment_payment = relationship("Outpatient_treatment_payment", primaryjoin="and_(Outpatient_treatment_payment.treatment_id==Treatment.id)", back_populates="out_treatment_payment_out_treatment")

class Treatment_in_charge(Base):
    __tablename__ = "treatment_in_charges"    
    id = Column(CHAR(36), primary_key=True)
    treatment_id = Column(CHAR(36), ForeignKey("treatments.id"),nullable=False)
    employee_id = Column(CHAR(36), ForeignKey("employees.id"),nullable=False)
    professional_fee = Column(Float,nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    treatment_in_charge_treatment = relationship("Treatment", primaryjoin="and_(Treatment.id==Treatment_in_charge.treatment_id)", back_populates="treatment_treatment_in_charge")
    treatment_in_charge_employee = relationship("Employee", primaryjoin="and_(Employee.id==Treatment_in_charge.employee_id)", back_populates="employee_treatment_in_charge")

class Surgery_type(Base):
    __tablename__ = "surgery_types"    
    id = Column(CHAR(36), primary_key=True)
    name = Column(String(255),nullable=False,unique=True)
    description = Column(Text,nullable=False)
    fee = Column(Float,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")

    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())
    
    surgery_type_surgery = relationship("Surgery", primaryjoin="and_(Surgery.surgery_type_id==Surgery_type.id)", back_populates="surgery_surgery_type")

class Surgery(Base):
    __tablename__ = "surgeries"    
    id = Column(CHAR(36), primary_key=True)
    surgery_no = Column(String(255),nullable=False,unique=True)
    inpatient_id = Column(CHAR(36), ForeignKey("inpatients.id"),nullable=False)
    start_time = Column(Time,nullable=False)
    end_time = Column(Time,nullable=False)
    surgery_type_id = Column(CHAR(36), ForeignKey("surgery_types.id"), nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    surgery_surgery_type = relationship("Surgery_type", primaryjoin="and_(Surgery_type.id==Surgery.surgery_type_id)", back_populates="surgery_type_surgery")
    surgery_inpatient = relationship("Inpatient", primaryjoin="and_(Inpatient.id==Surgery.inpatient_id)", back_populates="inpatient_surgery")
    surgery_surgery_in_charge = relationship("Surgery_in_charge", primaryjoin="and_(Surgery_in_charge.surgery_id==Surgery.id)", back_populates="surgery_in_charge_surgery")
    surgery_surgery_bill = relationship("Surgery_bill", primaryjoin="and_(Surgery_bill.surgery_id==Surgery.id)", back_populates="surgery_bill_surgery")

class Surgery_in_charge(Base):
    __tablename__ = "surgery_in_charges"    
    id = Column(CHAR(36), primary_key=True)
    surgery_id = Column(CHAR(36), ForeignKey("surgeries.id"),nullable=False)
    employee_id = Column(CHAR(36), ForeignKey("employees.id"),nullable=False)
    professional_fee = Column(Float,nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    surgery_in_charge_surgery = relationship("Surgery", primaryjoin="and_(Surgery.id==Surgery_in_charge.surgery_id)", back_populates="surgery_surgery_in_charge")
    surgery_in_charge_employee = relationship("Employee", primaryjoin="and_(Employee.id==Surgery_in_charge.employee_id)", back_populates="employee_surgery_in_charge")

#Pharmacy
class Medicine(Base):
    __tablename__ = "medicines"    
    id = Column(CHAR(36), primary_key=True)
    med_product_name = Column(String(255), nullable=False)
    med_quantity = Column(Integer,nullable=False)
    med_manufactured_date = Column(Date,nullable=False)
    med_import_date = Column(Date,nullable=False)
    med_expiration_date = Column(Date,nullable=False)
    med_manufacturer = Column(String(255), nullable=False)
    med_batch_number = Column(Integer,nullable=False)
    med_unit_price = Column(Float,nullable=False)
    med_tax = Column(Float,nullable=False)
    med_purpose = Column(Text,nullable=False)
    dosage = Column(String(255),nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    medicine_medicine_prescription = relationship("Medicine_prescription", primaryjoin="and_(Medicine_prescription.medicine_id==Medicine.id)", back_populates="medicine_prescription_medicine")

class Medical_supply(Base):
    __tablename__ = "medical_supplies"    
    id = Column(CHAR(36), primary_key=True)
    ms_product_name= Column(String(255), nullable=False)
    ms_quantity = Column(Integer,nullable=False)
    ms_manufactured_date = Column(Date,nullable=False)
    ms_import_date = Column(Date,nullable=False)
    ms_expire_date = Column(Date,nullable=False)
    ms_manufacturer = Column(String(255), nullable=False)
    ms_batch_number = Column(Integer,nullable=False)
    ms_unit_price = Column(Float,nullable=False)
    ms_tax = Column(Float,nullable=False)
    ms_purpose = Column(Text,nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    medical_medical_prescription = relationship("Medical_supplies_prescription", primaryjoin="and_(Medical_supplies_prescription.medical_supply_id==Medical_supply.id)", back_populates="medical_prescription_medical")

class Prescription_bill(Base):
    __tablename__ = "prescription_bills"    
    id = Column(CHAR(36), primary_key=True)
    prescription_bill_no= Column(String(255), nullable=False)
    inpatient_bill_id = Column(CHAR(36), ForeignKey("inpatient_bills.id"),nullable=False)
    inpatient_id = Column(CHAR(36), ForeignKey("inpatients.id"),nullable=False)
    billing_date = Column(Date,nullable=False)
    medicine_amount = Column(Float,nullable=False)
    medical_amount = Column(Float,nullable=False) 
    sub_total = Column(Float,nullable=False)
    total_amount = Column(Float,nullable=False)
    status = Column(String(255), nullable=False, server_default="Pending")

    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    prescription_bill_inpatient_bill = relationship("Inpatient_bill", primaryjoin="and_(Inpatient_bill.id==Prescription_bill.inpatient_bill_id)", back_populates="inpatient_bill_prescription_bill")
    prescription_bill_inpatient = relationship("Inpatient", primaryjoin="and_(Inpatient.id==Prescription_bill.inpatient_id)", back_populates="inpatient_prescription_bill")
    in_prescription_bill_in_prescription_payment = relationship("Inpatient_prescription_payment", primaryjoin="and_(Inpatient_prescription_payment.prescription_bill_id==Prescription_bill.id)", back_populates="in_prescription_payment_in_prescription_bill")

class Sales(Base):
    __tablename__ = "sales"    
    id = Column(CHAR(36), primary_key=True)
    product_name = Column(String(255), nullable=False)
    date = Column(Date,nullable=False)
    gross_margin = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")

    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

#Procurement
  
class Vendor(Base):
    __tablename__ = "vendors"    
    id = Column(CHAR(36), primary_key=True)
    vendor_name= Column(String(255),unique=True, nullable=False)
    region= Column(String(255), nullable=False)
    city= Column(String(255), nullable=False)
    street= Column(String(255), nullable=False)
    industry= Column(String(255),unique=True, nullable=False)
    contact_person= Column(String(255), nullable=False)
    contact_number= Column(String(255), nullable=False)
    email= Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    blacklist_reason = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    vendor_request_quotation = relationship("Request_quotation", primaryjoin="and_(Request_quotation.vendor_id==Vendor.id)", back_populates="request_quotation_vendor")
    vendor_vendor_proposal = relationship("Vendor_proposal", primaryjoin="and_(Vendor_proposal.created_by==Vendor.id)", back_populates="vendor_proposal_vendor")
    vendor_order_vendor_bill= relationship("Purchase_order_vendor_bill", primaryjoin="and_(Purchase_order_vendor_bill.vendor_id==Vendor.id)", back_populates="order_vendor_bill_vendor")

class Product_category(Base):
    __tablename__ = "product_categories"    
    id = Column(CHAR(36), primary_key=True)
    category_name= Column(String(255),unique=True, nullable=False)
    description= Column(Text, nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    product_category_product = relationship("Product", primaryjoin="and_(Product.product_category_id==Product_category.id)", back_populates="product_product_category")

class Product(Base):
    __tablename__ = "products"    
    id = Column(CHAR(36), primary_key=True)
    product_category_id= Column(CHAR(36), ForeignKey("product_categories.id"),nullable=False)
    product_pic = Column(String(255), nullable=False)
    product_name = Column(String(255), nullable=False)
    product_details = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    product_product_category = relationship("Product_category", primaryjoin="and_(Product_category.id==Product.product_category_id)", back_populates="product_category_product")
    product_requisition_detail = relationship("Purchase_requisition_detail", primaryjoin="and_(Purchase_requisition_detail.product_id==Product.id)", back_populates="requisition_detail_product")

class Purchase_requisition(Base):
    __tablename__ = "purchase_requisitions"    
    id = Column(CHAR(36), primary_key=True)
    purchase_requisition_number= Column(String(255),unique=True, nullable=False)
    purpose= Column(Text, nullable=False)
    date_requested = Column(Date,nullable=False)
    department_id = Column(CHAR(36), ForeignKey("departments.id"),nullable=False)
    approved_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    reason= Column(Text, nullable=True)
    status = Column(String(255), nullable=False, server_default="Pending")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())
    
    requisition_requisition_detail = relationship("Purchase_requisition_detail", primaryjoin="and_(Purchase_requisition_detail.purchase_requisition_id==Purchase_requisition.id)", back_populates="requisition_detail_requisition")

class Purchase_requisition_detail(Base):
    __tablename__ = "purchase_requisition_details"    
    id = Column(CHAR(36), primary_key=True)
    purchase_requisition_id = Column(CHAR(36), ForeignKey("purchase_requisitions.id"), nullable=False)
    new_product_category =  Column(String(255), nullable=False)
    new_product_name =  Column(String(255), nullable=False)
    product_id = Column(CHAR(36), ForeignKey("products.id"), nullable=False)
    quantity= Column(Integer, nullable=False)
    description = Column(TEXT, nullable=True, index=True)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    requisition_detail_requisition = relationship("Purchase_requisition", primaryjoin="and_(Purchase_requisition.id==Purchase_requisition_detail.purchase_requisition_id)", back_populates="requisition_requisition_detail")
    requisition_detail_product = relationship("Product", primaryjoin="and_(Product.id==Purchase_requisition_detail.product_id)", back_populates="product_requisition_detail")

class Request_quotation(Base):
    __tablename__ = "request_quotations"    
    id = Column(CHAR(36), primary_key=True)
    request_quotation_number= Column(String(255),unique=True, nullable=False)
    vendor_id = Column(CHAR(36), ForeignKey("vendors.id"),nullable=False)
    purchase_requisition_id = Column(CHAR(36), ForeignKey("purchase_requisitions.id"), nullable=False)
    message= Column(Text, nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    request_quotation_vendor = relationship("Vendor", primaryjoin="and_(Vendor.id==Request_quotation.vendor_id)", back_populates="vendor_request_quotation")
    quotation_vendor_proposal = relationship("Vendor_proposal", primaryjoin="and_(Vendor_proposal.request_quotation_id==Request_quotation.id)", back_populates="vendor_proposal_quotation")

class Vendor_proposal(Base):
    __tablename__ = "vendor_proposals"

    id = Column(CHAR(36), primary_key=True)
    subtotal = Column(String(255), nullable=True, index=True)
    discount = Column(Float, nullable=True, index=True)
    tax = Column(Float, nullable=True, index=True)
    total_amount = Column(String(255), nullable=True, index=True)
    message = Column(TEXT, nullable=True, index=True)
    status = Column(String(255), nullable=True, index=True,default="active")
    request_quotation_id = Column(CHAR(36), ForeignKey("request_quotations.id"), nullable=True)

    created_by = Column(String(255), ForeignKey("vendors.id"), nullable=True)
    updated_by = Column(String(255), ForeignKey("vendors.id"), nullable=True)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    vendor_proposal_vendor = relationship("Vendor", primaryjoin="and_(Vendor.id==Vendor_proposal.created_by)", back_populates="vendor_vendor_proposal")
    vendor_proposal_quotation = relationship("Request_quotation", primaryjoin="and_(Request_quotation.id==Vendor_proposal.request_quotation_id)", back_populates="quotation_vendor_proposal")
    vendor_proposal_bidding = relationship("Vendor_bidding_item", primaryjoin="and_(Vendor_bidding_item.vendor_proposal_id==Vendor_proposal.id)", back_populates="bidding_vendor_proposal")

class Vendor_bidding_item(Base):
    __tablename__ = "vendor_bidding_items"

    id = Column(CHAR(36), primary_key=True)
    product_name = Column(String(255), nullable=True, index=True)
    quantity = Column(Integer, nullable=True, index=True)
    product_category = Column(String(255), nullable=True, index=True)
    product_bidding_price = Column(String(255), nullable=True, index=True)
    total_cost = Column(String(255), nullable=True, index=True)
    description = Column(TEXT, nullable=True, index=True)
    status = Column(String(255), nullable=True, index=True,default="active")
    # relation with vendor proposal
    vendor_proposal_id = Column(CHAR(36), ForeignKey("vendor_proposals.id"), nullable=True)
    bidding_vendor_proposal = relationship("Vendor_proposal", primaryjoin="and_(Vendor_proposal.id==Vendor_bidding_item.vendor_proposal_id)", back_populates="vendor_proposal_bidding")
    bidding_purchase_order = relationship("Purchase_order", primaryjoin="and_(Purchase_order.vendor_bidding_item_id==Vendor_bidding_item.id)", back_populates="purchase_order_bidding")

    
class Purchase_order(Base):
    __tablename__ = "purchase_orders"    
    id = Column(CHAR(36), primary_key=True)
    purchase_order_number = Column(String(255), nullable=False, unique=True)
    vendor_bidding_item_id = Column(CHAR(36), ForeignKey("vendor_bidding_items.id"), nullable=True)
    order_date = Column(Date, nullable=False)
    expected_delivery_date = Column(Date, nullable=False)
    payment_method = Column(String(255), nullable=False)
    shipping_method = Column(String(255), nullable=False)
    notes = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    purchase_order_bidding = relationship("Vendor_bidding_item", primaryjoin="and_(Vendor_bidding_item.id==Purchase_order.vendor_bidding_item_id)", back_populates="bidding_purchase_order")
    purchase_order_order_detail  = relationship("Purchase_order_detail", primaryjoin="and_(Purchase_order_detail.purchase_order_id==Purchase_order.id)", back_populates="order_detail_purchase_order")
    purchase_order_order_bill = relationship("Purchase_order_bill", primaryjoin="and_(Purchase_order_bill.purchase_order_id==Purchase_order.id)", back_populates="order_bill_purchase_order")

class Purchase_order_detail(Base):
    __tablename__ = "purchase_order_details"    
    id = Column(CHAR(36), primary_key=True)
    purchase_order_id = Column(CHAR(36), ForeignKey("purchase_orders.id"), nullable=False)
    product_name = Column(String(255), nullable=False)
    product_category = Column(String(255), nullable=True, index=True)
    quantity= Column(Integer, nullable=False)
    product_price= Column(Float, nullable=False)
    total_cost= Column(Float, nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    order_detail_purchase_order = relationship("Purchase_order", primaryjoin="and_(Purchase_order.id==Purchase_order_detail.purchase_order_id)", back_populates="purchase_order_order_detail")

#AP & AR
class Inpatient_bill(Base):
    __tablename__ = "inpatient_bills"    
    id = Column(CHAR(36), primary_key=True)
    inpatient_id = Column(CHAR(36), ForeignKey("inpatients.id"), nullable=False)
    inpatient_bill_no = Column(String(255), nullable=False, unique=True)
    total_professional_fee= Column(Float, nullable=False)
    total_lab_test_fee= Column(Float, nullable=False)
    total_prescription_fee= Column(Float, nullable=False)
    total_treatment_fee= Column(Float, nullable=False)
    total_surgery_fee= Column(Float, nullable=False)
    total_room_fee= Column(Float, nullable=False)
    total_discounts= Column(Float, nullable=False)
    total_bill= Column(Float, nullable=False)
    remaining_balance = Column(Float, nullable=False, server_default="0") #add column
    date_of_billing = Column(Date,nullable=False)
    due_date = Column(Date,nullable=False)
    status = Column(String(255), nullable=False, server_default="Pending")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    inpatient_bill_inpatient = relationship("Inpatient", primaryjoin="and_(Inpatient.id==Inpatient_bill.inpatient_id)", back_populates="inpatient_inpatient_bill")
    inpatient_bill_request_bill = relationship("Lab_request_bill", primaryjoin="and_(Lab_request_bill.inpatient_bill_id==Inpatient_bill.id)", back_populates="request_bill_inpatient_bill")
    inpatient_bill_prescription_bill = relationship("Prescription_bill", primaryjoin="and_(Prescription_bill.inpatient_bill_id==Inpatient_bill.id)", back_populates="prescription_bill_inpatient_bill")
    inpatient_bill_treatment_bill = relationship("Treatment_bill", primaryjoin="and_(Treatment_bill.inpatient_bill_id==Inpatient_bill.id)", back_populates="treatment_bill_inpatient_bill")
    inpatient_bill_surgery_bill = relationship("Surgery_bill", primaryjoin="and_(Surgery_bill.inpatient_bill_id==Inpatient_bill.id)", back_populates="surgery_bill_inpatient_bill")
    inpatient_bill_room_bill = relationship("Room_bill", primaryjoin="and_(Room_bill.inpatient_bill_id==Inpatient_bill.id)", back_populates="room_bill_inpatient_bill")
    inpatient_bill_inpatient_payment = relationship("Inpatient_payment", primaryjoin="and_(Inpatient_payment.inpatient_bill_id==Inpatient_bill.id)", back_populates="inpatient_payment_inpatient_bill")

class Lab_request_bill(Base):
    __tablename__ = "lab_request_bills"    
    id = Column(CHAR(36), primary_key=True)
    lab_request_bill_no = Column(String(255), nullable=False, unique=True)
    lab_request_id = Column(CHAR(36), ForeignKey("lab_requests.id"), nullable=False)
    inpatient_bill_id = Column(CHAR(36), ForeignKey("inpatient_bills.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(255), nullable=False, server_default="Pending")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    request_bill_lab_request = relationship("Lab_request", primaryjoin="and_(Lab_request.id==Lab_request_bill.lab_request_id)", back_populates="lab_request_request_bill")
    request_bill_inpatient_bill = relationship("Inpatient_bill", primaryjoin="and_(Inpatient_bill.id==Lab_request_bill.inpatient_bill_id)", back_populates="inpatient_bill_request_bill")
    in_request_bill_in_request_payment = relationship("Inpatient_lab_request_payment", primaryjoin="and_(Inpatient_lab_request_payment.lab_request_bill_id==Lab_request_bill.id)", back_populates="in_request_payment_in_request_bill")

class Treatment_bill(Base):
    __tablename__ = "treatment_bills"    
    id = Column(CHAR(36), primary_key=True)
    treatment_bill_no = Column(String(255), nullable=False, unique=True)
    treatment_id = Column(CHAR(36), ForeignKey("treatments.id"), nullable=False)
    inpatient_bill_id = Column(CHAR(36), ForeignKey("inpatient_bills.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(255), nullable=False, server_default="Pending")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    treatment_bill_treatment = relationship("Treatment", primaryjoin="and_(Treatment.id==Treatment_bill.treatment_id)", back_populates="treatment_treatment_bill")
    treatment_bill_inpatient_bill = relationship("Inpatient_bill", primaryjoin="and_(Inpatient_bill.id==Treatment_bill.inpatient_bill_id)", back_populates="inpatient_bill_treatment_bill")
    in_treatment_bill_in_treatment_payment = relationship("Inpatient_treatment_payment", primaryjoin="and_(Inpatient_treatment_payment.treatment_bill_id==Treatment_bill.id)", back_populates="in_treatment_payment_in_treatment_bill")

class Surgery_bill(Base):
    __tablename__ = "surgery_bills"    
    id = Column(CHAR(36), primary_key=True)
    surgery_bill_no = Column(String(255), nullable=False, unique=True)
    surgery_id = Column(CHAR(36), ForeignKey("surgeries.id"), nullable=False)
    inpatient_bill_id = Column(CHAR(36), ForeignKey("inpatient_bills.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(255), nullable=False, server_default="Pending")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    surgery_bill_surgery = relationship("Surgery", primaryjoin="and_(Surgery.id==Surgery_bill.surgery_id)", back_populates="surgery_surgery_bill")
    surgery_bill_inpatient_bill = relationship("Inpatient_bill", primaryjoin="and_(Inpatient_bill.id==Surgery_bill.inpatient_bill_id)", back_populates="inpatient_bill_surgery_bill")
    in_surgery_bill_in_surgery_payment = relationship("Inpatient_surgery_payment", primaryjoin="and_(Inpatient_surgery_payment.surgery_bill_id==Surgery_bill.id)", back_populates="in_surgery_payment_in_surgery_bill")

class Room_bill(Base):
    __tablename__ = "room_bills"    
    id = Column(CHAR(36), primary_key=True)
    room_bill_no = Column(String(255), nullable=False, unique=True)
    room_admission_id = Column(CHAR(36), ForeignKey("room_admissions.id"), nullable=False)
    inpatient_bill_id = Column(CHAR(36), ForeignKey("inpatient_bills.id"), nullable=False)
    no_of_days = Column(Integer, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(255), nullable=False, server_default="Pending")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    room_bill_room_admission = relationship("Room_admission", primaryjoin="and_(Room_admission.id==Room_bill.room_admission_id)", back_populates="room_admission_room_bill")
    room_bill_inpatient_bill = relationship("Inpatient_bill", primaryjoin="and_(Inpatient_bill.id==Room_bill.inpatient_bill_id)", back_populates="inpatient_bill_room_bill") 
    in_room_bill_in_room_payment = relationship("Inpatient_room_payment", primaryjoin="and_(Inpatient_room_payment.room_bill_id==Room_bill.id)", back_populates="in_room_payment_in_room_bill")

class  Purchase_order_vendor_bill(Base):
    __tablename__ = "purchase_order_vendor_bills"    
    id = Column(CHAR(36), primary_key=True)
    purchase_order_vendor_bill_no = Column(String(255), nullable=False, unique=True)
    vendor_id = Column(CHAR(36), ForeignKey("vendors.id"), nullable=False)
    total_vendor_bill = Column(Float, nullable=False)
    date_of_billing = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    remaining_balance = Column(Float, nullable=False)
    status = Column(String(255), nullable=False, server_default="Pending")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    order_vendor_bill_vendor = relationship("Vendor", primaryjoin="and_(Vendor.id==Purchase_order_vendor_bill.vendor_id)", back_populates="vendor_order_vendor_bill")
    order_vendor_bill_order_bill = relationship("Purchase_order_bill", primaryjoin="and_(Purchase_order_bill.purchase_order_vendor_bill_id==Purchase_order_vendor_bill.id)", back_populates="order_bill_order_vendor_bill")
    order_vendor_bill_order_vendor_payment = relationship("Purchase_order_vendor_payment", primaryjoin="and_(Purchase_order_vendor_payment.purchase_order_vendor_bill_id==Purchase_order_vendor_bill.id)", back_populates="order_vendor_payment_order_vendor_bill")

class  Purchase_order_bill(Base):
    __tablename__ = "purchase_order_bills"    
    id = Column(CHAR(36), primary_key=True)
    purchase_order_bill_no = Column(String(255), nullable=False, unique=True)
    purchase_order_vendor_bill_id = Column(CHAR(36), ForeignKey("purchase_order_vendor_bills.id"), nullable=False)
    purchase_order_id = Column(CHAR(36), ForeignKey("purchase_orders.id"), nullable=False)
    total_bill = Column(Float, nullable=False)
    status = Column(String(255), nullable=False, server_default="Pending")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    order_bill_order_vendor_bill = relationship("Purchase_order_vendor_bill", primaryjoin="and_(Purchase_order_vendor_bill.id==Purchase_order_bill.purchase_order_vendor_bill_id)", back_populates="order_vendor_bill_order_bill")
    order_bill_purchase_order = relationship("Purchase_order", primaryjoin="and_(Purchase_order.id==Purchase_order_bill.purchase_order_id)", back_populates="purchase_order_order_bill")
    order_bill_order_payment = relationship("Purchase_order_payment", primaryjoin="and_(Purchase_order_payment.purchase_order_bill_id==Purchase_order_bill.id)", back_populates="order_payment_order_bill")

#CMS
class Payment_method(Base):
    __tablename__ = "payment_methods"    
    id = Column(CHAR(36), primary_key=True)
    method_name = Column(String(255),nullable=False,unique=True)
    description = Column(Text,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    method_in_request_payment= relationship("Inpatient_lab_request_payment", primaryjoin="and_(Inpatient_lab_request_payment.payment_method_id==Payment_method.id)", back_populates="in_request_payment_method")
    method_in_prescription_payment = relationship("Inpatient_prescription_payment", primaryjoin="and_(Inpatient_prescription_payment.payment_method_id==Payment_method.id)", back_populates="in_prescription_payment_method")
    method_in_treatment_payment = relationship("Inpatient_treatment_payment", primaryjoin="and_(Inpatient_treatment_payment.payment_method_id==Payment_method.id)", back_populates="in_treatment_payment_method") 
    method_in_surgery_payment = relationship("Inpatient_surgery_payment", primaryjoin="and_(Inpatient_surgery_payment.payment_method_id==Payment_method.id)", back_populates="in_surgery_payment_method") 
    method_in_room_payment = relationship("Inpatient_room_payment", primaryjoin="and_(Inpatient_room_payment.payment_method_id==Payment_method.id)", back_populates="in_room_payment_method")
    method_out_request_payment = relationship("Outpatient_lab_request_payment", primaryjoin="and_(Outpatient_lab_request_payment.payment_method_id==Payment_method.id)", back_populates="out_request_payment_method")
    method_out_treatment_payment = relationship("Outpatient_treatment_payment", primaryjoin="and_(Outpatient_treatment_payment.payment_method_id==Payment_method.id)", back_populates="out_treatment_payment_method")
    method_order_payment = relationship("Purchase_order_payment", primaryjoin="and_(Purchase_order_payment.payment_method_id==Payment_method.id)", back_populates="order_payment_method")
    method_in_payment = relationship("Inpatient_payment", primaryjoin="and_(Inpatient_payment.payment_method_id==Payment_method.id)", back_populates="in_payment_method")
    method_order_vendor_payment = relationship("Purchase_order_vendor_payment", primaryjoin="and_(Purchase_order_vendor_payment.payment_method_id==Payment_method.id)", back_populates="order_vendor_payment_method")

class Payment_term(Base):
    __tablename__ = "payment_terms"    
    id = Column(CHAR(36), primary_key=True)
    term_name = Column(String(255),nullable=False,unique=True)
    description = Column(Text,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    payment_term_inpatient_payment = relationship("Inpatient_payment", primaryjoin="and_(Inpatient_payment.payment_term_id==Payment_term.id)", back_populates="inpatient_payment_payment_term")
    term_out_request_payment = relationship("Outpatient_lab_request_payment", primaryjoin="and_(Outpatient_lab_request_payment.payment_term_id==Payment_term.id)", back_populates="out_request_payment_term")
    term_out_treatment_payment = relationship("Outpatient_treatment_payment", primaryjoin="and_(Outpatient_treatment_payment.payment_term_id==Payment_term.id)", back_populates="out_treatment_payment_term")
    payment_term_order_vendor_payment = relationship("Purchase_order_vendor_payment", primaryjoin="and_(Purchase_order_vendor_payment.payment_term_id==Payment_term.id)", back_populates="order_vendor_payment_payment_term")

class Patient_cash_payment(Base):
    __tablename__ = "patient_cash_payments"    
    id = Column(CHAR(36), primary_key=True)
    cash_payment_no = Column(String(255),nullable=False,unique=True)
    amount = Column(Float,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    patient_cash_in_request_payment = relationship("Inpatient_lab_request_payment", primaryjoin="and_(Inpatient_lab_request_payment.patient_cash_payment_id==Patient_cash_payment.id)", back_populates="in_request_payment_patient_cash")
    patient_cash_in_prescription_payment = relationship("Inpatient_prescription_payment", primaryjoin="and_(Inpatient_prescription_payment.patient_cash_payment_id==Patient_cash_payment.id)", back_populates="in_prescription_payment_patient_cash")
    patient_cash_in_treatment_payment = relationship("Inpatient_treatment_payment", primaryjoin="and_(Inpatient_treatment_payment.patient_cash_payment_id==Patient_cash_payment.id)", back_populates="in_treatment_payment_patient_cash")
    patient_cash_in_surgery_payment = relationship("Inpatient_surgery_payment", primaryjoin="and_(Inpatient_surgery_payment.patient_cash_payment_id==Patient_cash_payment.id)", back_populates="in_surgery_payment_patient_cash")
    patient_cash_in_room_payment = relationship("Inpatient_room_payment", primaryjoin="and_(Inpatient_room_payment.patient_cash_payment_id==Patient_cash_payment.id)", back_populates="in_room_payment_patient_cash")
    patient_cash_out_request_payment = relationship("Outpatient_lab_request_payment", primaryjoin="and_(Outpatient_lab_request_payment.patient_cash_payment_id==Patient_cash_payment.id)", back_populates="out_request_payment_patient_cash")
    patient_cash_out_treatment_payment = relationship("Outpatient_treatment_payment", primaryjoin="and_(Outpatient_treatment_payment.patient_cash_payment_id==Patient_cash_payment.id)", back_populates="out_treatment_payment_patient_cash")
    patient_cash_in_payment = relationship("Inpatient_payment", primaryjoin="and_(Inpatient_payment.patient_cash_payment_id==Patient_cash_payment.id)", back_populates="in_payment_patient_cash")

class Patient_check_payment(Base):
    __tablename__ = "patient_check_payments"    
    id = Column(CHAR(36), primary_key=True)
    check_no = Column(String(255), nullable=False, unique=True)
    check_date = Column(Date, nullable=False)
    account_name = Column(String(255), nullable=False)
    account_no = Column(String(255), nullable=False)
    rt_number = Column(String(255), nullable=False, unique=True)
    payee_name = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    bank_name = Column(String(255), nullable=False)
    bank_address = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    check_status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    patient_check_in_request_payment = relationship("Inpatient_lab_request_payment", primaryjoin="and_(Inpatient_lab_request_payment.patient_check_payment_id==Patient_check_payment.id)", back_populates="in_request_payment_patient_check")
    patient_check_in_prescription_payment = relationship("Inpatient_prescription_payment", primaryjoin="and_(Inpatient_prescription_payment.patient_check_payment_id==Patient_check_payment.id)", back_populates="in_prescription_payment_patient_check")
    patient_check_in_treatment_payment = relationship("Inpatient_treatment_payment", primaryjoin="and_(Inpatient_treatment_payment.patient_check_payment_id==Patient_check_payment.id)", back_populates="in_treatment_payment_patient_check")
    patient_check_in_surgery_payment = relationship("Inpatient_surgery_payment", primaryjoin="and_(Inpatient_surgery_payment.patient_check_payment_id==Patient_check_payment.id)", back_populates="in_surgery_payment_patient_check")
    patient_check_in_room_payment = relationship("Inpatient_room_payment", primaryjoin="and_(Inpatient_room_payment.patient_check_payment_id==Patient_check_payment.id)", back_populates="in_room_payment_patient_check")
    patient_check_out_request_payment = relationship("Outpatient_lab_request_payment", primaryjoin="and_(Outpatient_lab_request_payment.patient_check_payment_id==Patient_check_payment.id)", back_populates="out_request_payment_patient_check")
    patient_check_out_treatment_payment = relationship("Outpatient_treatment_payment", primaryjoin="and_(Outpatient_treatment_payment.patient_check_payment_id==Patient_check_payment.id)", back_populates="out_treatment_payment_patient_check")
    patient_check_in_payment = relationship("Inpatient_payment", primaryjoin="and_(Inpatient_payment.patient_check_payment_id==Patient_check_payment.id)", back_populates="in_payment_patient_check")

class Hospital_cash_payment(Base):
    __tablename__ = "hospital_cash_payments"    
    id = Column(CHAR(36), primary_key=True)
    cash_payment_no = Column(String(255),nullable=False,unique=True)
    amount = Column(Float,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    hospital_cash_order_vendor_payment = relationship("Purchase_order_vendor_payment", primaryjoin="and_(Purchase_order_vendor_payment.hospital_cash_payment_id==Hospital_cash_payment.id)", back_populates="order_vendor_payment_hospital_cash")
    hospital_cash_order_payment = relationship("Purchase_order_payment", primaryjoin="and_(Purchase_order_payment.hospital_cash_payment_id==Hospital_cash_payment.id)", back_populates="order_payment_hospital_cash")

class Hospital_check_payment(Base):
    __tablename__ = "hospital_check_payments"    
    id = Column(CHAR(36), primary_key=True)
    check_no = Column(String(255), nullable=False, unique=True)
    check_date = Column(Date, nullable=False)
    account_name = Column(String(255), nullable=False)
    account_no = Column(String(255), nullable=False)
    rt_number = Column(String(255), nullable=False, unique=True)
    payee_name = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    bank_name = Column(String(255), nullable=False)
    bank_address = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    check_status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())   

    hospital_check_order_vendor_payment = relationship("Purchase_order_vendor_payment", primaryjoin="and_(Purchase_order_vendor_payment.hospital_check_payment_id==Hospital_check_payment.id)", back_populates="order_vendor_payment_hospital_check")
    hospital_check_order_payment = relationship("Purchase_order_payment", primaryjoin="and_(Purchase_order_payment.hospital_check_payment_id==Hospital_check_payment.id)", back_populates="order_payment_hospital_check")

class Inpatient_payment(Base):
    __tablename__ = "inpatient_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    inpatient_bill_id = Column(CHAR(36), ForeignKey("inpatient_bills.id"), nullable=False)
    total_amount_paid = Column(Float,nullable=False)
    payment_term_id = Column(CHAR(36), ForeignKey("payment_terms.id"), nullable=False)
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    patient_cash_payment_id = Column(CHAR(36), ForeignKey("patient_cash_payments.id"),nullable=True)
    patient_check_payment_id = Column(CHAR(36), ForeignKey("patient_check_payments.id"),nullable=True)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_methods.id"),nullable=False)
     
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    inpatient_payment_inpatient_bill = relationship("Inpatient_bill", primaryjoin="and_(Inpatient_bill.id==Inpatient_payment.inpatient_bill_id)", back_populates="inpatient_bill_inpatient_payment")
    inpatient_payment_payment_term = relationship("Payment_term", primaryjoin="and_(Payment_term.id==Inpatient_payment.payment_term_id)", back_populates="payment_term_inpatient_payment")
    in_payment_in_request_payment = relationship("Inpatient_lab_request_payment", primaryjoin="and_(Inpatient_lab_request_payment.inpatient_payment_id==Inpatient_payment.id)", back_populates="in_request_payment_in_payment")
    in_payment_in_prescription_payment = relationship("Inpatient_prescription_payment", primaryjoin="and_(Inpatient_prescription_payment.inpatient_payment_id==Inpatient_payment.id)", back_populates="in_prescription_payment_in_payment")
    in_payment_in_treatment_payment = relationship("Inpatient_treatment_payment", primaryjoin="and_(Inpatient_treatment_payment.inpatient_payment_id==Inpatient_payment.id)", back_populates="in_treatment_payment_in_payment")
    in_payment_in_surgery_payment = relationship("Inpatient_surgery_payment", primaryjoin="and_(Inpatient_surgery_payment.inpatient_payment_id==Inpatient_payment.id)", back_populates="in_surgery_payment_in_payment")
    in_payment_in_room_payment = relationship("Inpatient_room_payment", primaryjoin="and_(Inpatient_room_payment.inpatient_payment_id==Inpatient_payment.id)", back_populates="in_room_payment_in_payment")
    
    in_payment_patient_cash = relationship("Patient_cash_payment", primaryjoin="and_(Patient_cash_payment.id==Inpatient_payment.patient_cash_payment_id)", back_populates="patient_cash_in_payment")
    in_payment_patient_check = relationship("Patient_check_payment", primaryjoin="and_(Patient_check_payment.id==Inpatient_payment.patient_check_payment_id)", back_populates="patient_check_in_payment")
    in_payment_method = relationship("Payment_method", primaryjoin="and_(Payment_method.id==Inpatient_payment.payment_method_id)", back_populates="method_in_payment")

class Inpatient_lab_request_payment(Base):
    __tablename__ = "inpatient_lab_request_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    lab_request_bill_id = Column(CHAR(36), ForeignKey("lab_request_bills.id"), nullable=False)
    inpatient_payment_id = Column(CHAR(36), ForeignKey("inpatient_payments.id"),nullable=False)
    patient_cash_payment_id = Column(CHAR(36), ForeignKey("patient_cash_payments.id"),nullable=True)
    patient_check_payment_id = Column(CHAR(36), ForeignKey("patient_check_payments.id"),nullable=True)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_methods.id"),nullable=False)
    amount_paid = Column(Float,nullable=False)
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    in_request_payment_in_request_bill = relationship("Lab_request_bill", primaryjoin="and_(Lab_request_bill.id==Inpatient_lab_request_payment.lab_request_bill_id)", back_populates="in_request_bill_in_request_payment")
    in_request_payment_in_payment = relationship("Inpatient_payment", primaryjoin="and_(Inpatient_payment.id==Inpatient_lab_request_payment.inpatient_payment_id)", back_populates="in_payment_in_request_payment")
    in_request_payment_patient_cash = relationship("Patient_cash_payment", primaryjoin="and_(Patient_cash_payment.id==Inpatient_lab_request_payment.patient_cash_payment_id)", back_populates="patient_cash_in_request_payment")
    in_request_payment_patient_check = relationship("Patient_check_payment", primaryjoin="and_(Patient_check_payment.id==Inpatient_lab_request_payment.patient_check_payment_id)", back_populates="patient_check_in_request_payment")
    in_request_payment_method = relationship("Payment_method", primaryjoin="and_(Payment_method.id==Inpatient_lab_request_payment.payment_method_id)", back_populates="method_in_request_payment")


class Inpatient_prescription_payment(Base):
    __tablename__ = "inpatient_prescription_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    prescription_bill_id = Column(CHAR(36), ForeignKey("prescription_bills.id"), nullable=False)
    inpatient_payment_id = Column(CHAR(36), ForeignKey("inpatient_payments.id"), nullable=False)
    patient_cash_payment_id = Column(CHAR(36), ForeignKey("patient_cash_payments.id"),nullable=True)
    patient_check_payment_id = Column(CHAR(36), ForeignKey("patient_check_payments.id"),nullable=True)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_methods.id"), nullable=False)
    amount_paid = Column(Float,nullable=False)
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    in_prescription_payment_in_prescription_bill = relationship("Prescription_bill", primaryjoin="and_(Prescription_bill.id==Inpatient_prescription_payment.prescription_bill_id)", back_populates="in_prescription_bill_in_prescription_payment")
    in_prescription_payment_in_payment = relationship("Inpatient_payment", primaryjoin="and_(Inpatient_payment.id==Inpatient_prescription_payment.inpatient_payment_id)", back_populates="in_payment_in_prescription_payment")
    in_prescription_payment_patient_cash = relationship("Patient_cash_payment", primaryjoin="and_(Patient_cash_payment.id==Inpatient_prescription_payment.patient_cash_payment_id)", back_populates="patient_cash_in_prescription_payment")
    in_prescription_payment_patient_check = relationship("Patient_check_payment", primaryjoin="and_(Patient_check_payment.id==Inpatient_prescription_payment.patient_check_payment_id)", back_populates="patient_check_in_prescription_payment")
    in_prescription_payment_method = relationship("Payment_method", primaryjoin="and_(Payment_method.id==Inpatient_prescription_payment.payment_method_id)", back_populates="method_in_prescription_payment")

class Inpatient_treatment_payment(Base):
    __tablename__ = "inpatient_treatment_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    treatment_bill_id = Column(CHAR(36), ForeignKey("treatment_bills.id"), nullable=False)
    inpatient_payment_id = Column(CHAR(36), ForeignKey("inpatient_payments.id"), nullable=False)
    patient_cash_payment_id = Column(CHAR(36), ForeignKey("patient_cash_payments.id"),nullable=True)
    patient_check_payment_id = Column(CHAR(36), ForeignKey("patient_check_payments.id"),nullable=True)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_methods.id"), nullable=False)
    amount_paid = Column(Float,nullable=False)
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    in_treatment_payment_in_treatment_bill = relationship("Treatment_bill", primaryjoin="and_(Treatment_bill.id==Inpatient_treatment_payment.treatment_bill_id)", back_populates="in_treatment_bill_in_treatment_payment")
    in_treatment_payment_in_payment = relationship("Inpatient_payment", primaryjoin="and_(Inpatient_payment.id==Inpatient_treatment_payment.inpatient_payment_id)", back_populates="in_payment_in_treatment_payment")
    in_treatment_payment_patient_cash = relationship("Patient_cash_payment", primaryjoin="and_(Patient_cash_payment.id==Inpatient_treatment_payment.patient_cash_payment_id)", back_populates="patient_cash_in_treatment_payment")
    in_treatment_payment_patient_check = relationship("Patient_check_payment", primaryjoin="and_(Patient_check_payment.id==Inpatient_treatment_payment.patient_check_payment_id)", back_populates="patient_check_in_treatment_payment")
    in_treatment_payment_method = relationship("Payment_method", primaryjoin="and_(Payment_method.id==Inpatient_treatment_payment.payment_method_id)", back_populates="method_in_treatment_payment") 

class Inpatient_surgery_payment(Base):
    __tablename__ = "inpatient_surgery_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    surgery_bill_id = Column(CHAR(36), ForeignKey("surgery_bills.id"), nullable=False)
    inpatient_payment_id = Column(CHAR(36), ForeignKey("inpatient_payments.id"), nullable=False)
    patient_cash_payment_id = Column(CHAR(36), ForeignKey("patient_cash_payments.id"),nullable=True)
    patient_check_payment_id = Column(CHAR(36), ForeignKey("patient_check_payments.id"),nullable=True)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_methods.id"), nullable=False)
    amount_paid = Column(Float,nullable=False)
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    in_surgery_payment_in_surgery_bill = relationship("Surgery_bill", primaryjoin="and_(Surgery_bill.id==Inpatient_surgery_payment.surgery_bill_id)", back_populates="in_surgery_bill_in_surgery_payment")
    in_surgery_payment_in_payment = relationship("Inpatient_payment", primaryjoin="and_(Inpatient_payment.id==Inpatient_surgery_payment.inpatient_payment_id)", back_populates="in_payment_in_surgery_payment")
    in_surgery_payment_patient_cash = relationship("Patient_cash_payment", primaryjoin="and_(Patient_cash_payment.id==Inpatient_surgery_payment.patient_cash_payment_id)", back_populates="patient_cash_in_surgery_payment")
    in_surgery_payment_patient_check = relationship("Patient_check_payment", primaryjoin="and_(Patient_check_payment.id==Inpatient_surgery_payment.patient_check_payment_id)", back_populates="patient_check_in_surgery_payment")
    in_surgery_payment_method = relationship("Payment_method", primaryjoin="and_(Payment_method.id==Inpatient_surgery_payment.payment_method_id)", back_populates="method_in_surgery_payment") 

class Inpatient_room_payment(Base):
    __tablename__ = "inpatient_room_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    room_bill_id = Column(CHAR(36), ForeignKey("room_bills.id"), nullable=False)
    inpatient_payment_id = Column(CHAR(36), ForeignKey("inpatient_payments.id"), nullable=False)
    patient_cash_payment_id = Column(CHAR(36), ForeignKey("patient_cash_payments.id"),nullable=True)
    patient_check_payment_id = Column(CHAR(36), ForeignKey("patient_check_payments.id"),nullable=True)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_methods.id"), nullable=False)
    amount_paid = Column(Float,nullable=False)
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    in_room_payment_in_room_bill = relationship("Room_bill", primaryjoin="and_(Room_bill.id==Inpatient_room_payment.room_bill_id)", back_populates="in_room_bill_in_room_payment")
    in_room_payment_in_payment = relationship("Inpatient_payment", primaryjoin="and_(Inpatient_payment.id==Inpatient_room_payment.inpatient_payment_id)", back_populates="in_payment_in_room_payment")
    in_room_payment_patient_cash = relationship("Patient_cash_payment", primaryjoin="and_(Patient_cash_payment.id==Inpatient_room_payment.patient_cash_payment_id)", back_populates="patient_cash_in_room_payment")
    in_room_payment_patient_check = relationship("Patient_check_payment", primaryjoin="and_(Patient_check_payment.id==Inpatient_room_payment.patient_check_payment_id)", back_populates="patient_check_in_room_payment")
    in_room_payment_method = relationship("Payment_method", primaryjoin="and_(Payment_method.id==Inpatient_room_payment.payment_method_id)", back_populates="method_in_room_payment")

class Outpatient_lab_request_payment(Base):
    __tablename__ = "outpatient_lab_request_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    lab_request_id = Column(CHAR(36), ForeignKey("lab_requests.id"),nullable=False)
    patient_cash_payment_id = Column(CHAR(36), ForeignKey("patient_cash_payments.id"),nullable=True)
    patient_check_payment_id = Column(CHAR(36), ForeignKey("patient_check_payments.id"),nullable=True)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_methods.id"),nullable=False)
    payment_term_id = Column(CHAR(36), ForeignKey("payment_terms.id"),nullable=False)
    amount_paid = Column(Float,nullable=False)
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    out_request_payment_out_request = relationship("Lab_request", primaryjoin="and_(Lab_request.id==Outpatient_lab_request_payment.lab_request_id)", back_populates="out_request_out_request_payment")
    out_request_payment_patient_cash = relationship("Patient_cash_payment", primaryjoin="and_(Patient_cash_payment.id==Outpatient_lab_request_payment.patient_cash_payment_id)", back_populates="patient_cash_out_request_payment")
    out_request_payment_patient_check = relationship("Patient_check_payment", primaryjoin="and_(Patient_check_payment.id==Outpatient_lab_request_payment.patient_check_payment_id)", back_populates="patient_check_out_request_payment")
    out_request_payment_method = relationship("Payment_method", primaryjoin="and_(Payment_method.id==Outpatient_lab_request_payment.payment_method_id)", back_populates="method_out_request_payment")
    out_request_payment_term = relationship("Payment_term", primaryjoin="and_(Payment_term.id==Outpatient_lab_request_payment.payment_term_id)", back_populates="term_out_request_payment")

class Outpatient_treatment_payment(Base):
    __tablename__ = "outpatient_treatment_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    treatment_id = Column(CHAR(36), ForeignKey("treatments.id"),nullable=False)
    patient_cash_payment_id = Column(CHAR(36), ForeignKey("patient_cash_payments.id"),nullable=True)
    patient_check_payment_id = Column(CHAR(36), ForeignKey("patient_check_payments.id"),nullable=True)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_methods.id"),nullable=False)
    payment_term_id = Column(CHAR(36), ForeignKey("payment_terms.id"),nullable=False)
    amount_paid = Column(Float,nullable=False)
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    out_treatment_payment_out_treatment = relationship("Treatment", primaryjoin="and_(Treatment.id==Outpatient_treatment_payment.treatment_id)", back_populates="out_treatment_out_treatment_payment")
    out_treatment_payment_patient_cash = relationship("Patient_cash_payment", primaryjoin="and_(Patient_cash_payment.id==Outpatient_treatment_payment.patient_cash_payment_id)", back_populates="patient_cash_out_treatment_payment")
    out_treatment_payment_patient_check = relationship("Patient_check_payment", primaryjoin="and_(Patient_check_payment.id==Outpatient_treatment_payment.patient_check_payment_id)", back_populates="patient_check_out_treatment_payment")
    out_treatment_payment_method = relationship("Payment_method", primaryjoin="and_(Payment_method.id==Outpatient_treatment_payment.payment_method_id)", back_populates="method_out_treatment_payment")
    out_treatment_payment_term = relationship("Payment_term", primaryjoin="and_(Payment_term.id==Outpatient_treatment_payment.payment_term_id)", back_populates="term_out_treatment_payment")


class Cash_receipt_journal(Base):
    __tablename__ = "cash_receipt_journals"
    id = Column(CHAR(36), primary_key=True)
    inpatient_payment_id = Column(CHAR(36), ForeignKey("inpatient_payments.id"), nullable=False)
    account_credited = Column(String(255),nullable=False)
    posting_reference = Column(String(255),nullable=False)
    explanation = Column(String(255),nullable=False)
    cash = Column(Float,nullable=False)
    sales_discount = Column(Float,nullable=False)
    accounts_receivable = Column(Float,nullable=False)
    accounts_payable = Column(Float,nullable=False)
    sales = Column(Float,nullable=False)
    other_accounts = Column(Float,nullable=False)
    cods_inventory = Column(Float,nullable=False)
    status =  Column(String(255),nullable=False)

    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

class Purchase_order_vendor_payment(Base):
    __tablename__ = "purchase_order_vendor_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    purchase_order_vendor_bill_id = Column(CHAR(36),  ForeignKey("purchase_order_vendor_bills.id"), nullable=False)
    total_amount_paid = Column(Float,nullable=False)
    payment_term_id = Column(CHAR(36), ForeignKey("payment_terms.id"), nullable=False)
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    hospital_cash_payment_id = Column(CHAR(36), ForeignKey("hospital_cash_payments.id"),nullable=True)
    hospital_check_payment_id = Column(CHAR(36), ForeignKey("hospital_check_payments.id"),nullable=True)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_methods.id"),nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    order_vendor_payment_order_vendor_bill = relationship("Purchase_order_vendor_bill", primaryjoin="and_(Purchase_order_vendor_bill.id==Purchase_order_vendor_payment.purchase_order_vendor_bill_id)", back_populates="order_vendor_bill_order_vendor_payment")
    order_vendor_payment_payment_term = relationship("Payment_term", primaryjoin="and_(Payment_term.id==Purchase_order_vendor_payment.payment_term_id)", back_populates="payment_term_order_vendor_payment")
    order_vendor_payment_order_payment = relationship("Purchase_order_payment", primaryjoin="and_(Purchase_order_payment.purchase_order_vendor_payment_id==Purchase_order_vendor_payment.id)", back_populates="order_payment_order_vendor_payment")
    
    order_vendor_payment_hospital_cash = relationship("Hospital_cash_payment", primaryjoin="and_(Hospital_cash_payment.id==Purchase_order_vendor_payment.hospital_cash_payment_id)", back_populates="hospital_cash_order_vendor_payment")
    order_vendor_payment_hospital_check = relationship("Hospital_check_payment", primaryjoin="and_(Hospital_check_payment.id==Purchase_order_vendor_payment.hospital_check_payment_id)", back_populates="hospital_check_order_vendor_payment")
    order_vendor_payment_method = relationship("Payment_method", primaryjoin="and_(Payment_method.id==Purchase_order_vendor_payment.payment_method_id)", back_populates="method_order_vendor_payment")
class Purchase_order_payment(Base):
    __tablename__ = "purchase_order_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    purchase_order_vendor_payment_id = Column(CHAR(36), ForeignKey("purchase_order_vendor_payments.id"),nullable=False)
    purchase_order_bill_id = Column(CHAR(36), ForeignKey("purchase_order_bills.id"), nullable=False)
    hospital_cash_payment_id = Column(CHAR(36), ForeignKey("hospital_cash_payments.id"),nullable=True)
    hospital_check_payment_id = Column(CHAR(36), ForeignKey("hospital_check_payments.id"),nullable=True)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_methods.id"),nullable=False)
    amount_paid = Column(Float,nullable=False)
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    order_payment_order_vendor_payment = relationship("Purchase_order_vendor_payment", primaryjoin="and_(Purchase_order_vendor_payment.id==Purchase_order_payment.purchase_order_vendor_payment_id)", back_populates="order_vendor_payment_order_payment")
    order_payment_order_bill = relationship("Purchase_order_bill", primaryjoin="and_(Purchase_order_bill.id==Purchase_order_payment.purchase_order_bill_id)", back_populates="order_bill_order_payment")
    order_payment_hospital_cash = relationship("Hospital_cash_payment", primaryjoin="and_(Hospital_cash_payment.id==Purchase_order_payment.hospital_cash_payment_id)", back_populates="hospital_cash_order_payment")
    order_payment_hospital_check = relationship("Hospital_check_payment", primaryjoin="and_(Hospital_check_payment.id==Purchase_order_payment.hospital_check_payment_id)", back_populates="hospital_check_order_payment")
    order_payment_method = relationship("Payment_method", primaryjoin="and_(Payment_method.id==Purchase_order_payment.payment_method_id)", back_populates="method_order_payment")

class Cash_disbursement_journal(Base):
    __tablename__ = "cash_disbursement_journals"
    id = Column(CHAR(36), primary_key=True)
    check_no = Column(String(255),nullable=False,unique=True)
    payee_name = Column(String(255),nullable=False)
    account_credited = Column(String(255),nullable=False)
    posting_reference = Column(String(255),nullable=False)
    cash = Column(Float,nullable=False)
    inventory = Column(Float,nullable=False)
    other_accounts = Column(Float,nullable=False)
    accounts_payable = Column(Float,nullable=False)
    status =  Column(String(255),nullable=False)

    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

class Bank_account(Base):
    __tablename__ = "bank_accounts"
    id = Column(CHAR(36), primary_key=True)
    account_name = Column(String(255), nullable=False)
    account_no = Column(String(255), nullable=False)
    bank_name = Column(String(255), nullable=False)
    bank_address = Column(String(255), nullable=False)
    remaining_amount = Column(Float,nullable=False)
    initial_amount = Column(Float,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")

    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    bank_account_deposit = relationship("Deposit", primaryjoin="and_(Deposit.bank_account_id==Bank_account.id)", back_populates="deposit_bank_account")
    bank_account_withdrawal = relationship("Withdrawal", primaryjoin="and_(Withdrawal.bank_account_id==Bank_account.id)", back_populates="withdrawal_bank_account")

class Deposit(Base):   
    __tablename__ = "deposits"    
    id = Column(CHAR(36), primary_key=True)
    bank_account_id = Column(CHAR(36), ForeignKey("bank_accounts.id"), nullable=False)
    deposit_no = Column(String(255),nullable=False,unique=True)
    amount = Column(Float,nullable=False)
    description = Column(Text,nullable=False)
    date_of_deposit = Column(Date,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    deposit_bank_account = relationship("Bank_account", primaryjoin="and_(Bank_account.id==Deposit.bank_account_id)", back_populates="bank_account_deposit")

class Withdrawal(Base):   
    __tablename__ = "withdrawals"    
    id = Column(CHAR(36), primary_key=True)
    bank_account_id = Column(CHAR(36), ForeignKey("bank_accounts.id"), nullable=False)
    withdrawal_no = Column(String(255),nullable=False,unique=True)
    amount = Column(Float,nullable=False)
    description = Column(Text,nullable=False)
    date_of_withdrawal = Column(Date,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    withdrawal_bank_account = relationship("Bank_account", primaryjoin="and_(Bank_account.id==Withdrawal.bank_account_id)", back_populates="bank_account_withdrawal")


# #CLINICAL DEPARTMENTS
# class Clinical_department(Base):
#     __tablename__ = "clinical_departments"
#     id = Column(CHAR(36), primary_key=True)
#     department_name = Column(String(255), nullable=False, unique=True)
#     description = Column(Text,nullable=False)
#     status = Column(String(255), nullable=False, server_default="Active")
    
#     created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
#     created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
#     updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
#     updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())


# class Service_type(Base):
#     __tablename__ = "service_types"
#     id = Column(CHAR(36), primary_key=True)
#     clinical_department_id = Column(CHAR(36), ForeignKey("clinical_departments.id"), nullable=False)
#     service_type_name = Column(String(255), nullable=False, unique=True)
#     description = Column(Text,nullable=False)
#     status = Column(String(255), nullable=False, server_default="Active")
    
#     created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
#     created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
#     updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
#     updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

# class Service(Base):
#     __tablename__ = "Services"
#     id = Column(CHAR(36), primary_key=True)
#     service_type_id = Column(CHAR(36), ForeignKey("service_types.id"), nullable=True)
#     service_name = Column(String(255), nullable=False, unique=True)
#     description = Column(Text,nullable=False)
#     amount = Column(Float, nullable=False)
#     status = Column(String(255), nullable=False, server_default="Active")
    
#     created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
#     created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
#     updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
#     updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())



# #HOSPITAL RATES & FEES
# class Hospital_service(Base):
#     __tablename__ = "hospital_services"
#     id = Column(CHAR(36), primary_key=True)
#     particular = Column(String(255), nullable=False, unique=True)
#     amount = Column(Float, nullable=False)
#     status = Column(String(255), nullable=False, server_default="Active")
    
#     created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)
#     created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
#     updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
#     updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

# class Laboratory_type(Base):
#     __tablename__ = "laboratory_types"    
#     id = Column(CHAR(36), primary_key=True)
#     name = Column(String(255),nullable=False,unique=True)
#     description = Column(Text,nullable=False)

#     status = Column(String(255), nullable=False, server_default="Active")
#     created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
#     created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
#     updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
#     updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now()) 


# class Laboratory_service(Base):
#     __tablename__ = "Laboratory_services"    
#     id = Column(CHAR(36), primary_key=True)
#     lab_test_type_id = Column(CHAR(36), ForeignKey("laboratory_types.id"),nullable=False)
#     name = Column(String(255),nullable=False,unique=True)
#     description = Column(Text,nullable=False)
#     amount = Column(Float, nullable=False)

#     status = Column(String(255), nullable=False, server_default="Active")
#     created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
#     created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
#     updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
#     updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now()) 


# class Lab_test_type(Base):
    # __tablename__ = "lab_test_types"    
    # id = Column(CHAR(36), primary_key=True)
    # name = Column(String(255),nullable=False,unique=True)
    # description = Column(Text,nullable=False)

    # status = Column(String(255), nullable=False, server_default="Active")
    # created_by = Column(CHAR(36), ForeignKey("users.id"),nullable=False)
    # created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    # updated_by = Column(CHAR(36),ForeignKey("users.id"),nullable=True)
    # updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now()) 



# module
from sqlalchemy import Column, ForeignKey, text, func
from sqlalchemy.dialects.mysql import CHAR, VARCHAR, TIMESTAMP, TEXT, INTEGER, DECIMAL, BOOLEAN
from sqlalchemy.orm import relationship





""" define & collect ACCOUNT TYPE MODEL """

class AccountType(Base): 
    __tablename__ = 'account_types'
    id = Column(CHAR(36), primary_key=True)
    name = Column(VARCHAR(255), nullable=False)
    code = Column(VARCHAR(255), nullable=False)
    description = Column(TEXT, nullable=False)
   
    replaced_record = Column(CHAR(36), ForeignKey("account_types.id"))

    status = Column(VARCHAR(255), nullable=False, server_default="Active")
    created_at = Column(TIMESTAMP(2), nullable=False, server_default=func.current_timestamp())
    updated_at = Column(TIMESTAMP(2), nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    created_by = Column(CHAR(36), ForeignKey("users.id"))
    updated_by = Column(CHAR(36), ForeignKey("users.id"))

    at_replaced_record = relationship("AccountType", remote_side=id, foreign_keys=[replaced_record])
    at_created_by = relationship("User", foreign_keys=[created_by])
    at_updated_by = relationship("User", foreign_keys=[updated_by])
    
    mysql_engine = 'InnoDB'
    mysql_charset = 'utf8mb4'
    #mysql_key_block_size = "1024"



""" define & collect CHART ACCOUNT MODEL """

class ChartAccount(Base): 
    __tablename__ = 'chart_accounts'
    id = Column(CHAR(36), primary_key=True)
    account_title = Column(VARCHAR(255), nullable=False)
    account_type = Column(CHAR(36), ForeignKey("account_types.id"))
    account_number = Column(VARCHAR(255), nullable=False)
    description = Column(TEXT, nullable=False)

    replaced_record = Column(CHAR(36), ForeignKey("chart_accounts.id"))
    
    status = Column(VARCHAR(255), nullable=False, server_default="Active")
    created_at = Column(TIMESTAMP(2), nullable=False, server_default=func.current_timestamp())
    updated_at = Column(TIMESTAMP(2), nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    created_by = Column(CHAR(36), ForeignKey("users.id"))
    updated_by = Column(CHAR(36), ForeignKey("users.id"))

    ca_account_type = relationship("AccountType", foreign_keys=[account_type])
    ca_replaced_record = relationship("ChartAccount", remote_side=id, foreign_keys=[replaced_record])  
    ca_created_by = relationship("User", foreign_keys=[created_by])
    ca_updated_by = relationship("User", foreign_keys=[updated_by])
    
    mysql_engine = 'InnoDB'
    mysql_charset = 'utf8mb4'
    #mysql_key_block_size = "1024"



""" define & collect DATA SOURCE MODEL """

class DataSource(Base):
    __tablename__ = 'data_sources'
    id = Column(CHAR(36), primary_key=True)
    name = Column(VARCHAR(255), nullable=False)
    endpoint = Column(VARCHAR(255), nullable=False)
    description = Column(TEXT, nullable=False)

    status = Column(VARCHAR(255), nullable=False, server_default='Active')
    created_at = Column(TIMESTAMP(2), nullable=False, server_default=func.current_timestamp())
    updated_at = Column(TIMESTAMP(2), nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    created_by = Column(CHAR(36), ForeignKey('users.id'))
    updated_by = Column(CHAR(36), ForeignKey('users.id'))

    ds_created_by = relationship('User', foreign_keys=[created_by])
    ds_updated_by = relationship('User', foreign_keys=[updated_by])

    mysql_engine = 'InnoDB'
    mysql_charset = 'utf8mb4'
    #mysql_key_block_size = '1024'



""" define & collect JOURNAL ACCOUNT MODEL """

class JournalAccount(Base): 
    __tablename__ = 'journal_accounts'
    id = Column(CHAR(36), primary_key=True)
    account_title = Column(CHAR(36), ForeignKey("chart_accounts.id"))
    pr = Column(VARCHAR(255), nullable=False)
    debit = Column(DECIMAL(13,2), nullable=False, server_default='0')
    credit = Column(DECIMAL(13,2), nullable=False, server_default='0')
    is_adjustable = Column(BOOLEAN, nullable=False, server_default='0')
    salvage_value = Column(DECIMAL(13,2), nullable=False, server_default='0')
    useful_life = Column(INTEGER, nullable=False, server_default='0')
    rate = Column(INTEGER, nullable=False, server_default='0')
    month_no = Column(INTEGER, nullable=False, server_default='0')
    interest = Column(DECIMAL(13,2), nullable=False, server_default='0')
    is_interest_adjustable = Column(BOOLEAN, nullable=False, server_default='0')
    balance = Column(DECIMAL(13,2), nullable=False, server_default='0')
    
    journal_entry = Column(CHAR(36), ForeignKey("journal_entries.id"))
    
    ja_account_title = relationship("ChartAccount", foreign_keys=[account_title]) 
    #ja_journal_entry = relationship("JournalEntry", foreign_keys=[journal_entry])
    
    mysql_engine = 'InnoDB'
    mysql_charset = 'utf8mb4'
    #mysql_key_block_size = "1024"



""" define & collect JOURNAL ENTRY MODEL """

class JournalEntry(Base): 
    __tablename__ = 'journal_entries'
    id = Column(CHAR(36), primary_key=True)
    source_document_path = Column(TEXT)
    entry_type = Column(VARCHAR(255), nullable=False, server_default="Initial")
    date = Column(CHAR(10), nullable=False)
    is_adjustable = Column(BOOLEAN, nullable=False, server_default='0')
    explanation = Column(TEXT, nullable=False)
    status = Column(VARCHAR(255), nullable=False, server_default="Journalized")
    
    originating_entry = Column(CHAR(36), ForeignKey("journal_entries.id"))
    adjusted_account = Column(CHAR(36))
    adjusted_balance = Column(DECIMAL(13,2), nullable=False, server_default='0')

    replaced_record = Column(CHAR(36), ForeignKey("journal_entries.id", ondelete='CASCADE'))
    
    journalized_at = Column(TIMESTAMP(2), nullable=False, server_default=func.current_timestamp())
    posted_at = Column(TIMESTAMP(2))
    updated_at = Column(TIMESTAMP(2), nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    journalized_by = Column(CHAR(36), ForeignKey("users.id"))
    posted_by = Column(CHAR(36), ForeignKey("users.id"))
    updated_by = Column(CHAR(36), ForeignKey("users.id"))

    je_journal_accounts = relationship("JournalAccount") 
    je_originating_entry = relationship("JournalEntry", remote_side=id, foreign_keys=[originating_entry])
    je_replaced_record = relationship("JournalEntry", remote_side=id, foreign_keys=[replaced_record], cascade='all, delete')
    je_journalized_by = relationship("User", foreign_keys=[journalized_by])
    je_posted_by = relationship("User", foreign_keys=[posted_by])
    je_updated_by = relationship("User", foreign_keys=[updated_by])
    
    mysql_engine = 'InnoDB'
    mysql_charset = 'utf8mb4'
    #mysql_key_block_size = "1024"
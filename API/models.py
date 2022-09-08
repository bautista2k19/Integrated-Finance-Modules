

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, CHAR, DateTime, text

from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.schema import UniqueConstraint
from sqlalchemy.sql.sqltypes import DECIMAL, TEXT, Date, Float, SmallInteger, Text, Time, CHAR, DateTime,Integer, Numeric

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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")

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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")

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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")

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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")
    
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

    data_source = Column(VARCHAR(255))
    data_source_date = Column(DateTime)
    
    mysql_engine = 'InnoDB'
    mysql_charset = 'utf8mb4'
    #mysql_key_block_size = "1024"





""" AP / AR """

# 
class AR_Employee(Base):
    __tablename__ = "ar_employees"

    id = Column(CHAR(36), primary_key=True, index=True)
    photo = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)
    middle_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=False)
    extension_name = Column(String(255), nullable=True)
    birthdate = Column(Date, nullable=False)
    birthplace = Column(String(255), nullable=False)
    gender = Column(String(255), nullable=False)
    civil_status = Column(String(255), nullable=False)
    house_number = Column(String(255), nullable=True)
    street = Column(String(255), nullable=True)
    barangay = Column(String(255), nullable=True)
    city = Column(String(255), nullable=False)
    province = Column(String(255), nullable=False)
    country = Column(String(255), nullable=False)
    contact_number = Column(String(255), nullable=False,
                            unique=True, index=True)
    email = Column(String(255), nullable=False,
                            unique=True, index=True)
    department = Column(String(255), nullable=False)
    job = Column(String(255), nullable=False)
    hire_date = Column(Date, nullable=False)
    manager = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    created_at = Column(DateTime, nullable=False)
    updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    updated_at = Column(DateTime, nullable=True)

    UniqueConstraint(first_name, middle_name, last_name, extension_name)

    user_credentials = relationship("AR_User", primaryjoin="and_(AR_Employee.id==AR_User.employee_id)",back_populates="employee_information")

class AR_User(Base):
    __tablename__ = "ar_users"
    id = Column(CHAR(36), primary_key=True, index=True)
    employee_id = Column(CHAR(36), ForeignKey("ar_employees.id"), nullable=False)
    username = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    user_type = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    created_at = Column(DateTime, nullable=False)
    updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    updated_at = Column(DateTime, nullable=True)

    employee_information = relationship("AR_Employee", primaryjoin="and_(AR_User.employee_id==AR_Employee.id)", back_populates="user_credentials")

    

#===================================================================================================================#
#PATIENT MANAGEMENT
class AR_PatientRegistration(Base):
    __tablename__ = 'ar_patient_registration'

    patient_id = Column(String(36), primary_key=True, default=text('UUID()'))
    first_name = Column(String(255), nullable=False)
    middle_name = Column(String(255), nullable=False)      #NEW1 NULLABLE DAPAT TO
    last_name = Column(String(255), nullable=False)
    sex = Column(String(255), nullable=False)
    birthday = Column(Date, nullable=False)
    weight = Column(String(255), nullable=False)
    height = Column(String(255), nullable=False)
    blood_type = Column(String(255), nullable=False)
    guardian = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    contact_number = Column(String(255), nullable=False)
    medical_history_number = Column(String(36),  nullable=True)  # ForeignKey('medical_history.medical_history_number'),
    dp_id = Column(String(36), ForeignKey('ar_discount_privillages.dp_id'), nullable=True)
    insurance_id = Column(String(36), ForeignKey("ar_insurances.insurance_id"), nullable=True)  ####### NEW COLUMN #########
    patient_type = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    #medical_history = relationship('MedicalHistory')     ### COMMENT KO MUNA ITO

    discount_privillages = relationship(
         "AR_Discount", primaryjoin="and_(AR_PatientRegistration.dp_id==AR_Discount.dp_id)") #CHANGE TO DISCOUNT /dp_id/ PatientRegistration


    treatments = relationship("AR_Treatment",back_populates="patient")  #NEW1
    surgeries = relationship("AR_Surgery",back_populates="patient")  #NEW1



    #===========================================================================================================#
    # insurance_id_info = relationship(
    #         "Insurance", primaryjoin="and_(Patient_registration.insurance_id==Insurance.insurance_id)")

    # patient_admission = relationship(
    #     "Inpatient_management", primaryjoin="and_(Patient_registration.patient_id==Inpatient_management.patient_id)", back_populates="patient_info")
   
    # inpatient_credentials = relationship(
    #     "Inpatient_management", primaryjoin="and_(Patient_registration.patient_id == Inpatient_management.patient_id)",back_populates="patient_info")
    
    # inpatient_discharged = relationship(
    #     "Discharge_management", primaryjoin="and_(Patient_registration.patient_id == Discharge_management.patient_id)",back_populates="inpatient_credentials")

    # inpatient_surgeries = relationship(
    #     "Surgery", primaryjoin="and_(Patient_registration.patient_id == Surgery.patient_id)",back_populates="patient_info")

    # inpatient_treatments = relationship(
    #     "Treatment", primaryjoin="and_(Patient_registration.patient_id == Treatment.patient_id)",back_populates="patient_info")

    # inpatient_hospital_charges = relationship(
    #     "HospitalCharges", primaryjoin="and_(Patient_registration.patient_id == HospitalCharges.patient_id)",back_populates="patient_info")
#PATIENT MANAGEMENT  
class AR_Insurance(Base):   # wala dati (Base)
    __tablename__ = 'ar_insurances'
    insurance_id = Column(String(36), primary_key=True) #, default=mydefault
    # patient_id = Column(String(255), ForeignKey('patient_registration.patient_id'), nullable=True)
    policy_holder = Column(String(255), nullable=True)
    policy_number = Column(String(255), nullable=True)
    company_phone = Column(String(255), nullable=True)
    company_address = Column(String(255), nullable=True)
    remarks = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))
    #====================================================================================================

#PATIENT MANAGEMENT
class AR_Discount(Base):
    __tablename__ = 'ar_discount_privillages'

    dp_id = Column(String(36), primary_key=True, default=text('UUID()'))
    ph_id = Column(String(255), nullable=True)                                  ###  PHILHEALTH PO BA ITO?
    end_of_validity = Column(String(255), nullable=True)   #NEW1 BAKIT HINDI DATE?
    sc_id = Column(String(255), nullable=True)                                  ###  SENIOR CITIZEN ID?
    municipality = Column(String(255), nullable=True)
    pwd_id = Column(String(255), nullable=True)
    type_of_disability = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))
    #====================================================================================================

#CMS
class AR_Room_type(Base):
    __tablename__ = "ar_room_types"    
    id = Column(CHAR(36), primary_key=True,index=True)
    room_type_name = Column(String(255),nullable=False,unique=True, index=True)
    description = Column(Text,nullable=False)
    amount = Column(Float,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime,default=text('NOW()'),nullable=False) #NEW1 default=text('NOW()')
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)
    #====================================================================================================


#PATIENT MANAGEMENT
class AR_Room(Base):
    __tablename__ = 'ar_rooms' 
    room_id = Column(String(36), primary_key=True, default=text('UUID()'))
    room_number = Column(String(255), nullable=False)
    date_admitted = Column(DateTime, default=text('NOW()'))
    admission_id =  Column(String(255), ForeignKey('ar_inpatients.admission_id'), nullable=False)
    room_type_id= Column(String(36), ForeignKey("ar_room_types.id"), nullable=False)  ###     room_type = Column(String(36),  ForeignKey("room_types.id"), nullable=False)
    location = Column(String(36), nullable=True)
    room_count = Column(Integer, nullable=True)
    room_status = Column(String(36), nullable=False)
    active_status = Column(String(36), nullable=False)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    room_type_info = relationship(
        "AR_Room_type", primaryjoin="and_(AR_Room.room_type_id==AR_Room_type.id)") #NEW1
    # rooms_inpatientFk = relationship('Inpatient')
    room_inpatientFk = relationship('AR_Inpatient', foreign_keys=[admission_id])

    #====================================================================================================

#PATIENT MANAGEMENT
class AR_Inpatient(Base):
    __tablename__ = 'ar_inpatients'

    admission_id = Column(String(255), primary_key=True, default=text('UUID()'))
    inpatient_no = Column(String(255), nullable=False)                                        ### NEW COLUMN DINAGDAG TUDEY ####
    patient_id = Column(String(36), ForeignKey('ar_patient_registration.patient_id'), nullable=True)
    # room_number = Column(String(36), ForeignKey('patient_rooms.id'), nullable=False)
   
    date_admitted = Column(DateTime, default=text('NOW()'),nullable=False)  #nullable=False
    reason_of_admittance = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    diagnosis = Column(String(255), nullable=True)
    tests = Column(String(255), nullable=True)
    treatments = Column(String(255), nullable=True)
    surgery = Column(String(255), nullable=True)

    status = Column(String(255),nullable=True, default="Active")#NEW 2 NEW COLUMN
    is_accepting_visits = Column(String(255), nullable=True)#NEW 2 NEW COLUMN
 
    patient_status = Column(String(255), nullable=True)  #Discharged
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    admission_info = relationship(
        "AR_Room", primaryjoin="and_(AR_Inpatient.admission_id==AR_Room.admission_id)")

    # room = relationship('Room', foreign_keys=[room_number])#NEW1 COMMENT KO MUNA

    inpatientsFk = relationship('AR_PatientRegistration', foreign_keys=[patient_id])

    my_prescriptions = relationship("AR_Prescription", primaryjoin="and_(AR_Inpatient.admission_id==AR_Prescription.admission_id)",back_populates="inpatient_info")           #NEW1 GALING SA PHARMACY

    patient_info = relationship(
        "AR_PatientRegistration", primaryjoin="and_(AR_Inpatient.patient_id==AR_PatientRegistration.patient_id)")  #NEW1 PatientRegistration

    inpatient_bill_info = relationship(
        "AR_InpatientBill", primaryjoin="and_(AR_Inpatient.admission_id ==AR_InpatientBill.admission_id)")

    discharge_management_info = relationship('AR_DischargeManagement', back_populates='inpatient_info')  #NEW1

    admission_info = relationship(
        "AR_Room", primaryjoin="and_(AR_Inpatient.admission_id==AR_Room.admission_id)")

    
    #====================================================================================================


# NEW TABLE FOR PATIENT MANAGEMENT //WALA NA
# class   PatientRoom(Base):
#     __tablename__ = "patient_rooms"

#     id = Column(String(36), primary_key=True,index=True)
#     room_number = Column(String(36), ForeignKey("rooms.room_id"),nullable=False) #NEW1 ,ForeignKey("rooms.id")
#     admission_id =  Column(String(255), ForeignKey('inpatients.admission_id'), nullable=False)
#     datetime_admitted =  Column(DateTime (timezone=True), nullable=False, server_default=func.now())
#     status = Column(String(255), nullable=False, server_default="Occupied")
#     created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=True)
#     created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
#     updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
#     updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())
#     room_number_info = relationship(
#         "Room", primaryjoin="and_(PatientRoom.room_number==Room.room_id)") 

    #====================================================================================================

#PATIENT MANAGEMENT                                              
class AR_DischargeManagement(Base):
    __tablename__ = 'ar_discharge_management'                                                         

    discharge_id = Column(String(255), primary_key=True, default=text('UUID()'))                   ## NEED PO NAMIN
    discharge_no = Column(String(255), nullable=False)                                             ### NEW COLUMN DINAGDAG TUDEY ####
    patient_id = Column(String(255), nullable=True) ##NEW1 , ForeignKey('patient_registration.patient_id') DELETED
    admission_id = Column(String(255), ForeignKey('ar_inpatients.admission_id'), nullable=True)       ## NEED PO NAMIN
    reason_of_admittance = Column(String(255), nullable=False)
    diagnosis_at_admittance = Column(String(255), nullable=False)
    date_admitted = Column(DateTime, default=text('NOW()'))              #pwede po ito makuha sa admission_id po ata
    treatment_summary = Column(String(255), nullable=False)
    discharge_date = Column(DateTime, nullable=True)     #NEW1 CHANGE TO DateTime                                      ## NEED PO NAMIN
    physician_approved = Column(String(255), nullable=False)
    discharge_diagnosis = Column(String(255), nullable=False)
    further_treatment_plan = Column(String(255), nullable=False)
    next_check_up_date = Column(Date, nullable=True)
    client_consent_approval = Column(String(255), nullable=False)
    # medication = Column(String(255), nullable=True)
    # dosage = Column(String(255), nullable=True)
    # frequency = Column(String(255), nullable=True)
    # ending_date = Column(Date, nullable=True)
    active_status = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    # discharge_managementFk = relationship('PatientRegistration', foreign_keys=[patient_id])
    discharge_inpatientFk = relationship('AR_Inpatient', foreign_keys=[admission_id])
    inpatient_info = relationship('AR_Inpatient', back_populates='discharge_management_info')  #NEW1
    #====================================================================================================



################################################################################ TREATMENT MANAGEMENT

#GALING DOCTORS MANAGEMENT
class AR_Specialization(Base):
    __tablename__= "ar_specialization"
    specialization_id = Column(CHAR(36), primary_key=True) #, default= uuid4
    specialization_name = Column(String(255), nullable= False)
    status =  Column(String(255), default="Active")
    created_by= Column(CHAR(36), ForeignKey('ar_users.id'), nullable= True)
    created_at =  Column(DateTime(timezone=True), server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey('ar_users.id'), nullable= True)
    updated_at =  Column(DateTime(timezone=True), server_default=func.now())

#GALING DOCTORS MANAGEMENT
class AR_Doctor_profile(Base):
    __tablename__ = "ar_doctor_profile"
    doctor_id = Column(CHAR(36),  primary_key=True) #, default= uuid4
    photo = Column(String(255), nullable=True)
    label = Column(String(5), nullable= False, default="Dr.")
    doctor_first_name  = Column(String(255), nullable= False) #NEW1 NULLABLE FALSE
    doctor_middle_name  = Column(String(255), nullable= True)
    doctor_last_name = Column(String(255), nullable= False) #NEW1 NULLABLE FALSE
    doctor_home_address = Column(String(255), nullable= True)
    doctor_location = Column(String(255), nullable= True)
    doctor_mobile = Column(String(255), nullable= True)
    doctor_schedule =  Column(String(255), nullable=True)
    specialization_id  = Column(CHAR(36), ForeignKey('ar_specialization.specialization_id'))
    status =  Column(String(255), default="Active")
    created_by= Column(CHAR(36), ForeignKey('ar_users.id'), nullable= True)           ##User
    created_at =  Column(DateTime(timezone=True), server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey('ar_users.id'), nullable= True)          ##User
    updated_at =  Column(DateTime(timezone=True), server_default=func.now())
    
    # treatments = relationship("Treatment",back_populates="patient")  #NEW1
    treatments = relationship('AR_Treatment', back_populates='physician')  #NEW1
    handled_surgeries = relationship('AR_SurgeryInCharge', back_populates="in_charge")
    #doctor_specialization = relationship("Specialization", backref="backref"("doctor_profile", uselist=False)) ###"backref" ###


#  GALING CMS ITU
class AR_Treatment_type(Base):
    __tablename__ = "ar_treatment_types"
    id = Column(CHAR(36), primary_key=True,index=True)
    treatment_type_name = Column(String(255),nullable=False,unique=True, index=True)
    description = Column(Text,nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime,server_default=func.now(), nullable=False) #NEW1 server_default=func.now()
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,server_default=func.now(), nullable=True)  #NEW1 server_default=func.now()


## NEW TABLE FOR TREATMENT
class AR_TreatmentServiceName(Base):
    __tablename__ = "ar_treatment_service_name"
    id = Column(String(36), primary_key=True,index=True)
    treatment_service_name = Column(String(255),nullable=False,unique=True)
    treatment_types_id = Column(String(36), ForeignKey("ar_treatment_types.id"),nullable=False)
    unit_price = Column(Float, nullable=False)
  
    status = Column(String(100), default='Pending' ,nullable=False)        #nullable=False                         
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now()) #NEW1 server_default=func.now()
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime, nullable=True,server_default=func.now()) #NEW1 server_default=func.now()

    treatments = relationship("AR_Treatment",back_populates="treatment_name")  #NEW1 ALL
    
    treatment_type_info =relationship(
        "AR_Treatment_type", primaryjoin="and_(AR_TreatmentServiceName.treatment_types_id==AR_Treatment_type.id)")


# TREATMENT MANAGEMENT
class AR_Treatment(Base):
    __tablename__ = "ar_treatments"
    id = Column(String(36), primary_key=True, default=text('UUID()'))
    treatment_no = Column(String(100),nullable=False) #nullable=False
    patient_id = Column(String(36), ForeignKey("ar_patient_registration.patient_id"), nullable=False)  #nullable=False #patient_registration.patient_id
    treatment_service_name_id = Column(String(36), ForeignKey("ar_treatment_service_name.id"),nullable=False) #nullable=False
    doctor_profile_id= Column(String(36), ForeignKey("ar_doctor_profile.doctor_id"),nullable=False) #nullable=False # DOCTOR IN CHARGE ### CHANGE COLUMN NAME TO Doctor_profile_id then FK sa HR Dr profile ####
    description = Column(Text)
    quantity= Column(Float,nullable=False)                                                    ### NEW COLUMN ####
    cancellation_return= Column(Float,nullable=False , default='0')  #NEW1 NEW COLUMN 
    room = Column(String(100))                                                                ### NEW COLUMN, YUNG GALING SA TYPES NIYO PO DATI NILIPAT NA PO DITO ####
    session_no = Column(Text)
    session_datetime = Column((DateTime),nullable=False)  #nullable=False                     ### NEED PO NAMIN ITONG DATE (ACTUALLY LAHAT PO) ### 
    drug = Column(Text)
    dose = Column(Text)
    next_schedule = Column(DateTime)
    comments = Column(Text)
    
    status = Column(String(100), default='PENDING', nullable=False) #nullable=False
    is_active = Column(String(100), default='ACTIVE' ,nullable=False) #nullable=False
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    patient = relationship('AR_PatientRegistration', back_populates='treatments')
    physician = relationship('AR_Doctor_profile', back_populates='treatments')  ##NEW1 Doctor_profile
    treatment_name = relationship('AR_TreatmentServiceName', back_populates='treatments') #NEW1 TreatmentServiceName /treatment_name

#GALING SA CMS ITU
class AR_Lab_test_type(Base):
    __tablename__ = "ar_lab_test_types"    
    id = Column(CHAR(36), primary_key=True,index=True)
    lab_test_type_name = Column(String(255),nullable=False,unique=True, index=True)
    description = Column(Text,nullable=False)
  
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)

    #lab_requests = relationship('LabRequest', back_populates='lab_test')   #NEW1 WALA NA DAPAT ITO  #GALING LABREQUEST (DI KO NA TINANGGAL)


## NEW TABLE FOR LAB
class AR_LabServiceName(Base):
    __tablename__ = "ar_lab_service_name"
    id = Column(String(36), primary_key=True,index=True)
    lab_service_name = Column(String(255),nullable=False,unique=True)
    lab_test_types_id = Column(String(36), ForeignKey("ar_lab_test_types.id"),nullable=False)
    unit_price = Column(Float, nullable=False)
  
    status = Column(String(100), default='Active')  #CHANGE TO ACTIVE
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)

    lab_test_types_id_info = relationship(
        "AR_Lab_test_type", primaryjoin="and_(AR_LabServiceName.lab_test_types_id==AR_Lab_test_type.id)" ) #NEW1
   

#LAB REQUEST
class AR_LabRequest(Base):
    __tablename__ = "ar_lab_requests"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    lab_test_id = Column(String(36), ForeignKey("ar_lab_service_name.id"), nullable=False) #nullable=False                      ### CHANGE FK ###  
    patient_id = Column(String(36), ForeignKey("ar_patient_registration.patient_id"), nullable=False) #nullable=False           ### patient_registration.patient_id
    lab_request_no = Column(String(100), nullable=False)
    quantity= Column(Float,nullable=False , default='1')  #NEW1 NEW COLUMN 
    cancellation_return= Column(Float,nullable=False , default='0')  #NEW1 NEW COLUMN 
    is_active = Column(String(100), default='ACTIVE', nullable=False) #nullable=False                                         
    status = Column(String(100), default='PENDING' ,nullable=False) #nullable=False           ### CHANGE STATUS TO "FOR BILLING" PAG INEDIT NIYO NA YUNG STATUS NA FOR BILLING IBIG SABIHIN PINASA NIYO NA SA AMIN TAPOS HINDI NIYO NA SIYA MAUUPDATE/EDIT/DELETE OKI? ### 
    created_at = Column(DateTime, default=text('NOW()'))                                      ### NEED PO NAMIN ITONG DATE ###
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    # lab_result = relationship('LabResult', back_populates='lab_request') #NEW1 COMMENT KO MUNA
    # lab_test = relationship('LabTest', back_populates='lab_requests')  #NEW1 COMMENT KO MUNA
    # patient = relationship('Patient', back_populates='lab_requests') #NEW1 COMMENT KO MUNA
    
    lab_test_id_info = relationship('AR_LabServiceName', back_populates='')


#GALING CMS /////////////////////////////////////////////////////////////////////// SA TREATMENT NA ITU
class AR_Surgery_type(Base):
    __tablename__ = "ar_surgery_types"    
    id = Column(CHAR(36), primary_key=True,index=True)
    surgery_type_name = Column(String(255),nullable=False,unique=True, index=True)
    description = Column(Text,nullable=False)
                                              
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)

    surgeries = relationship("AR_Surgery",back_populates="surgery_type") #NEW1

# SURGERY
class AR_Surgery(Base):
    __tablename__ = "ar_surgeries"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    surgery_no = Column(String(100),nullable=False) #nullable=False
    patient_id = Column(String(36), ForeignKey("ar_patient_registration.patient_id"),nullable=False)#nullable=False  ### patient_registration.patient_id
    room = Column(String(100))
    surgery_type_id = Column(String(36), ForeignKey("ar_surgery_types.id"),nullable=False)#nullable=False
    start_time = Column((DateTime),nullable=False)#nullable=False
    end_time = Column((DateTime),nullable=False) #nullable=False
   # head_surgeon_id = Column(String(36), ForeignKey("ar_users.id"))       ### NILIPAT NA SA SURGERY_IN_CHARGE
    description = Column(String(255))
    is_active = Column(String(100), default='ACTIVE')
    status = Column(String(100), default='PENDING' ,nullable=False) #nullable=False                    ### CHANGE STATUS TO "FOR BILLING" PAG INEDIT NIYO NA YUNG STATUS NA FOR BILLING IBIG SABIHIN PINASA NA NIYO SA AMIN TAPOS HINDI NIYO NA SIYA MAUUPDATE/EDIT/DELETE OKI? ### 
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))


    patient = relationship('AR_PatientRegistration', back_populates='surgeries')
    surgery_type = relationship("AR_Surgery_type", back_populates="surgeries") #NEW1 Surgery_type

    in_charge = relationship('AR_SurgeryInCharge', back_populates="surgery")


class AR_SurgeryInCharge(Base):
    __tablename__ = "ar_surgery_in_charge"
    id = Column(CHAR(36), primary_key=True)                                         ### NEW COLUMN 
    dr_in_charge_id = Column(ForeignKey('ar_doctor_profile.doctor_id'),nullable=False) #nullable=False                ### NEW COLUMN FOR DOCTORS PROFILE/ FK ONLY ### 
    head_surgeon_id = Column(String(36),  server_default="No")                      ### NEW COLUMN IF HEAD SURGEON OR NOT ###  
    nurse_charge_id = Column(ForeignKey('ar_users.id'))                                ### GINAWANG FK ONLI :>### 
    surgery_id = Column(ForeignKey('ar_surgeries.id'),nullable=False)#nullable=False  

    status = Column(String(100), default='PENDING' ,nullable=False) #NEW1 NEW COLUMN
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    #  status : str                   #NEW1 BAKIT WALANG GANITO PO
    # created_by : str                #NEW1
    # created_at : datetime           #NEW1
    # updated_by : Optional[str]      #NEW1
    # updated_at : Optional[datetime] #NEW1
                  

    in_charge = relationship('AR_Doctor_profile', back_populates="handled_surgeries")   #NEW1 Doctor_profile
    surgery = relationship("AR_Surgery", back_populates="in_charge")

    #####ADD RELATIONSHIP FOR DOCTORS PROFILE#########
    dr_profile =relationship(
        "AR_Doctor_profile", primaryjoin="and_(AR_SurgeryInCharge.dr_in_charge_id==AR_Doctor_profile.doctor_id)")




#////////////////////////////////////////////////////////////////////////////////////////////////////////////////#
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////#
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////#
#MEDICINE PRESCRIPTION
class AR_Medicine_PR(Base):
    __tablename__= 'ar_medicine_pr'

    medpr_id= Column(CHAR(36), primary_key=True, index=True)
    medicine_no = Column(Integer, nullable=False,unique=True, index=True)
    medicine_id = Column(CHAR(36), ForeignKey("ar_medicines.id"),nullable=True)  #rename
    quantity = Column(Integer,nullable=False)
    cancellation_return= Column(Float,nullable=False , default='0') #NEW2
    # new
    
    intake = Column(String(255),nullable=False)
    frequency = Column(String(255),nullable=False)
    dosage = Column(String(255),nullable=False)
    doctor_prescribed = Column(String(255),nullable=False)
   
    prescription_id = Column(CHAR(36), ForeignKey("ar_prescriptions.prescription_id"),nullable=True)
    med_pres_status = Column(String(255),nullable=False, default="Unpaid")  #NEW rename med_pres_status
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=True)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)

    prescription_info = relationship("AR_Prescription", primaryjoin="and_(AR_Medicine_PR.prescription_id==AR_Prescription.prescription_id)", back_populates="medicines_prescription")
    medicine_info = relationship("AR_Medicine", primaryjoin="and_(AR_Medicine_PR.medicine_id==AR_Medicine.id)", back_populates="med_pr")
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////#
#MEDICINE TABLE 
class AR_Medicine(Base):
     __tablename__= 'ar_medicines'
     id= Column(CHAR(36), primary_key=True, index=True)
     med_product_name = Column (String(255), unique=True,nullable=False)
     med_quantity = Column(Integer,nullable=False)
     med_manufacturer = Column (CHAR(36), nullable=True) #NEW1 ForeignKey("manufacturers.id") comment
     med_manufactured_date = Column (Date,nullable=False)
     med_import_date = Column(Date,nullable=False)
     med_expiration_date = Column (Date,nullable=False)
     med_batch_number = Column (Integer,nullable=False)
     med_unit_price = Column (Float,nullable=False)
     med_tax = Column (Integer,nullable=True)
     med_purpose = Column (String(255),nullable=False)
     condition = Column(String(255),nullable=False, default="no issue")
     status = Column(String(255),nullable=False, default="High")
     dosage = Column (Integer,nullable=False)
     created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=True)
     created_at = Column(DateTime,nullable=False)
     updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
     updated_at = Column(DateTime,nullable=True)

    #  manufacturer_information = relationship("Manufacturer", primaryjoin="and_(Medicine.med_manufacturer==Manufacturer.id)", back_populates="medicine_info")    #NEW1 COMMENT MUNA 
 

     #PRESCRIPTION MEDICINE
     med_pr = relationship("AR_Medicine_PR", primaryjoin="and_(AR_Medicine.id==AR_Medicine_PR.medicine_id)",back_populates="medicine_info")
     #POS MEDICINE
    #  medicine_item = relationship("Medicine_item", primaryjoin="and_(Medicine.id==Medicine_item.medicine_id)", back_populates="medicine_info")                                          #NEW1 COMMENT MUNA


#MEDICAL PRESCRIPTION
class AR_MedicalSupplies_PR(Base):
    __tablename__= 'ar_medicalsupplies_pr'

    medicsupp_prid= Column(CHAR(36), primary_key=True, index=True)
    ms_no = Column(Integer, nullable=False,unique=True, index=True)
    medical_id = Column(CHAR(36), ForeignKey("ar_medicalsupplies.id"),nullable=True)
    quantity = Column(Integer,nullable=False)
    # cancellation_return= Column(Float,nullable=False , default='0') #NEW2
    prescription_id = Column(CHAR(36), ForeignKey("ar_prescriptions.prescription_id"),nullable=True)
    status = Column(String(255),nullable=False, default="Unpaid")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=True)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)
    prescription_info = relationship("AR_Prescription", primaryjoin="and_(AR_MedicalSupplies_PR.prescription_id==AR_Prescription.prescription_id)", back_populates="medical_prescription")
    medical_info = relationship("AR_MedicalSupplies", primaryjoin="and_(AR_MedicalSupplies_PR.medical_id==AR_MedicalSupplies.id)", back_populates="medical_pr")


#PRESCRIPTION
class AR_Prescription(Base):
    __tablename__= 'ar_prescriptions'

    prescription_id= Column(CHAR(36), primary_key=True, index=True)
    prescription_no = Column(String(255), nullable=False,unique=True, index=True)
    admission_id = Column(CHAR(36),ForeignKey("ar_inpatients.admission_id"),nullable=True)
    outpatient_id = Column(String(255), nullable=True) #NEW
    date_prescribed = Column(Date,nullable=False)
    patient_status = Column(String(255), nullable=True)  #nEW
    status = Column(String(255),nullable=False, default="Unpaid")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=True)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)


    inpatient_info = relationship("AR_Inpatient", primaryjoin="and_(AR_Prescription.admission_id==AR_Inpatient.admission_id)", back_populates="my_prescriptions")
    medicines_prescription = relationship("AR_Medicine_PR", primaryjoin="and_(AR_Prescription.prescription_id==AR_Medicine_PR.prescription_id)",back_populates="prescription_info")
    medical_prescription = relationship("AR_MedicalSupplies_PR", primaryjoin="and_(AR_Prescription.prescription_id==AR_MedicalSupplies_PR.prescription_id)",back_populates="prescription_info")
   

     
# MEDICAL SUPPLIES TABLE
class AR_MedicalSupplies(Base):
    __tablename__= 'ar_medicalsupplies'
    id= Column(CHAR(36), primary_key=True, index=True)
    ms_product_name = Column (String(255), unique=True,nullable=False)
    ms_quantity = Column(Integer,nullable=False)
    ms_manufacturer = Column (CHAR(36), nullable=True)  #NEW1 ,ForeignKey("manufacturers.id")
    ms_manufactured_date = Column (Date,nullable=False)
    ms_import_date = Column(Date,nullable=False)
    ms_expiration_date = Column (Date,nullable=False)
    ms_batch_number = Column (Integer,nullable=False)
    ms_unit_price = Column (Float,nullable=False)
    ms_tax = Column (Integer,nullable=True)
    ms_purpose = Column (String(255),nullable=False)
    condition = Column(String(255),nullable=False, default="no issue")
    status = Column(String(255),nullable=False, default="High")
    #dosage = Column (Integer,nullable=False)
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=True)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)

    # manufacturer_information = relationship("Manufacturer", primaryjoin="and_(MedicalSupplies.    ms_manufacturer==Manufacturer.id)", back_populates="medicalsupplies_info")                      #NEW1 COMMENT MUNA

   
    # PRESCRIPTION FOR MEDICAL SUPPPLIES
    medical_pr = relationship("AR_MedicalSupplies_PR", primaryjoin="and_(AR_MedicalSupplies.id==AR_MedicalSupplies_PR.medical_id)",back_populates="medical_info")
    #POS Medical
    # medical_item = relationship("Medical_item", primaryjoin="and_(MedicalSupplies.id==Medical_item.medical_id)", back_populates="medical_info")                                                               #NEW1 COMMENT MUNA


#////////////////////////////////////////////////////////////////////////////////////////////////////////////////#
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////#
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////#

#GALING PHARMACY  #HINDI NAGAMIT
# class PharmacyInvoice(Base):
#     __tablename__= 'pharmacy_invoice'

#     id= Column(CHAR(36), primary_key=True, index=True)
#     invoice_no = Column(String(255), nullable=False,unique=True, index=True)
#     admission_id = Column(CHAR(36), ForeignKey("inpatients.admission_id"),nullable=True)  ## inpatients with s po
#     invoice_date = Column(Date,nullable=True)
#     medicine_pr_id= Column(CHAR(36),ForeignKey("medicine_pr.medpr_id"),nullable=True)  #medicalsupplies_pr
#     total_amount= Column(Float, nullable=False)

#     status = Column(String(255),nullable=False, default="Unpaid")
#     created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=True)
#     created_at = Column(DateTime,nullable=False)
#     updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
#     updated_at = Column(DateTime,nullable=True)


#     inpatient_info = relationship("Inpatient", primaryjoin="and_(PharmacyInvoice.admission_id==Inpatient.admission_id)")    ###NEW1 PharmacyInvoice  //Deleted , back_populates="invoice_info"
#     #sales_invoice = relationship("Sales", primaryjoin="and_(Inpatient_invoice.id==Sales.invoice_id)", back_populates="invoice_info")   ### DI NAMIN NEED ITO ##




################################################################################ BILLING
class AR_HospitalServiceName(Base):
    __tablename__ = "ar_hospital_service_name"
    id = Column(String(36), primary_key=True,index=True)
    description_name = Column(String(255),nullable=False,unique=True, index=True)
    unit_price = Column(Float, nullable=False)
    status = Column(String(100), default='Active')
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)

class AR_HospitalServices(Base):
    __tablename__ = "ar_hospital_services"
    id = Column(String(36), primary_key=True,index=True)
    admission_id = Column(String(36), ForeignKey("ar_inpatients.admission_id"),nullable=False)
    hospital_service_name_id = Column(String(36), ForeignKey("ar_hospital_service_name.id"),nullable=False)
    quantity= Column(Float,nullable=False)
    date= Column(Date, nullable=False)
    total_amount= Column(Float,nullable=False)
 
    status = Column(String(100), default='Pending',nullable=False) #nullable=False             ### STATUS TO FOR BILLING ###
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)

    hc_treatment_services = relationship(
         "AR_HospitalServiceName", primaryjoin="and_(AR_HospitalServices.hospital_service_name_id==AR_HospitalServiceName.id)")

    admission_info = relationship(
        "AR_Inpatient", primaryjoin="and_(AR_HospitalServices.admission_id==AR_Inpatient.admission_id)")  #NEW1 PatientRegistration

# /////////////////////////////////////////////////////////////////////////////////////////////////////////////
class AR_HospitalChargesBill(Base):
    __tablename__ = "ar_hospital_charges_bill"
    id = Column(CHAR(36), primary_key=True,index=True)
    invoice_no= Column(String(100) ,unique=True)
    invoice_date = Column(DateTime, nullable=False)
    inpatient_bill_id = Column(String(36), ForeignKey("ar_inpatient_bills.id"),nullable=True)
    hospital_services_id = Column(String(36), ForeignKey("ar_hospital_services.id"),nullable=False,unique=True)
    total_amount= Column(Float,nullable=False)
    cancellation_return = Column(Float, nullable=True)

    status = Column(String(100), default='Active')
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())   
    
    hospital_charges_id_info = relationship(
         "AR_HospitalServices", primaryjoin="and_(AR_HospitalChargesBill.hospital_services_id==AR_HospitalServices.id)")  #NEW1 HospitalServices hospital_services_id


class AR_TreatmentBill(Base):
    __tablename__ = "ar_treatment_bill"
    id = Column(CHAR(36), primary_key=True,index=True)
    invoice_no= Column(String(100) ,unique=True)
    invoice_date = Column(DateTime, nullable=False)
    inpatient_bill_id = Column(String(36), ForeignKey("ar_inpatient_bills.id"),nullable=True)

    treatment_id = Column(String(36), ForeignKey("ar_treatments.id"),nullable=False)
    total_amount= Column(Float,nullable=False)
    cancellation_return = Column(Float, nullable=True)

    status = Column(String(255), nullable=False, server_default="Pending")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())   

    treatment_id_info = relationship(
         "AR_Treatment", primaryjoin="and_(AR_TreatmentBill.treatment_id==AR_Treatment.id)")


class AR_LabRequestBill(Base):
    __tablename__ = "ar_lab_requests_bill"
    id = Column(CHAR(36), primary_key=True,index=True)
    invoice_no= Column(String(100) ,unique=True)
    invoice_date = Column(DateTime, nullable=False)

    inpatient_bill_id = Column(String(36), ForeignKey("ar_inpatient_bills.id"),nullable=True)
    lab_requests_id = Column(String(36), ForeignKey("ar_lab_requests.id"),nullable=False)
    total_amount= Column(Float,nullable=False)
    cancellation_return = Column(Float, nullable=True)

    status = Column(String(255), nullable=False, server_default="Pending")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())   

    lab_requests_id_info = relationship(
         "AR_LabRequest", primaryjoin="and_(AR_LabRequestBill.lab_requests_id==AR_LabRequest.id)")

class AR_PharmacyBill(Base):
    __tablename__ = "ar_pharmacy_bill"
    id = Column(CHAR(36), primary_key=True,index=True)
    invoice_no= Column(String(100) ,unique=True)
    invoice_date = Column(DateTime, nullable=False)

    inpatient_bill_id = Column(String(36), ForeignKey("ar_inpatient_bills.id"),nullable=True)
    # pharmacy_invoice_id = Column(String(36), ForeignKey("pharmacy_invoice.id"),nullable=False) #NEW1 REMOVED COLUMN
    medpr_id= Column(CHAR(36),ForeignKey("ar_medicine_pr.medpr_id"),nullable=False)  #NEW2 NEW COLUMN
    total_amount= Column(Float,nullable=False)
    cancellation_return = Column(Float, nullable=True  , default=00)

    status = Column(String(255), nullable=False, server_default="Pending")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())   
    
    # pharmacy_invoice_id_info = relationship(
    #      "PharmacyInvoice", primaryjoin="and_(PharmacyBill.pharmacy_invoice_id==PharmacyInvoice.id)")

    # inpatient_bill_id_info = relationship(
    #     "InpatientBill", primaryjoin="and_(PharmacyBill.inpatient_bill_id==InpatientBill.id)")



class AR_RoomBill(Base):
    __tablename__ = "ar_room_bill"    
    id = Column(CHAR(36), primary_key=True)
    invoice_no = Column(String(100), nullable=False, unique=True)
    invoice_date = Column(DateTime, nullable=False)
    admission_id = Column(String(36), ForeignKey("ar_inpatients.admission_id"), nullable=False) #NEW1 Deleted management
    inpatient_bill_id = Column(String(36), ForeignKey("ar_inpatient_bills.id"), nullable=True)
    total_amount = Column(Float, nullable=False)

    status = Column(String(255), nullable=False, server_default="Pending")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())   
    
    inpatient_management_id_info = relationship(
         "AR_Inpatient", primaryjoin="and_(AR_RoomBill.admission_id==AR_Inpatient.admission_id)") #NEW1 Management deleted

    # inpatient_bill_id_info = relationship(
    #     "InpatientBill",primaryjoin="and_(RoomBill.inpatient_bill_id==InpatientBill.id)")

class AR_DoctorFeeBill(Base):
    __tablename__ = "ar_doctor_fee_bill"
    id = Column(CHAR(36), primary_key=True,index=True)
    invoice_no= Column(String(100) ,unique=True)
    invoice_date = Column(DateTime, nullable=False)

    inpatient_bill_id = Column(String(36), ForeignKey("ar_inpatient_bills.id"),nullable=True)
    doctor_id = Column(String(36), ForeignKey("ar_doctor_profile.doctor_id"),nullable=False)
    
    actual_pf = Column(Float,nullable=False)
    sc_pwd_discount = Column(Float, nullable=True)
    philhealth = Column(Float, nullable=True)
    discount = Column(Float, nullable=True)
    hmo = Column(Float, nullable=True)
    patient_due = Column(Float, nullable=False)

    status = Column(String(100), default='Active')
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())   
    
    # doctor_fee_id_info = relationship(
    #      "Doctor_fee", primaryjoin="and_(DoctorFeeBill.doctor_fee_id==Doctor_fee.doctor_fee_id)")


class AR_InpatientBill(Base):
    __tablename__ = "ar_inpatient_bills"    
    id = Column(CHAR(36), primary_key=True)
    inpatient_bill_no = Column(String(255), nullable=False, unique=True)
    admission_id = Column(String(36), ForeignKey("ar_inpatients.admission_id"),nullable=False)
    inpatient_payment_id = Column(String(36), ForeignKey("ar_inpatient_payments.id"),nullable=True)

    date_of_billing = Column(Date,nullable=False)
    due_date = Column(Date,nullable=False)
    balance_due = Column(Float, nullable=False, server_default="0")
    status = Column(String(255), nullable=False, server_default="Pending")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=True)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

    inpatient_info = relationship(
        "AR_Inpatient", primaryjoin="and_(AR_InpatientBill.admission_id==AR_Inpatient.admission_id)")
    bill_treatments = relationship(
        "AR_TreatmentBill", primaryjoin="and_(AR_InpatientBill.id ==AR_TreatmentBill.inpatient_bill_id)")
    bill_lab_requests = relationship(
        "AR_LabRequestBill", primaryjoin="and_(AR_InpatientBill.id ==AR_LabRequestBill.inpatient_bill_id)")
    bill_pharmacy = relationship(
        "AR_PharmacyBill", primaryjoin="and_(AR_InpatientBill.id ==AR_PharmacyBill.inpatient_bill_id)")
    bill_hospital_charges = relationship(
        "AR_HospitalChargesBill", primaryjoin="and_(AR_InpatientBill.id ==AR_HospitalChargesBill.inpatient_bill_id)")
    bill_room = relationship(
        "AR_RoomBill", primaryjoin="and_(AR_InpatientBill.id ==AR_RoomBill.inpatient_bill_id)")
    # bill_doctor_fee = relationship("DoctorFeeBill")
    bill_doctor_fee = relationship(
        "AR_DoctorFeeBill", primaryjoin="and_(AR_InpatientBill.id ==AR_DoctorFeeBill.inpatient_bill_id)")

    # bill_doctor_fee = relationship("DoctorFeeBill", primaryjoin="and_(InpatientBill.id ==DoctorFeeBill.inpatient_bill_id)")


# FROM CMS
class AR_Inpatient_payment(Base):
    __tablename__ = "ar_inpatient_payments"    
    id = Column(CHAR(36), primary_key=True)
    or_no = Column(String(255),nullable=False,unique=True)
    inpatient_bill_id = Column(CHAR(36), ForeignKey("ar_inpatient_bills.id"), nullable=False)
    total_amount_paid = Column(Float,nullable=False)
    payment_term_id = Column(CHAR(36),  nullable=False)                 #COMMENT KO MUNA ForeignKey("payment_terms.id"),
    date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())      
    patient_cash_payment_id = Column(CHAR(36),nullable=True)            #COMMENT KO MUNA , ForeignKey("patient_cash_payments.id")
    patient_check_payment_id = Column(CHAR(36),nullable=True)           #COMMENT KO MUNA , ForeignKey("patient_check_payments.id")
    payment_method_id = Column(CHAR(36),nullable=False)                 #COMMENT KO MUNA , ForeignKey("payment_methods.id")
     
    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())
#/////////////////////////////////////////////////////////////////////////////////////////////////////////////////#

# //NEW
class AR_Payment_term(Base):
    __tablename__ = "ar_payment_terms"    
    id = Column(CHAR(36), primary_key=True)
    term_name = Column(String(255),nullable=False,unique=True)
    description = Column(Text,nullable=False)
    status = Column(String(255), nullable=False, server_default="Active")
    
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())


class AR_AccountsReceivableLedger(Base):
    __tablename__ = "ar_accounts_receivable_ledgers"    
    id = Column(CHAR(36), primary_key=True)
    inpatient_bill_id = Column(CHAR(36), ForeignKey("ar_inpatient_bills.id"), nullable=False)
    inpatient_payment_id = Column(String(36), ForeignKey("ar_inpatient_payments.id"),nullable=False)
    amount_outstanding = Column(Float, nullable=False, server_default="0")
    days_overdue = Column(Numeric,nullable=False) 
    status = Column(String(255), nullable=False, server_default="Pending")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())









########################################### ACCOUNTS PAYABLE
# class Maintenance_provider(Base):
#     __tablename__ = 'maintenance_providers'

#     maintenance_provider_id = Column(String(36), primary_key=True, default=text('UUID()'))
#     maintenance_provider_name = Column(String(255), nullable=True)
#     maintenance_provider_contact = Column(String(255), nullable=True)
#     maintenance_provider_email = Column(String(255), nullable=True) 
#     active_status = Column(String(255), nullable=True, default=('Active'))
#     created_at = Column(DateTime, default=text('NOW()'))
#     updated_at = Column(DateTime, onupdate=text('NOW()'))

#     maintenance = relationship('Maintenance')


# class Maintenance(Base):
#     __tablename__ = 'maintenances'

#     maintenance_id = Column(String(36), primary_key=True, default=text('UUID()'))
#     maintenance_provider_id = Column(String(36), ForeignKey('maintenance_providers.maintenance_provider_id'), nullable=False)
#     asset_id = Column(String(36), nullable=False) #COMMENT MUNA  ForeignKey('assets.asset_id')
#     maintenance_name = Column(String(255), nullable=True)
#     maintenance_details = Column(String(255), nullable=True)
#     maintenance_cost = Column(Numeric, nullable=True)
#     maintenance_day = Column(Integer, nullable=True)
#     maintenance_due = Column(DateTime, nullable=True)
#     maintenance_completed = Column(DateTime, nullable=True)
#     maintenance_repeatable = Column(String(255), nullable=True)
#     maintenance_status = Column(String(255), nullable=True)
#     remarks = Column(String(255), nullable=True)
#     active_status = Column(String(255), nullable=True, default=('Active'))
#     created_at = Column(DateTime, default=text('NOW()'))
#     updated_at = Column(DateTime, onupdate=text('NOW()'))

#     Maintenance_provider = relationship('Maintenance_provider', back_populates='maintenance', lazy='joined')



# class Maintenance_Report(Base):
#     __tablename__ = 'maintenance_reports'

#     maintenance_report_id = Column(String(36), primary_key=True, default=text('UUID()'))
#     maintenance_id = Column(String(36), ForeignKey('maintenances.maintenance_id'), nullable=False)
#     maintenance_cost = Column(Numeric, nullable=True)
#     completed_date = Column(DateTime, nullable=True)
#     remarks = Column(Text, nullable=True)
#     created_at = Column(DateTime, default=text('NOW()'))
#     updated_at = Column(DateTime, onupdate=text('NOW()'))
#     maintenance_details = relationship('Maintenance', foreign_keys=[maintenance_id], lazy='joined')


    
# class AP_MaintenanceReport(Base):
#     __tablename__ = 'accounts_payable_maintenance_reports'
#     accounts_payable_id = Column(String(36), ForeignKey("accounts_payable_ledgers.id"), nullable=True)
#     maintenance_id = Column(String(36), ForeignKey('maintenance_reports.maintenance_report_id'), nullable=False)

# class AP_PurchaseInvoice(Base):
#     __tablename__ = 'ap_purchase_invoice'
#     accounts_payable_id = Column(String(36), ForeignKey("accounts_payable_ledgers.id"), nullable=True)
#     purchare_order_invoice_id = Column(String(36), ForeignKey('invoice.id'), nullable=False)
    



# class PurchaseOrder(Base):
#     __tablename__ = "purchase_order"

#     id = Column(String(255), primary_key=True)   #default=uuid.uuid4    
#     purchase_order_number = Column(Integer, unique=True, index=True)

#     order_date = Column(Date, nullable=True, index=True)
#     expected_delivery_date = Column(Date, nullable=True, index=True)
    
#     notes = Column(String(255), nullable=True, index=True)
#     status = Column(String(255), nullable=True, index=True,default="active")


#     subtotal = Column(Float, nullable=False, index=True)
#     discount = Column(Float, nullable=False, index=True)
#     tax = Column(Float, nullable=False, index=True)
#     total_amount = Column(Float, nullable=False, index=True)


# class Invoice(Base):
#     __tablename__ = "invoice"
#     id = Column(String(255), primary_key=True)
#     prepared_by = Column(String(255), nullable=True, index=True)
#     message = Column(TEXT, nullable=True, index=True)
    
#     status = Column(String(255), nullable=True, index=True,default="Pending")
#     invoice_date = Column(Date, nullable=False, index=True)
#     due_date = Column(Date, nullable=False, index=True)
#     billing_address = Column(String(255), nullable=False, index=True)
#     amount_paid = Column(String(255), nullable=True, index=True,default=0)
    

#     # relation with vendor
#     purchase_order_id = Column(String(255), 
#         ForeignKey("purchase_order.id", onupdate='CASCADE'),unique=True, nullable=False)

#     purchase_order = relationship("PurchaseOrder")

    # relation with vendor
    # created_by = Column(String(255), ForeignKey("vendor.id", onupdate='CASCADE'), nullable=True)
    # updated_by = Column(String(255), ForeignKey("vendor.id", onupdate='CASCADE'), nullable=True)
    # creator = relationship("Vendor",foreign_keys=[created_by])
    # updater = relationship("Vendor",foreign_keys=[updated_by])
     
    # created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    # created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
    # updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    # updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())


# class Purchase_order_vendor_payment(Base):
#     __tablename__ = "purchase_order_vendor_payments"    
#     id = Column(CHAR(36), primary_key=True)
#     or_no = Column(String(255),nullable=False,unique=True)
#     purchase_order_vendor_bill_id = Column(CHAR(36),  ForeignKey("invoice.id"), nullable=False)
#     total_amount_paid = Column(Float,nullable=False)
#     payment_term_id = Column(CHAR(36), nullable=False)  #COMMENT ForeignKey("payment_terms.id")
#     date_of_payment = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
#     hospital_cash_payment_id = Column(CHAR(36),nullable=True) #COMMENT , ForeignKey("hospital_cash_payments.id")
#     hospital_check_payment_id = Column(CHAR(36),nullable=True) #COMMENT , ForeignKey("hospital_check_payments.id")
#     payment_method_id = Column(CHAR(36),nullable=False) #COMMENT , ForeignKey("payment_methods.id")

#     status = Column(String(255), nullable=False, server_default="Active")
        
#     created_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=False)
#     created_at = Column(DateTime (timezone=True), nullable=False, server_default=func.now())
#     updated_by = Column(CHAR(36), ForeignKey("ar_users.id"), nullable=True)
#     updated_at = Column(DateTime (timezone=True), nullable=True, onupdate=func.now())

       

class AR_Purchase_order(Base):
    __tablename__ = "ar_purchase_order" 
    id = Column(CHAR(36), primary_key=True,index=True)
    purchase_order_number= Column(String(255),nullable=False,unique=True, index=True)
    total_bill= Column(Float, nullable=False)			
    order_date= Column(Date, nullable=False)				
    expected_delivery_date= Column(Date, nullable=False)				
    payment_method = Column(String(255), nullable=False)
    notes = Column(String(255), nullable=False)

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)

    updated_by_info = relationship("AR_User", primaryjoin="and_(AR_Purchase_order.updated_by==AR_User.id)")

    

class AR_Utilities(Base):
    __tablename__ = "ar_utilities" 
    id = Column(CHAR(36), primary_key=True,index=True)
    utility_type= Column(String(255),nullable=False)
    utility_name= Column(String(255),nullable=False, index=True)
    utility_bill= Column(Float, nullable=False)	 				
    due_date= Column(Date, nullable=False)				
    payment_method = Column(String(255), nullable=False)
    notes = Column(String(255), nullable=False)

    status2 = Column(String(255), nullable=False, server_default="Not Journalized")

    status = Column(String(255), nullable=False, server_default="Active")
    created_by = Column(CHAR(36), ForeignKey("ar_users.id"),nullable=False)
    created_at = Column(DateTime,nullable=False)
    updated_by = Column(CHAR(36),ForeignKey("ar_users.id"),nullable=True)
    updated_at = Column(DateTime,nullable=True)
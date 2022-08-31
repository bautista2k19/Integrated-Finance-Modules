# module
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

# homies 
from API.hashing import hasher
from API import security, models

# authenticate login credentials
def authenticate(db: Session, request: OAuth2PasswordRequestForm = Depends()):
    try:
        user = db.query(models.User).filter(models.User.email == request['username']).first()
        if not user or not hasher.verify(request['password'], user.password): 
            return {
                'type': 'warning',
                'detail': 'Invalid Credentials.'
            }
        elif user.status == 'Inactive':
            return {
                'type': 'warning',
                'detail': 'Your account is inactive.'
            }
        
        del user.password

        employee = db.query(models.Employee).filter(models.Employee.id == user.employee_id).first()
        user_type = db.query(models.User_type).filter(models.User_type.id == user.user_type_id).first()
        department = db.query(models.Department).filter(models.Department.id == employee.department_id).first()

        employee.department = department
        user.employee = employee
        user.user_type = user_type

        # content
        content = {
            #'user_profile_pic': user.profile_pic_url,
            'USER_ID': user.id,
            'EMP_ID': employee.id,
            'EMP_NAME': employee.first_name+ " " + employee.last_name,
            'USER_TYPE': user_type.user_type, # temporary
            'DEPARTMENT': department.main_department_name,
            'endpoint': 'main_dashboard', # temporary
            'type': 'success',
            'detail': 'Logging in...'
        }

        # response w/ content
        response = JSONResponse(content=content)
        # create access_token & refresh_token 
        access_token = security.create_token(
            data={"sub": user.email},
            secret_key=security.ACCESS_SECRET_KEY,
            minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        refresh_token = security.create_token(
            data={"sub": user.email},
            secret_key=security.REFRESH_SECRET_KEY,
            days=security.REFRESH_TOKEN_EXPIRE_DAYS
        )
        # Set httponly cookie
        response.set_cookie(
            key="access_token", 
            value=f"bearer {access_token}", 
            path='/',
            expires=900, # 15 min
            max_age=900, # 15 min
            httponly=True, 
            samesite="Strict",
            secure=True
        )
        response.set_cookie(
            key="refresh_token", 
            value=f"bearer {refresh_token}", 
            path='/',
            expires=86400, # 1 day
            max_age=86400, # 1 day
            httponly=True, 
            samesite="Strict",
            secure=True
        )
        return response

    except:
        return {
            'type': 'error',
            'detail': 'Internal Server Error.'
        }
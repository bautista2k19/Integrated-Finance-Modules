from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel


class ShowDepartment(BaseModel):
    id:str
    main_department_name:str
    main_department_desc:Optional[str]
    status: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
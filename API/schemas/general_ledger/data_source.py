#Module
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

#recruitment_management
from API.schemas.employee.user import CreatorUpdater

class DataSourceBase(BaseModel):
    name: str
    endpoint: str
    description: str = ''
    status: str

class DataSourceGet(DataSourceBase):
    id: str

    class Config():
        orm_mode = True

class DataSourceGetAll(DataSourceBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]
    ds_created_by: CreatorUpdater
    ds_updated_by: Optional[CreatorUpdater]

    class Config():
        orm_mode = True

class DataSourceGetForTable(BaseModel):
    draw: int
    recordsTotal: int
    recordsFiltered: int
    data: List[DataSourceGet] = []

    class Config():
        orm_mode = True

class DataSourceGetForSelect(BaseModel):
    id: str
    text: str

    class Config():
        orm_mode = True
from datetime import date, datetime, time
from typing import List, Optional


from pydantic import BaseModel

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
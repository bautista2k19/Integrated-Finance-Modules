from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID


class Token(BaseModel):
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
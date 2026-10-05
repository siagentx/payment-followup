from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, EmailStr


class InvoiceCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    amount: Decimal
    due_date: date
    description: Optional[str] = None


class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    public_token: str

    customer_name: str
    customer_email: EmailStr
    amount: Decimal
    due_date: date
    description: Optional[str]

    status: str
    created_at: datetime
    paid_at: Optional[datetime]

    user_id: int

    class Config:
        from_attributes = True
class InvoiceUpdate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    amount: Decimal
    due_date: date
    description: Optional[str] = None        
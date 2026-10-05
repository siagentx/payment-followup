from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, EmailStr


class PublicInvoiceResponse(BaseModel):
    invoice_number: str
    customer_name: str
    customer_email: EmailStr

    amount: Decimal
    due_date: date
    description: Optional[str]

    status: str
    created_at: datetime
    paid_at: Optional[datetime]

    class Config:
        from_attributes = True
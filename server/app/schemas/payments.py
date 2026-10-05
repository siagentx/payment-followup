from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class PaymentCreate(BaseModel):

    amount: Decimal

    payment_method: str

    transaction_id: str | None = None


class PaymentResponse(BaseModel):

    id: int

    invoice_id: int

    amount: Decimal

    payment_method: str

    transaction_id: str | None

    status: str

    paid_at: datetime

    class Config:
        from_attributes = True
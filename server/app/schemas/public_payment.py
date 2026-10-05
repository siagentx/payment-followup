from decimal import Decimal

from pydantic import BaseModel


class PublicPaymentCreate(BaseModel):
    amount: Decimal
    payment_method: str


class PublicPaymentResponse(BaseModel):
    message: str
    invoice_number: str
    amount: Decimal
    payment_method: str
    status: str
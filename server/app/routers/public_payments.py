from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.invoice import Invoice
from app.models.payments import Payment
from app.schemas.public_payment import (
    PublicPaymentCreate,
    PublicPaymentResponse
)


router = APIRouter(
    prefix="/public-payments",
    tags=["Public Payments"]
)


@router.post(
    "/{public_token}",
    response_model=PublicPaymentResponse
)
def create_public_payment(
    public_token: str,
    payment_data: PublicPaymentCreate,
    db: Session = Depends(get_db)
):

    invoice = db.query(Invoice).filter(
        Invoice.public_token == public_token
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    if invoice.status == "paid":
        raise HTTPException(
            status_code=400,
            detail="Invoice is already paid"
        )

    if payment_data.amount != invoice.amount:
        raise HTTPException(
            status_code=400,
            detail="Payment amount does not match invoice amount"
        )

    payment = Payment(
        invoice_id=invoice.id,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method,
        transaction_id=None,
        status="success",
        paid_at=datetime.now(timezone.utc)
    )

    db.add(payment)

    invoice.status = "paid"
    invoice.paid_at = datetime.now(timezone.utc)

    db.commit()

    return {
        "message": "Payment successful",
        "invoice_number": invoice.invoice_number,
        "amount": payment.amount,
        "payment_method": payment.payment_method,
        "status": "success"
    }
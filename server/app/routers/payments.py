from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.invoice import Invoice
from app.models.payments import Payment
from app.models.user import User

from app.schemas.payments import (
    PaymentCreate,
    PaymentResponse
)

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.post(
    "/{invoice_id}",
    response_model=PaymentResponse
)
def create_payment(
    invoice_id: int,
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
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
        transaction_id=payment_data.transaction_id,
        status="success",
        paid_at=datetime.now(timezone.utc)
    )

    db.add(payment)

    invoice.status = "paid"
    invoice.paid_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(payment)

    return payment

@router.get(
    "/{invoice_id}",
    response_model=list[PaymentResponse]
)
def get_payment_history(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    payments = db.query(Payment).filter(
        Payment.invoice_id == invoice.id
    ).all()

    return payments
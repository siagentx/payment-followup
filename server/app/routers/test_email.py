from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.invoice import Invoice

from app.services.email_service import send_email

from app.services.reminder_templates import (
    due_soon_template
)
from app.services.reminder_service import send_invoice_reminder
router = APIRouter(
    prefix="/test",
    tags=["Testing"]
)


@router.post("/invoice-email/{invoice_id}")
def test_invoice_email(
    invoice_id: int,
    db: Session = Depends(get_db)
):

    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id
    ).first()

    if not invoice:
        return {
            "message": "Invoice not found"
        }

    subject, body = due_soon_template(invoice)

    send_email(
        to=invoice.customer_email,
        subject=subject,
        body=body
    )

    return {
        "message": "Invoice email sent successfully"
    }

@router.post("/reminder/{invoice_id}")
def test_reminder(
    invoice_id: int,
    db: Session = Depends(get_db)
):

    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id
    ).first()

    if not invoice:
        return {
            "message": "Invoice not found"
        }

    result = send_invoice_reminder(invoice)

    if not result:
        return {
            "message": "No reminder required"
        }

    return {
        "message": "Reminder sent successfully"
    }
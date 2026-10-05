from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.dependencies import get_current_user

from app.models.invoice import Invoice
from app.models.user import User

from app.schemas.dashboard import DashboardResponse


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoices = db.query(Invoice).filter(
        Invoice.user_id == current_user.id
    ).all()

    total_invoices = len(invoices)

    total_invoiced = sum(
        invoice.amount
        for invoice in invoices
    )

    total_collected = sum(
        invoice.amount
        for invoice in invoices
        if invoice.status == "paid"
    )

    total_outstanding = sum(
        invoice.amount
        for invoice in invoices
        if invoice.status != "paid"
    )

    due_today = sum(
        1
        for invoice in invoices
        if invoice.status != "paid"
        and invoice.due_date == date.today()
    )

    overdue = sum(
        1
        for invoice in invoices
        if invoice.status != "paid"
        and invoice.due_date < date.today()
    )

    overdue_amount = sum(
        invoice.amount
        for invoice in invoices
        if invoice.status != "paid"
        and invoice.due_date < date.today()
    )

    paid = sum(
        1
        for invoice in invoices
        if invoice.status == "paid"
    )

    return {
        "total_invoices": total_invoices,
        "total_invoiced": total_invoiced,
        "total_outstanding": total_outstanding,
        "total_collected": total_collected,
        "overdue_amount": overdue_amount,
        "due_today": due_today,
        "overdue": overdue,
        "paid": paid
    }
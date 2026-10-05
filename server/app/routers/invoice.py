from fastapi import APIRouter, Depends,HTTPException
from datetime import datetime, timezone
from sqlalchemy.orm import Session
import uuid
from app.database.database import get_db
from app.core.dependencies import get_current_user
from app.core.invoice_status import get_invoice_status
from app.models.invoice import Invoice
from app.models.user import User

from app.schemas.invoice import (
    InvoiceCreate,
    InvoiceResponse,InvoiceUpdate
)


router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"]
)
@router.post("/", response_model=InvoiceResponse)
def create_invoice(invoice_data: InvoiceCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    invoice_number = f"INV-{uuid.uuid4().hex[:8].upper()}"

    public_token = uuid.uuid4().hex

    new_invoice = Invoice(
        invoice_number=invoice_number,
        public_token=public_token,

        customer_name=invoice_data.customer_name,
        customer_email=invoice_data.customer_email,
        amount=invoice_data.amount,
        due_date=invoice_data.due_date,
        description=invoice_data.description,

        user_id=current_user.id
    )

    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)

    return new_invoice

@router.get("/", response_model=list[InvoiceResponse])
def get_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoices = db.query(Invoice).filter(
        Invoice.user_id == current_user.id
    ).all()

    response = []

    for invoice in invoices:
        invoice_response = InvoiceResponse.model_validate(invoice)

        invoice_response.status = get_invoice_status(
            invoice.due_date,
            invoice.status
        )

        response.append(invoice_response)

    return response
@router.get("{invoice_id}",response_model=InvoiceResponse)
def get_invoice_by_id(invoice_id:int,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    try:
        inv=(db.query(Invoice).filter(Invoice.id==invoice_id,Invoice.user_id == current_user.id).first())
        if not inv:
            raise HTTPException(status_code=404,detail="invoice not found")
        return inv
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=404,detail="invoice not found")
@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice_by_id(
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

    calculated_status = get_invoice_status(
        invoice.due_date,
        invoice.status
    )

    response = InvoiceResponse.model_validate(invoice)

    response.status = calculated_status

    return response
@router.put("/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(
    invoice_id: int,
    invoice_data: InvoiceUpdate,
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

    invoice.customer_name = invoice_data.customer_name
    invoice.customer_email = invoice_data.customer_email
    invoice.amount = invoice_data.amount
    invoice.due_date = invoice_data.due_date
    invoice.description = invoice_data.description

    db.commit()
    db.refresh(invoice)

    return invoice
@router.delete("/{invoice_id}")
def delete_invoice(invoice_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id,Invoice.user_id == current_user.id).first()

    if not invoice:
        raise HTTPException(status_code=404,detail="Invoice not found")

    db.delete(invoice)
    db.commit()

    return {
        "message": "Invoice deleted successfully"
    }

@router.post("/{invoice_id}/pay", response_model=InvoiceResponse)
def mark_invoice_as_paid(invoice_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id,Invoice.user_id == current_user.id).first()

    if not invoice:
        raise HTTPException(status_code=404,detail="Invoice not found")

    if invoice.status == "paid":
        raise HTTPException(status_code=400,detail="Invoice is already paid")

    invoice.status = "paid"
    invoice.paid_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(invoice)

    return invoice
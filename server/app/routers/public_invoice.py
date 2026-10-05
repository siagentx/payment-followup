from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.invoice import Invoice

from app.schemas.public_invoice import PublicInvoiceResponse

from app.core.invoice_status import get_invoice_status

router = APIRouter(
    prefix="/invoice",
    tags=["Public Invoice"]
)
@router.get(
    "/{public_token}",
    response_model=PublicInvoiceResponse
)
def get_public_invoice(
    public_token: str,
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

    response = PublicInvoiceResponse.model_validate(invoice)

    response.status = get_invoice_status(
        invoice.due_date,
        invoice.status
    )

    return response
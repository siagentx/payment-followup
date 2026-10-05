from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database.database import Base


class Payment(Base):

    __tablename__ = "payments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    invoice_id = Column(
        Integer,
        ForeignKey("invoices.id"),
        nullable=False
    )

    amount = Column(
        Numeric(12, 2),
        nullable=False
    )

    payment_method = Column(
        String(50),
        nullable=False
    )

    transaction_id = Column(
        String(100),
        unique=True,
        nullable=True
    )

    status = Column(
        String(20),
        default="success",
        nullable=False
    )

    paid_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
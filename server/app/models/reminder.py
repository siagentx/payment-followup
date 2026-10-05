from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from app.database.database import Base


class ReminderHistory(Base):

    __tablename__ = "reminder_history"

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

    reminder_type = Column(
        String(30),
        nullable=False
    )

    sent_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
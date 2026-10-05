from apscheduler.schedulers.background import BackgroundScheduler

from app.database.database import SessionLocal
from app.models.invoice import Invoice

from app.services.reminder_service import (
    send_invoice_reminder
)


scheduler = BackgroundScheduler()


def check_invoice_reminders():

    db = SessionLocal()

    try:

        invoices = db.query(Invoice).filter(
            Invoice.status == "pending"
        ).all()

        for invoice in invoices:

            send_invoice_reminder(
                invoice,
                db
            )

    finally:

        db.close()


scheduler.add_job(
    check_invoice_reminders,
    "interval",
    minutes=1
)
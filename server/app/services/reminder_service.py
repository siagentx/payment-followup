from sqlalchemy.orm import Session

from app.models.reminder import ReminderHistory

from app.services.reminder_rules import (
    get_reminder_type
)

from app.services.reminder_templates import (
    due_soon_template,
    due_today_template,
    overdue_template
)

from app.services.email_service import send_email


def send_invoice_reminder(
    invoice,
    db: Session
):

    reminder_type = get_reminder_type(
        invoice.due_date,
        invoice.status
    )

    if reminder_type is None:
        return False

    existing_reminder = db.query(
        ReminderHistory
    ).filter(
        ReminderHistory.invoice_id == invoice.id,
        ReminderHistory.reminder_type == reminder_type
    ).first()

    if existing_reminder:
        return False

    if reminder_type == "due_soon":

        subject, body = due_soon_template(
            invoice
        )

    elif reminder_type == "due_today":

        subject, body = due_today_template(
            invoice
        )

    elif reminder_type == "overdue":

        subject, body = overdue_template(
            invoice
        )

    else:
        return False

    send_email(
        to=invoice.customer_email,
        subject=subject,
        body=body
    )

    reminder_history = ReminderHistory(
        invoice_id=invoice.id,
        reminder_type=reminder_type
    )

    db.add(reminder_history)
    db.commit()

    return True
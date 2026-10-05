from datetime import date


def get_invoice_status(
    due_date: date,
    status: str
):
    if status == "paid":
        return "paid"

    today = date.today()

    if due_date > today:
        return "pending"

    if due_date == today:
        return "due_today"

    return "overdue"
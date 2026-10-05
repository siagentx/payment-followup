from datetime import date


def get_reminder_type(due_date: date, status: str):

    if status == "paid":
        return None

    today = date.today()

    days_difference = (due_date - today).days

    if days_difference == 2:
        return "due_soon"

    if days_difference == 0:
        return "due_today"

    if days_difference < 0:
        return "overdue"

    return None
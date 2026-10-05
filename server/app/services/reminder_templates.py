def due_soon_template(invoice):

    subject = f"Invoice {invoice.invoice_number} - Payment Due Soon"

    body = f"""
Hello {invoice.customer_name},

This is a friendly reminder that your invoice
{invoice.invoice_number} is due on {invoice.due_date}.

Invoice Amount: ₹{invoice.amount}

Please arrange the payment before the due date.

Thank you.
"""

    return subject, body


def due_today_template(invoice):

    subject = f"Invoice {invoice.invoice_number} - Payment Due Today"

    body = f"""
Hello {invoice.customer_name},

This is a reminder that your invoice
{invoice.invoice_number} is due today.

Invoice Amount: ₹{invoice.amount}

Due Date: {invoice.due_date}

Please arrange the payment today.

Thank you.
"""

    return subject, body


def overdue_template(invoice):

    subject = f"Invoice {invoice.invoice_number} - Payment Overdue"

    body = f"""
Hello {invoice.customer_name},

Invoice {invoice.invoice_number}
for ₹{invoice.amount} was due on {invoice.due_date}.

This invoice is currently overdue.

Please arrange the payment at your earliest convenience.

Thank you.
"""

    return subject, body
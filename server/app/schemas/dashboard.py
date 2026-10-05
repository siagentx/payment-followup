from decimal import Decimal

from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_invoices: int

    total_invoiced: Decimal
    total_outstanding: Decimal
    total_collected: Decimal
    overdue_amount: Decimal

    due_today: int
    overdue: int
    paid: int
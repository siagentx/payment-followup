from fastapi import FastAPI

from app.database.database import Base, engine

from app.models.user import User
from app.models.invoice import Invoice
from app.routers.auth import router as auth_router
from app.routers.invoice import router as invoice_router
from app.routers.dashboard import router as dashboard_router
from app.routers.public_invoice import router as public_invoice_router
from app.routers.test_email import router as test_email_router
from app.models.reminder import ReminderHistory
from app.services.scheduler import scheduler
from contextlib import asynccontextmanager
from app.routers.payments import router as payments_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.scheduler import scheduler
from app.routers.public_payments import router as public_payment_router
Base.metadata.create_all(bind=engine)
@asynccontextmanager
async def lifespan(app: FastAPI):

    scheduler.start()

    yield

    scheduler.shutdown()

app = FastAPI(
    title="Invoice Reminder System"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(invoice_router)
app.include_router(dashboard_router)
app.include_router(public_invoice_router)
app.include_router(test_email_router)
app.include_router(payments_router)
app.include_router(public_payment_router)
@app.get("/")
def root():
    return {
        "message": "Invoice Reminder API is running"
    }
from sqlalchemy import (Column,Integer,String,Text,Numeric,Date,DateTime,ForeignKey)
from sqlalchemy.sql import func
from app.database.database import Base


class Invoice(Base):

    __tablename__ = "invoices"

    id = Column(Integer,primary_key=True,index=True)

    invoice_number = Column(String(50),unique=True,nullable=False,index=True)

    public_token = Column(String(100),unique=True,nullable=False,index=True)

    customer_name = Column(String(100),nullable=False)

    customer_email = Column(String(150),nullable=False)

    amount = Column(Numeric(12, 2),nullable=False)

    due_date = Column(Date,nullable=False)

    description = Column(Text,nullable=True)

    status = Column(String(20),default="pending",nullable=False)

    created_at = Column(DateTime(timezone=True),server_default=func.now())

    paid_at = Column(DateTime(timezone=True),nullable=True)

    user_id = Column(Integer,ForeignKey("users.id"),nullable=False)
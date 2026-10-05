# 💳 Payment Follow-up & Invoice Reminder System

A full-stack **Invoice Management and Payment Follow-up System** built with **FastAPI, React, Tailwind CSS, SQLAlchemy, JWT Authentication, SMTP, and APScheduler**.

The system helps businesses create and manage invoices, track payment status, send automated payment reminders, and provide customers with a public invoice page.

---

## 🚀 Features

### 🔐 Authentication

* User Signup
* User Login
* JWT-based authentication
* Protected API routes
* Current logged-in user endpoint
* Logout functionality
* User-specific invoice access

### 📄 Invoice Management

* Create invoices
* View all invoices
* View invoice details
* Edit invoices
* Delete invoices
* Automatically generated invoice numbers
* Customer name and email
* Invoice amount
* Due date
* Description
* Invoice payment status

### 📊 Dashboard

The dashboard provides:

* Total invoices
* Total invoiced amount
* Total outstanding amount
* Total collected amount
* Due today count
* Overdue invoice count
* Overdue amount
* Paid invoice count

### ⏰ Payment Reminder System

Automated reminders are supported for:

* Payment due soon
* Payment due today
* Overdue payments

The application uses **APScheduler** to periodically check pending invoices.

### 📧 Email Notifications

Email reminders are sent using SMTP.

Supported reminder templates:

* Due Soon
* Due Today
* Overdue

The system also maintains reminder history to prevent duplicate reminder emails.

### 💰 Payment Management

* Record invoice payments
* Payment method selection
* Payment transaction ID support
* Payment status
* Payment timestamp
* Payment history
* Automatically mark invoice as paid after successful payment

### 🌐 Public Invoice

Customers can view an invoice without logging in.

Example:

```text
/invoice/{public_token}
```

The public invoice page displays:

* Invoice number
* Customer name
* Amount
* Due date
* Description
* Payment status
* Payment option

### 📱 React Frontend

The frontend includes:

* Dashboard
* Invoice list
* Create Invoice
* Edit Invoice
* Invoice Details
* Payment UI
* Public Invoice page
* Payment Success page
* Protected routes
* Loading states
* Error handling
* Responsive UI
* Active sidebar navigation

---

# 🏗️ Tech Stack

## Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* JWT
* Passlib / Bcrypt
* APScheduler
* SMTP
* Uvicorn

## Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

## Development Tools

* VS Code
* Swagger / OpenAPI
* Git
* GitHub

---

# 📂 Project Structure

```text
payment-followup/
│
├── server/
│   │
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── invoice_status.py
│   │   │
│   │   ├── database/
│   │   │   └── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── invoice.py
│   │   │   ├── payment.py
│   │   │   └── reminder_history.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── invoice.py
│   │   │   └── payment.py
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── invoices.py
│   │   │   ├── dashboard.py
│   │   │   ├── payments.py
│   │   │   └── public_payments.py
│   │   │
│   │   ├── services/
│   │   │   ├── email_service.py
│   │   │   ├── reminder_service.py
│   │   │   └── scheduler.py
│   │   │
│   │   └── main.py
│   │
│   ├── .env
│   ├── .gitignore
│   ├── requirements.txt
│   └── invoice.db
│
└── invoice-frontend/
    │
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Loading.jsx
    │   │   └── ErrorMessage.jsx
    │   │
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Invoices.jsx
    │   │   ├── Login.jsx
    │   │   ├── CreateInvoice.jsx
    │   │   ├── EditInvoice.jsx
    │   │   ├── InvoiceDetails.jsx
    │   │   ├── PublicInvoice.jsx
    │   │   └── PaymentSuccess.jsx
    │   │
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── dashboardService.js
    │   │   ├── invoiceService.js
    │   │   └── paymentService.js
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── .env
    ├── package.json
    └── vite.config.js
```

---

# 🔄 Application Flow

## Company User Flow

```text
Signup
   ↓
Login
   ↓
JWT Access Token
   ↓
Dashboard
   ↓
Create Invoice
   ↓
Invoice Created
   ↓
Customer Receives Invoice
   ↓
Reminder System
   ↓
Payment
   ↓
Invoice Marked as Paid
   ↓
Dashboard Updated
```

## Customer Flow

```text
Public Invoice Link
        ↓
View Invoice
        ↓
Check Amount & Due Date
        ↓
Select Payment Method
        ↓
Payment
        ↓
Payment Successful
        ↓
Payment Confirmation
```

---

# 🔐 Authentication Flow

The application uses JWT authentication.

```text
React Login
     ↓
POST /auth/login
     ↓
FastAPI
     ↓
Validate Email + Password
     ↓
Generate JWT
     ↓
React stores access_token
     ↓
Axios attaches JWT
     ↓
Protected API
```

Protected requests use:

```http
Authorization: Bearer <access_token>
```

---

# 🔒 Authorization & Data Ownership

Each invoice belongs to a specific user.

The invoice contains:

```text
user_id
```

When retrieving or modifying an invoice, the backend checks both:

```python
Invoice.id == invoice_id
Invoice.user_id == current_user.id
```

This prevents one authenticated user from accessing another user's invoices.

---

# 📌 Invoice Status Logic

The database stores the actual payment state:

```text
pending
paid
```

The UI derives the display status using the invoice due date.

```text
If paid
    ↓
paid

If due_date > today
    ↓
pending

If due_date == today
    ↓
due_today

If due_date < today
    ↓
overdue
```

This prevents temporary states such as `overdue` and `due_today` from being permanently stored in the database.

---

# ⏰ Reminder System

The reminder scheduler checks pending invoices periodically.

```text
APScheduler
      ↓
Check Pending Invoices
      ↓
Calculate Due Date
      ↓
Determine Reminder Type
      ↓
Check Reminder History
      ↓
Send Email
      ↓
Save Reminder History
```

Reminder types:

```text
due_soon
due_today
overdue
```

Reminder history prevents the same reminder type from being sent repeatedly for the same invoice.

---

# 📧 Email System

The application uses SMTP for sending emails.

Example environment configuration:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```

For Gmail, an **App Password** should be used instead of the normal Gmail password.

Never commit `.env` to GitHub.

---

# 💳 Payment System

The application maintains payments separately from invoices.

### Invoice

Represents the amount that needs to be paid.

### Payment

Represents an actual payment transaction.

Payment information includes:

```text
invoice_id
amount
payment_method
transaction_id
status
paid_at
```

Relationship:

```text
Invoice
   │
   └── Payment
          ├── amount
          ├── payment_method
          ├── transaction_id
          ├── status
          └── paid_at
```

---

# 🌐 Public Invoice

Customers do not need an account to view an invoice.

Each invoice receives a unique public token.

Example:

```text
http://localhost:5173/invoice/752b3787c6214a3ea42a6803bbd211b0
```

The public API:

```http
GET /invoice/{public_token}
```

does not require JWT authentication.

---

# ⚠️ Payment Disclaimer

The current public payment implementation is an **MVP/simulated payment flow for learning purposes**.

It should **not be used for processing real money**.

For production, the application should integrate a payment gateway such as:

* Razorpay
* Stripe

The production payment flow should use:

```text
Customer
   ↓
Payment Gateway
   ↓
Payment Processing
   ↓
Gateway Webhook
   ↓
FastAPI
   ↓
Verify Payment
   ↓
Create Payment Record
   ↓
Mark Invoice Paid
```

The backend should verify the gateway response/webhook before marking an invoice as paid.

---

# ⚙️ Backend Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Move into the backend:

```bash
cd payment-followup/server
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🎨 Frontend Installation

Open another terminal.

```bash
cd payment-followup/invoice-frontend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start React:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 API Documentation

FastAPI automatically provides Swagger documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

Main API groups include:

```text
Authentication
Invoices
Dashboard
Payments
Public Invoice
Public Payments
```

---

# 📊 Main API Endpoints

## Authentication

```http
POST /auth/signup
POST /auth/login
GET  /auth/me
```

## Invoices

```http
POST   /invoices/
GET    /invoices/
GET    /invoices/{invoice_id}
PUT    /invoices/{invoice_id}
DELETE /invoices/{invoice_id}
POST   /invoices/{invoice_id}/pay
```

## Dashboard

```http
GET /dashboard/
```

## Payments

```http
POST /payments/{invoice_id}
GET  /payments/{invoice_id}
```

## Public Invoice

```http
GET /invoice/{public_token}
```

## Public Payment

```http
POST /public-payments/{public_token}
```

---

# 🗄️ Database Models

## User

```text
User
 ├── id
 ├── name
 ├── email
 ├── password
 └── created_at
```

## Invoice

```text
Invoice
 ├── id
 ├── invoice_number
 ├── public_token
 ├── customer_name
 ├── customer_email
 ├── amount
 ├── due_date
 ├── description
 ├── status
 ├── created_at
 ├── paid_at
 └── user_id
```

## Payment

```text
Payment
 ├── id
 ├── invoice_id
 ├── amount
 ├── payment_method
 ├── transaction_id
 ├── status
 └── paid_at
```

## Reminder History

```text
ReminderHistory
 ├── id
 ├── invoice_id
 ├── reminder_type
 └── sent_at
```

---

# 🛡️ Security Features

The project implements:

* Password hashing
* JWT authentication
* Protected API endpoints
* User-based invoice ownership
* Public token instead of exposing internal invoice access
* Request validation using Pydantic
* Environment variables for SMTP credentials
* 401 handling in Axios
* Protected React routes

The frontend `ProtectedRoute` is only a navigation convenience. Actual security is enforced by the FastAPI backend.

---

# 📱 Frontend Routes

## Public Routes

```text
/login
/invoice/:publicToken
/payment-success
```

## Protected Routes

```text
/
/dashboard
/invoices
/invoices/create
/invoices/:invoiceId
/invoices/:invoiceId/edit
```

Users without a valid access token are redirected to:

```text
/login
```

---

# 🎨 UI

The frontend was built using **Tailwind CSS**.

Main UI sections:

```text
Dashboard
   ├── Summary Cards
   ├── Invoice Statistics
   └── Payment Statistics

Invoices
   ├── Invoice List
   ├── Create
   ├── Edit
   ├── Delete
   └── View

Invoice Details
   ├── Customer Information
   ├── Invoice Information
   └── Payment

Public Invoice
   ├── Invoice Details
   ├── Payment Method
   └── Payment Confirmation
```

---

# 🏭 Production Improvements

Possible future improvements include:

* PostgreSQL database
* Razorpay/Stripe integration
* Webhook-based payment verification
* HttpOnly secure cookies
* Refresh token authentication
* Password reset
* Email verification
* PDF invoice generation
* Invoice PDF email attachments
* Reminder history UI
* Payment receipt generation
* Role-based access control
* Redis-based background jobs
* Celery/RQ for production task processing
* Docker deployment
* CI/CD pipeline
* Automated tests
* Rate limiting
* Centralized logging

---

# 🎯 Learning Outcomes

This project helped demonstrate practical knowledge of:

* REST API development
* FastAPI
* SQLAlchemy ORM
* Pydantic validation
* JWT authentication
* Authorization
* Database relationships
* CRUD operations
* Business logic
* Background scheduling
* SMTP email integration
* Payment workflow design
* React
* React Router
* Axios
* Tailwind CSS
* API integration
* Protected routes
* Error handling
* Environment configuration
* Full-stack application architecture

---

# 👨‍💻 Author

**Ganesh Kumar**

Full-Stack Developer | Python | FastAPI | React

---

## ⭐ Project Highlights

```text
FastAPI REST API
        +
JWT Authentication
        +
SQLAlchemy ORM
        +
Invoice Management
        +
Automated Email Reminders
        +
Payment Tracking
        +
Public Invoice Access
        +
React + Tailwind Frontend
        =
Full-Stack Invoice Reminder System
```
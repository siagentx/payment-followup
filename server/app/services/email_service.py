import smtplib
from email.message import EmailMessage

from app.core.config import (
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    SMTP_FROM
)


def send_email(
    to: str,
    subject: str,
    body: str
):
    message = EmailMessage()

    message["From"] = SMTP_FROM
    message["To"] = to
    message["Subject"] = subject

    message.set_content(body)

    with smtplib.SMTP(
        SMTP_HOST,
        SMTP_PORT
    ) as server:

        server.starttls()

        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD
        )

        server.send_message(message)
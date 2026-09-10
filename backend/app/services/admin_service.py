"""
Admin Service — pure business logic for admin operations.
"""
from datetime import datetime

from app.extensions import db
from app.models.client import Client
from app.models.deposit import Deposit
from app.models.loan import Loan
from app.models.transaction import Transaction
from app.models.card import Card
from app.models.beneficiary import Beneficiary


# ── Clients ───────────────────────────────────────────────────────────────────

def get_all_clients() -> list[dict]:
    return [c.to_dict() for c in Client.query.all()]


def delete_client(client_id: int) -> tuple[bool, None] | tuple[None, str]:
    client = db.session.get(Client, client_id)
    if not client:
        return None, "Client not found."
    # Cascade delete handles related records via relationship cascade="all, delete-orphan"
    db.session.delete(client)
    db.session.commit()
    return True, None


# ── Deposits ──────────────────────────────────────────────────────────────────

def get_all_pending_deposits() -> list[dict]:
    results = db.session.query(Deposit, Client).join(Client).all()
    return [
        {**d.to_dict(), "client": c.to_dict()}
        for d, c in results
    ]


def accept_deposit(deposit_id: int) -> tuple[bool, None] | tuple[None, str]:
    deposit = db.session.get(Deposit, deposit_id)
    if not deposit:
        return None, "Deposit not found."

    try:
        client = db.session.get(Client, deposit.client_id)
        client.balance += deposit.amount

        tx = Transaction(
            client_id=deposit.client_id,
            benef_id=None,
            date=datetime.utcnow(),
            transaction_type="Deposit",
            amount=deposit.amount,
            description="Deposit approved by admin.",
        )
        db.session.add(tx)
        db.session.delete(deposit)
        db.session.commit()
        return True, None
    except Exception as e:
        db.session.rollback()
        return None, f"Database transaction failed: {str(e)}"


def reject_deposit(deposit_id: int) -> tuple[bool, None] | tuple[None, str]:
    deposit = db.session.get(Deposit, deposit_id)
    if not deposit:
        return None, "Deposit not found."
    db.session.delete(deposit)
    db.session.commit()
    return True, None


# ── Loans ─────────────────────────────────────────────────────────────────────

def get_all_loan_requests() -> list[dict]:
    results = db.session.query(Loan, Client).join(Client).all()
    return [
        {**l.to_dict(), "client": c.to_dict()}
        for l, c in results
    ]


def accept_loan(loan_id: int) -> tuple[bool, None] | tuple[None, str]:
    loan = db.session.get(Loan, loan_id)
    if not loan:
        return None, "Loan not found."

    try:
        loan.accepted_or_not = True
        client = db.session.get(Client, loan.client_id)
        client.balance += loan.amount

        tx = Transaction(
            client_id=loan.client_id,
            benef_id=None,
            date=datetime.utcnow(),
            transaction_type="Loan",
            amount=loan.amount,
            description="Loan approved by admin.",
        )
        db.session.add(tx)
        db.session.commit()
        return True, None
    except Exception as e:
        db.session.rollback()
        return None, f"Database transaction failed: {str(e)}"


def reject_loan(loan_id: int) -> tuple[bool, None] | tuple[None, str]:
    loan = db.session.get(Loan, loan_id)
    if not loan:
        return None, "Loan not found."
    db.session.delete(loan)
    db.session.commit()
    return True, None

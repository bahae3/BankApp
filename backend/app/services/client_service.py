"""
Client Service — pure business logic for client operations.
"""
from datetime import datetime
from werkzeug.security import generate_password_hash

from app.extensions import db
from app.models.client import Client
from app.models.beneficiary import Beneficiary
from app.models.transaction import Transaction
from app.models.deposit import Deposit
from app.models.loan import Loan


# ── Account ──────────────────────────────────────────────────────────────────

def update_profile(client_id: int, data: dict) -> tuple[Client, None] | tuple[None, str]:
    client = db.session.get(Client, client_id)
    if not client:
        return None, "Client not found."

    client.first_name = data.get("first_name", client.first_name).capitalize()
    client.last_name = data.get("last_name", client.last_name).capitalize()
    client.email = data.get("email", client.email)
    client.phone = data.get("phone", client.phone)
    client.address = data.get("address", client.address).capitalize()
    db.session.commit()
    return client, None


def change_password(client_id: int, new_password: str) -> tuple[bool, None] | tuple[None, str]:
    client = db.session.get(Client, client_id)
    if not client:
        return None, "Client not found."
    client.password = generate_password_hash(new_password, method="pbkdf2:sha256", salt_length=8)
    db.session.commit()
    return True, None


# ── Beneficiaries ─────────────────────────────────────────────────────────────

def get_beneficiaries(client_id: int) -> list[dict]:
    benefs = Beneficiary.query.filter_by(client_id=client_id).all()
    # Deduplicate by beneficiary_id
    seen = set()
    result = []
    for b in benefs:
        if b.beneficiary_id not in seen:
            seen.add(b.beneficiary_id)
            result.append(b.to_dict())
    return result


def add_beneficiary(client_id: int, rib: int) -> tuple[Beneficiary, None] | tuple[None, str]:
    target = Client.query.filter_by(rib=rib).first()
    if not target:
        return None, "No account found with this RIB."
    if target.client_id == client_id:
        return None, "You can't add yourself as a beneficiary."

    existing = Beneficiary.query.filter_by(
        client_id=client_id, beneficiary_id=target.client_id
    ).first()
    if existing:
        return None, "This beneficiary already exists."

    benef = Beneficiary(client_id=client_id, beneficiary_id=target.client_id)
    db.session.add(benef)
    db.session.commit()
    return benef, None


def delete_beneficiary(client_id: int, benef_id: int) -> tuple[bool, None] | tuple[None, str]:
    benef = Beneficiary.query.filter_by(id=benef_id, client_id=client_id).first()
    if not benef:
        return None, "Beneficiary not found."
    db.session.delete(benef)
    db.session.commit()
    return True, None


# ── Transfer ──────────────────────────────────────────────────────────────────

def transfer_money(client_id: int, benef_client_id: int, amount: float, description: str):
    """Returns (sender_balance, receiver_balance, None) on success, or (None, None, error_str)."""
    sender = db.session.get(Client, client_id)
    receiver = db.session.get(Client, benef_client_id)
    if not receiver:
        return None, None, "Beneficiary account not found."
    if amount <= 0:
        return None, None, "Amount must be positive."
    if sender.balance < amount:
        return None, None, "Insufficient balance."

    try:
        sender.balance -= amount
        receiver.balance += amount

        tx = Transaction(
            client_id=client_id,
            benef_id=benef_client_id,
            date=datetime.utcnow(),
            transaction_type="Transfer",
            amount=amount,
            description=description,
        )
        db.session.add(tx)
        db.session.commit()
        # Return updated balances directly — avoids a second DB round-trip in the caller
        return round(sender.balance, 2), round(receiver.balance, 2), None
    except Exception as e:
        db.session.rollback()
        return None, None, f"Database transaction failed: {str(e)}"


# ── Deposit ───────────────────────────────────────────────────────────────────

def request_deposit(client_id: int, amount: float) -> tuple[Deposit, None] | tuple[None, str]:
    if amount <= 0:
        return None, "Amount must be positive."
    deposit = Deposit(client_id=client_id, amount=amount)
    db.session.add(deposit)
    db.session.commit()
    return deposit, None


# ── Transactions ──────────────────────────────────────────────────────────────

def get_transactions(client_id: int) -> list[dict]:
    txs = Transaction.query.filter(
        Transaction.client_id == client_id,
        Transaction.transaction_type.in_(["Transfer", "Deposit", "Withdraw", "Loan"])
    ).order_by(Transaction.date.desc()).all()
    return [t.to_dict() for t in txs]


# ── Loans ─────────────────────────────────────────────────────────────────────

def request_loan(client_id: int, amount: float, months: int) -> tuple[Loan, None] | tuple[None, str]:
    if amount <= 0 or months <= 0:
        return None, "Amount and term must be positive."
    loan = Loan(
        client_id=client_id,
        amount=amount,
        term=months,
        monthly_return_amount=round(amount / months, 2),
        accepted_or_not=False,
    )
    db.session.add(loan)
    db.session.commit()
    return loan, None


def get_accepted_loans(client_id: int) -> list[dict]:
    loans = Loan.query.filter_by(client_id=client_id, accepted_or_not=True).all()
    return [l.to_dict() for l in loans]

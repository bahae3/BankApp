"""
Auth Service — pure business logic for authentication.
No Flask request/response objects here.
"""
import random
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.client import Client
from app.models.admin import Admin
from app.models.card import Card


def register_client(data: dict) -> tuple[Client, None] | tuple[None, str]:
    """
    Register a new client.
    Returns (client, None) on success or (None, error_message) on failure.
    """
    # Check for duplicate email or phone
    if Client.query.filter_by(email=data["email"]).first():
        return None, "Email already in use."
    if Client.query.filter_by(phone=data["phone"]).first():
        return None, "Phone number already in use."

    rib = random.randint(1_000_000_000_000_000, 9_999_999_999_999_999)
    hashed_pw = generate_password_hash(data["password"], method="pbkdf2:sha256", salt_length=8)

    client = Client(
        rib=rib,
        first_name=data["first_name"].capitalize(),
        last_name=data["last_name"].capitalize(),
        gender=data["gender"],
        balance=0.00,
        email=data["email"],
        password=hashed_pw,
        address=data["address"].capitalize(),
        phone=data["phone"],
    )
    db.session.add(client)
    db.session.commit()
    return client, None


def login_client(email: str, password: str) -> tuple[str, str, None] | tuple[None, None, str]:
    """
    Authenticate a client and return (access_token, role, None) or (None, None, error).
    Also creates a card on first login.
    """
    client = Client.query.filter_by(email=email).first()
    if not client:
        return None, None, "No account found with this email."
    if not check_password_hash(client.password, password):
        return None, None, "Wrong password."

    # Create card on first login if not exists
    if not client.card:
        _create_card_for_client(client.client_id)

    token = create_access_token(
        identity=str(client.client_id),
        additional_claims={"role": "client"}
    )
    return token, "client", None


def login_admin(email: str, password: str) -> tuple[str, str, None] | tuple[None, None, str]:
    """Authenticate an admin and return (access_token, role, None) or (None, None, error)."""
    admin = Admin.query.filter_by(email=email).first()
    if not admin:
        return None, None, "No admin account found with this email."
    if not admin.check_password(password):
        return None, None, "Wrong password."

    token = create_access_token(
        identity=str(admin.id_admin),
        additional_claims={"role": "admin"}
    )
    return token, "admin", None


def _create_card_for_client(client_id: int):
    card_number = random.randint(1_000_000_000_000_000, 9_999_999_999_999_999)
    today = datetime.date.today()
    expiration = today.replace(year=today.year + 10).strftime("%m/%Y")
    cvc = random.randint(100, 999)

    card = Card(
        client_id=client_id,
        number=card_number,
        expiration_date=expiration,
        cvc_code=cvc,
    )
    db.session.add(card)
    db.session.commit()

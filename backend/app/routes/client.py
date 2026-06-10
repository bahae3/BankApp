from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.models.client import Client
from app.models.card import Card
from app.services import client_service

client_bp = Blueprint("client", __name__, url_prefix="/api/client")


def _require_client_role():
    """Helper: returns (client_id, None) or (None, error_response)."""
    claims = get_jwt()
    if claims.get("role") != "client":
        return None, (jsonify({"error": "Client access only."}), 403)
    return int(get_jwt_identity()), None


# ── Account ───────────────────────────────────────────────────────────────────

@client_bp.get("/account")
@jwt_required()
def get_account():
    client_id, err = _require_client_role()
    if err:
        return err
    client = Client.query.get(client_id)
    return jsonify(client.to_dict()), 200


@client_bp.put("/account")
@jwt_required()
def update_account():
    client_id, err = _require_client_role()
    if err:
        return err
    data = request.get_json()
    client, error = client_service.update_profile(client_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Profile updated.", "client": client.to_dict()}), 200


@client_bp.put("/account/password")
@jwt_required()
def change_password():
    client_id, err = _require_client_role()
    if err:
        return err
    data = request.get_json()
    new_pw = data.get("new_password", "")
    if not new_pw or len(new_pw) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400
    _, error = client_service.change_password(client_id, new_pw)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Password updated."}), 200


# ── Balance ───────────────────────────────────────────────────────────────────

@client_bp.get("/balance")
@jwt_required()
def get_balance():
    client_id, err = _require_client_role()
    if err:
        return err
    client = Client.query.get(client_id)
    return jsonify({"balance": client.balance}), 200


# ── Card ──────────────────────────────────────────────────────────────────────

@client_bp.get("/card")
@jwt_required()
def get_card():
    client_id, err = _require_client_role()
    if err:
        return err
    card = Card.query.filter_by(client_id=client_id).first()
    if not card:
        return jsonify({"error": "No card found."}), 404
    return jsonify(card.to_dict()), 200


# ── Beneficiaries ─────────────────────────────────────────────────────────────

@client_bp.get("/beneficiaries")
@jwt_required()
def list_beneficiaries():
    client_id, err = _require_client_role()
    if err:
        return err
    return jsonify(client_service.get_beneficiaries(client_id)), 200


@client_bp.post("/beneficiaries")
@jwt_required()
def add_beneficiary():
    client_id, err = _require_client_role()
    if err:
        return err
    data = request.get_json()
    rib = data.get("rib")
    if not rib:
        return jsonify({"error": "RIB is required."}), 400
    benef, error = client_service.add_beneficiary(client_id, int(rib))
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Beneficiary added.", "beneficiary": benef.to_dict()}), 201


@client_bp.delete("/beneficiaries/<int:benef_id>")
@jwt_required()
def delete_beneficiary(benef_id):
    client_id, err = _require_client_role()
    if err:
        return err
    _, error = client_service.delete_beneficiary(client_id, benef_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Beneficiary removed."}), 200


# ── Transfer ──────────────────────────────────────────────────────────────────

@client_bp.post("/transfer")
@jwt_required()
def transfer():
    client_id, err = _require_client_role()
    if err:
        return err
    data = request.get_json()
    benef_client_id = data.get("beneficiary_client_id")
    amount = data.get("amount")
    description = data.get("description", "")
    if not benef_client_id or not amount:
        return jsonify({"error": "beneficiary_client_id and amount are required."}), 400
    _, error = client_service.transfer_money(client_id, int(benef_client_id), float(amount), description)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Transfer successful."}), 200


# ── Deposit ───────────────────────────────────────────────────────────────────

@client_bp.post("/deposit")
@jwt_required()
def request_deposit():
    client_id, err = _require_client_role()
    if err:
        return err
    data = request.get_json()
    amount = data.get("amount")
    if not amount:
        return jsonify({"error": "Amount is required."}), 400
    deposit, error = client_service.request_deposit(client_id, float(amount))
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Deposit request submitted.", "deposit": deposit.to_dict()}), 201


# ── Transactions ──────────────────────────────────────────────────────────────

@client_bp.get("/transactions")
@jwt_required()
def transactions():
    client_id, err = _require_client_role()
    if err:
        return err
    return jsonify(client_service.get_transactions(client_id)), 200


# ── Loans ─────────────────────────────────────────────────────────────────────

@client_bp.get("/loans")
@jwt_required()
def get_loans():
    client_id, err = _require_client_role()
    if err:
        return err
    return jsonify(client_service.get_accepted_loans(client_id)), 200


@client_bp.post("/loans")
@jwt_required()
def request_loan():
    client_id, err = _require_client_role()
    if err:
        return err
    data = request.get_json()
    amount = data.get("amount")
    months = data.get("months")
    if not amount or not months:
        return jsonify({"error": "Amount and months are required."}), 400
    loan, error = client_service.request_loan(client_id, float(amount), int(months))
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Loan request submitted.", "loan": loan.to_dict()}), 201

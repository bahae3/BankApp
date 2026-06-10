from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from app.services import admin_service

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def _require_admin_role():
    """Helper: returns (True, None) or (None, error_response)."""
    claims = get_jwt()
    if claims.get("role") != "admin":
        return None, (jsonify({"error": "Admin access only."}), 403)
    return True, None


# ── Clients ───────────────────────────────────────────────────────────────────

@admin_bp.get("/clients")
@jwt_required()
def list_clients():
    _, err = _require_admin_role()
    if err:
        return err
    return jsonify(admin_service.get_all_clients()), 200


@admin_bp.delete("/clients/<int:client_id>")
@jwt_required()
def delete_client(client_id):
    _, err = _require_admin_role()
    if err:
        return err
    _, error = admin_service.delete_client(client_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Client deleted."}), 200


# ── Deposits ──────────────────────────────────────────────────────────────────

@admin_bp.get("/deposits")
@jwt_required()
def list_deposits():
    _, err = _require_admin_role()
    if err:
        return err
    return jsonify(admin_service.get_all_pending_deposits()), 200


@admin_bp.post("/deposits/<int:deposit_id>/accept")
@jwt_required()
def accept_deposit(deposit_id):
    _, err = _require_admin_role()
    if err:
        return err
    _, error = admin_service.accept_deposit(deposit_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Deposit accepted."}), 200


@admin_bp.post("/deposits/<int:deposit_id>/reject")
@jwt_required()
def reject_deposit(deposit_id):
    _, err = _require_admin_role()
    if err:
        return err
    _, error = admin_service.reject_deposit(deposit_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Deposit rejected."}), 200


# ── Loans ─────────────────────────────────────────────────────────────────────

@admin_bp.get("/loans")
@jwt_required()
def list_loans():
    _, err = _require_admin_role()
    if err:
        return err
    return jsonify(admin_service.get_all_loan_requests()), 200


@admin_bp.post("/loans/<int:loan_id>/accept")
@jwt_required()
def accept_loan(loan_id):
    _, err = _require_admin_role()
    if err:
        return err
    _, error = admin_service.accept_loan(loan_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Loan accepted."}), 200


@admin_bp.post("/loans/<int:loan_id>/reject")
@jwt_required()
def reject_loan(loan_id):
    _, err = _require_admin_role()
    if err:
        return err
    _, error = admin_service.reject_loan(loan_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Loan rejected."}), 200

from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import (
    jwt_required, get_jwt_identity, get_jwt,
    set_access_cookies, unset_jwt_cookies
)

from app.services import auth_service
from app.models.client import Client
from app.models.admin import Admin

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/signup")
def signup():
    data = request.get_json()
    required = ["first_name", "last_name", "gender", "email", "password", "phone", "address"]
    if missing := [f for f in required if not data.get(f)]:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    client, error = auth_service.register_client(data)
    if error:
        return jsonify({"error": error}), 409

    return jsonify({"message": "Account created successfully.", "client": client.to_dict()}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    token, role, error = auth_service.login_client(email, password)
    if error:
        return jsonify({"error": error}), 401

    response = jsonify({"role": role})
    set_access_cookies(response, token)
    return response, 200


@auth_bp.post("/admin/login")
def admin_login():
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    token, role, error = auth_service.login_admin(email, password)
    if error:
        return jsonify({"error": error}), 401

    response = jsonify({"role": role})
    set_access_cookies(response, token)
    return response, 200


@auth_bp.post("/logout")
def logout():
    response = jsonify({"message": "Logout successful."})
    unset_jwt_cookies(response)
    return response, 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    claims = get_jwt()
    role = claims.get("role")

    if role == "client":
        user = Client.query.get(user_id)
        return jsonify({"role": "client", "user": user.to_dict()}), 200
    elif role == "admin":
        user = Admin.query.get(user_id)
        return jsonify({"role": "admin", "user": user.to_dict()}), 200

    return jsonify({"error": "Unknown role."}), 400

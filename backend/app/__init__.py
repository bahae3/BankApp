"""
Flask Application Factory.
Creates and configures the Flask app instance.
"""
import os
from flask import Flask

from app.config import config_map
from app.extensions import db, migrate, jwt, cors, socketio

# Register Socket.IO event handlers
from app.sockets import events

# Import all models so SQLAlchemy/Alembic can discover them
from app.models import Client, Admin, Card, Beneficiary, Transaction, Loan, Deposit


def create_app(env: str = None) -> Flask:
    app = Flask(__name__)

    # Load configuration
    env = env or os.getenv("FLASK_ENV", "development")
    app.config.from_object(config_map[env])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
    socketio.init_app(
        app,
        cors_allowed_origins="*",
        async_mode="threading",
        logger=False,
        engineio_logger=False,
    )

    # Register HTTP blueprints
    from app.routes.auth import auth_bp
    from app.routes.client import client_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(client_bp)
    app.register_blueprint(admin_bp)

    # Health check
    @app.get("/api/health")
    def health():
        return {"status": "ok"}, 200

    return app

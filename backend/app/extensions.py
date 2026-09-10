"""
Shared Flask extension instances.
Imported by app/__init__.py and models to avoid circular imports.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_socketio import SocketIO

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()
# manage_session=False: fixes Flask 3.1+ incompatibility where
# RequestContext.session is a read-only property and cannot be set by SocketIO.
socketio = SocketIO(manage_session=False)

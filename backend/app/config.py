import os
import datetime
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration shared by all environments."""
    SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_dev_secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_dev_secret")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Cookie settings
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = False  # Set to True in production (HTTPS)
    JWT_COOKIE_CSRF_PROTECT = False  # Set to False to keep it simple across domains in dev
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=1) if "production" in os.getenv("FLASK_ENV", "") else False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:bahae03@localhost:5432/bankapp_db"
    )


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")


config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}

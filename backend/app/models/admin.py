from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


class Admin(db.Model):
    __tablename__ = "admin"

    id_admin = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    # FIX: Admin password is now hashed (was stored in plaintext)
    password = db.Column(db.String(255), nullable=False)

    def set_password(self, raw_password: str):
        self.password = generate_password_hash(raw_password, method="pbkdf2:sha256", salt_length=8)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password, raw_password)

    def to_dict(self):
        return {
            "id_admin": self.id_admin,
            "email": self.email,
        }

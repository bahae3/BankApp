from app.extensions import db


class Client(db.Model):
    __tablename__ = "clients"

    client_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # FIX: rib is 16 digits — must be BigInteger, not Integer
    rib = db.Column(db.BigInteger, nullable=False, unique=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    balance = db.Column(db.Float, nullable=False, default=0.00)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(300), nullable=False)
    phone = db.Column(db.String(20), nullable=False, unique=True)

    # Relationships
    card = db.relationship("Card", backref="client", uselist=False, cascade="all, delete-orphan")
    transactions = db.relationship("Transaction", backref="client",
                                   foreign_keys="Transaction.client_id",
                                   cascade="all, delete-orphan")
    loans = db.relationship("Loan", backref="client", cascade="all, delete-orphan")
    deposits = db.relationship("Deposit", backref="client", cascade="all, delete-orphan")
    beneficiaries = db.relationship("Beneficiary", backref="owner",
                                    foreign_keys="Beneficiary.client_id",
                                    cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "client_id": self.client_id,
            "rib": self.rib,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "gender": self.gender,
            "balance": self.balance,
            "email": self.email,
            "address": self.address,
            "phone": self.phone,
        }

from app.extensions import db
from datetime import datetime


class Transaction(db.Model):
    __tablename__ = "transactions"

    transaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_id = db.Column(db.Integer, db.ForeignKey("clients.client_id"), nullable=False)
    benef_id = db.Column(db.Integer, db.ForeignKey("clients.client_id"), nullable=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    # type: "Transfer" | "Deposit" | "Withdraw" | "Loan"
    transaction_type = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    # FIX: description was db.Integer — changed to String
    description = db.Column(db.String(500), nullable=True)

    def to_dict(self):
        return {
            "transaction_id": self.transaction_id,
            "client_id": self.client_id,
            "benef_id": self.benef_id,
            "date": self.date.strftime("%d/%m/%Y %H:%M") if self.date else None,
            "transaction_type": self.transaction_type,
            "amount": self.amount,
            "description": self.description,
        }

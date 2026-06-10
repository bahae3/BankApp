from app.extensions import db


class Loan(db.Model):
    __tablename__ = "loans"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_id = db.Column(db.Integer, db.ForeignKey("clients.client_id"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    # Term in months
    term = db.Column(db.Integer, nullable=False)
    # FIX: monthly_return_amount changed from Integer to Float for precision
    monthly_return_amount = db.Column(db.Float, nullable=False)
    accepted_or_not = db.Column(db.Boolean, nullable=False, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "amount": self.amount,
            "term": self.term,
            "monthly_return_amount": self.monthly_return_amount,
            "accepted": self.accepted_or_not,
        }

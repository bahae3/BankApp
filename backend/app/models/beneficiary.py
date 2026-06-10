from app.extensions import db


class Beneficiary(db.Model):
    __tablename__ = "beneficiaries"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # The logged-in client who owns this beneficiary list
    client_id = db.Column(db.Integer, db.ForeignKey("clients.client_id"), nullable=False)
    # The beneficiary target client
    beneficiary_id = db.Column(db.Integer, db.ForeignKey("clients.client_id"), nullable=False)

    # Relationship to fetch beneficiary client details
    beneficiary_client = db.relationship(
        "Client", foreign_keys=[beneficiary_id], lazy="joined"
    )

    def to_dict(self):
        bc = self.beneficiary_client
        return {
            "id": self.id,
            "beneficiary_id": self.beneficiary_id,
            "first_name": bc.first_name,
            "last_name": bc.last_name,
            "rib": bc.rib,
        }

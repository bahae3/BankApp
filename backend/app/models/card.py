from app.extensions import db
from app.utils.encryption import encrypt_data, decrypt_data

class Card(db.Model):
    __tablename__ = "cards"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_id = db.Column(db.Integer, db.ForeignKey("clients.client_id"), nullable=False)
    
    # Store encrypted strings
    _number = db.Column("number", db.String(500), nullable=False)
    expiration_date = db.Column(db.String(10), nullable=False)
    _cvc_code = db.Column("cvc_code", db.String(500), nullable=False)

    @property
    def number(self):
        return decrypt_data(self._number)

    @number.setter
    def number(self, value):
        self._number = encrypt_data(str(value))

    @property
    def cvc_code(self):
        return decrypt_data(self._cvc_code)

    @cvc_code.setter
    def cvc_code(self, value):
        self._cvc_code = encrypt_data(str(value))

    def to_dict(self):
        return {
            "id": self.id,
            "number": self.number,
            "expiration_date": self.expiration_date,
            "cvc_code": self.cvc_code,
        }

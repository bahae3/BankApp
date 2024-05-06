from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm.exc import NoResultFound, UnmappedInstanceError
from sqlalchemy.exc import IntegrityError
from flask_login import UserMixin

# Creating the application
app = Flask(__name__)
app.config['SECRET_KEY'] = "bahae03"

# Connect to database
app.app_context().push()
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///bahaebank.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# Creating tables
# Client table
class Client(db.Model, UserMixin):
    __tablename__ = "clients"
    client_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rib = db.Column(db.Integer, nullable=False, unique=True)
    lastName = db.Column(db.String, nullable=False)
    firstName = db.Column(db.String, nullable=False)
    gender = db.Column(db.String, nullable=False)
    balance = db.Column(db.Float, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False, unique=True)

    def get_id(self):
        return str(self.client_id)

    def __init__(self, rib, lastName, firstName, gender, balance, email, password, address, phone):
        self.rib = rib
        self.lastName = lastName
        self.firstName = firstName
        self.gender = gender
        self.balance = balance
        self.email = email
        self.password = password
        self.address = address
        self.phone = phone


# Admin table
class Admin(db.Model, UserMixin):
    __tablename__ = "admin"
    id_admin = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)

    def get_id(self):
        return str(self.id_admin)


# Card table
class Card(db.Model, UserMixin):
    __tablename__ = "cards"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # relation to client id
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    number = db.Column(db.Integer, nullable=False, unique=True)
    expiration_date = db.Column(db.String, nullable=False)
    cvc_code = db.Column(db.Integer, nullable=False)

    def __init__(self, client_id, number, expiration_date, cvc_code):
        self.client_id = client_id
        self.number = number
        self.expiration_date = expiration_date
        self.cvc_code = cvc_code


# Beneficiaries table
class Beneficiaries(db.Model, UserMixin):
    __tablename__ = "beneficiaries"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # the actual client (who's logged-in) that will choose his beneficiaries
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    # one of the beneficiaries that the logged-in client has chosen
    beneficiary_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)

    def __init__(self, client_id, beneficiary_id):
        self.client_id = client_id
        self.beneficiary_id = beneficiary_id


# Transactions table
class Transaction(db.Model, UserMixin):
    __tablename__ = "transactions"
    transaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # relation to client id
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    benef_id = db.Column(db.Integer, db.ForeignKey('beneficiaries.beneficiary_id'), nullable=True)
    date = db.Column(db.String, nullable=False)
    # type is: deposit - withdrawal - transfer
    transaction_type = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Integer, nullable=False)

    def __init__(self, client_id, benef_id, date, transaction_type, amount, description):
        self.client_id = client_id
        self.benef_id = benef_id
        self.date = date
        self.transaction_type = transaction_type
        self.amount = amount
        self.description = description


# Loans table
class Loan(db.Model, UserMixin):
    # let's consider the interest is 0%
    __tablename__ = "loans"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    # term is time to return the money monthly (e.i.: 24 months...)
    term = db.Column(db.Integer, nullable=False)

    # Change monthly return amount from INT to FLOAT
    monthly_return_amount = db.Column(db.Integer, nullable=False)
    accepted_or_not = db.Column(db.Boolean, nullable=False)

    def __init__(self, client_id, amount, term, monthly_return_amount, accepted_or_not):
        self.client_id = client_id
        self.amount = amount
        self.term = term
        self.monthly_return_amount = monthly_return_amount
        self.accepted_or_not = accepted_or_not


class Deposit(db.Model, UserMixin):
    __tablename__ = "deposit"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    def __init__(self, client_id, amount):
        self.client_id = client_id
        self.amount = amount

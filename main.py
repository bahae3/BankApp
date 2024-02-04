from flask import Flask, render_template, redirect, url_for, flash, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import NoResultFound
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user

# Creating the application
app = Flask(__name__)
app.config['SECRET_KEY'] = "bahae03"

# Connect to database
app.app_context().push()
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///bahaebank.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Flask login
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return Client.query.get(user_id)


# Creating tables
# Client table
class Client(db.Model, UserMixin):
    __tablename__ = "clients"
    clients_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstName = db.Column(db.String, nullable=False)
    lastName = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)

    def __init__(self, firstName, lastName, email, password, address, phone):
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.password = password
        self.address = address
        self.phone = phone


# Card table
class Card(db.Model, UserMixin):
    __tablename__ = "cards"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    number = db.Column(db.Integer, nullable=False, unique=True)
    expiration_date = db.Column(db.Date, nullable=False, unique=True)
    cvc_code = db.Column(db.Integer, nullable=False)
    # relation to client id
    clients_id = db.Column(db.Integer, db.ForeignKey('clients.clients_id'), nullable=False)

    def __init__(self, number, expiration_date, cvc_code):
        self.number = number
        self.expiration_date = expiration_date
        self.cvc_code = cvc_code


# Admin table
class Admin(db.Model, UserMixin):
    __tablename__ = "admin"
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)


with app.app_context():
    db.create_all()

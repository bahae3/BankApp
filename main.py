from flask import Flask, render_template, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import NoResultFound
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
from forms import Signup, Login
import random

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
def load_user(client_id):
    return Client.query.get(client_id)


# Creating tables
# Client table
class Client(db.Model, UserMixin):
    __tablename__ = "clients"
    client_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rib = db.Column(db.Integer, nullable=False, unique=True)
    lastName = db.Column(db.String, nullable=False)
    firstName = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)

    def get_id(self):
        return str(self.client_id)

    def __init__(self, rib, lastName, firstName, email, password, address, phone):
        self.rib = rib
        self.lastName = lastName
        self.firstName = firstName
        self.email = email
        self.password = password
        self.address = address
        self.phone = phone


# Card table
class Card(db.Model, UserMixin):
    __tablename__ = "cards"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # relation to client id
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    number = db.Column(db.Integer, nullable=False, unique=True)
    expiration_date = db.Column(db.Date, nullable=False)
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
    date = db.Column(db.Date, nullable=False)
    # type is: deposit - withdrawal - transfer
    transaction_type = db.Column(db.String, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Integer, nullable=False)

    def __init__(self, client_id, date, transaction_type, amount, description):
        self.client_id = client_id
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
    amount = db.Column(db.Integer, nullable=False)
    # term is time to return the money monthly (e.i.: 24 months...)
    term = db.Column(db.Integer, nullable=False)
    monthly_return_amount = db.Column(db.Integer, nullable=False)

    def __init__(self, client_id, amount, term, monthly_return_amount):
        self.client_id = client_id
        self.amount = amount
        self.term = term
        self.monthly_return_amount = monthly_return_amount


# Admin table
class Admin(db.Model, UserMixin):
    __tablename__ = "admin"
    id_admin = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)


with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return render_template("client/home.html")


@app.route("/signup", methods=['GET', 'POST'])
def signup():
    form = Signup()
    if form.validate_on_submit():
        rib = random.randint(1111111111111111, 9999999999999999)
        new_client = Client(
            rib=rib,
            firstName=form.firstName.data,
            lastName=form.lastName.data,
            email=form.email.data,
            password=form.password.data,
            address=form.address.data,
            phone=form.phone.data
        )
        db.session.add(new_client)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template("client/signup.html", form=form, current_user=current_user)


@app.route("/login", methods=['GET', 'POST'])
def login():
    form = Login()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        existing_account = Client.query.filter_by(email=email).first()
        if existing_account:
            if existing_account.password == password:
                login_user(existing_account)
                return redirect(url_for("clientInterface"))
            else:
                flash('Wrong password. Try again!')
                return redirect(url_for('login'))
        else:
            flash('Wrong email. Try again!')
            return redirect(url_for('login'))
    return render_template("client/login.html", form=form, current_user=current_user)


@app.route("/clientInterface")
@login_required
def clientInterface():
    return render_template("client/clientInterface.html", current_user=current_user)


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)

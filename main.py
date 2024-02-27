import datetime
from flask import Flask, render_template, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from forms import Signup, Login, Account, AccountPassword, AddBenef, TransferMoney
import random

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
    phone = db.Column(db.String, nullable=False)

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

# Flask login
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(client_id):
    return db.session.get(Client, int(client_id))


@app.route("/")
def home():
    return render_template("client/home.html")


@app.route("/signup", methods=['GET', 'POST'])
def signup():
    form = Signup()
    if form.validate_on_submit():
        rib = random.randint(1111111111111111, 9999999999999999)
        # Hashing the password, for more security
        password = generate_password_hash(
            form.password.data,
            method='pbkdf2:sha256',
            salt_length=8
        )
        ## Inserting data into Client table from form
        new_client = Client(
            rib=rib,
            firstName=form.firstName.data.capitalize(),
            lastName=form.lastName.data.capitalize(),
            gender=form.gender.data,
            balance=0.00,
            email=form.email.data,
            password=password,
            address=form.address.data.capitalize(),
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
            if check_password_hash(existing_account.password, password):
                login_user(existing_account)

                ## Card information (generated)
                card = Card.query.filter_by(client_id=current_user.client_id).first()
                if not card:
                    card_number = random.randint(1111111111111111, 9999999999999999)
                    expiration_date = datetime.date.today()
                    years_to_add = expiration_date.year + 10
                    expiration_date = str(expiration_date.replace(year=years_to_add).strftime('%m/%Y'))
                    cvc_code = random.randint(111, 999)

                    client_card = Card(
                        client_id=current_user.client_id,
                        number=card_number,
                        expiration_date=expiration_date,
                        cvc_code=cvc_code
                    )

                    db.session.add(client_card)
                    db.session.commit()

                return redirect(url_for("clientInterface"))
            else:
                flash('Wrong password. Try again!')
                return redirect(url_for('login'))
        else:
            flash('Wrong email. Try again!')
            return redirect(url_for('login'))
    return render_template("client/login.html", form=form, current_user=current_user)


@app.route("/clientInterface", methods=['GET', 'POST'])
@login_required
def clientInterface():
    form_account = Account()
    form_account_passwd = AccountPassword()
    form_add_beneficiary = AddBenef()
    form_transfer = TransferMoney()

    ## Account and Balance sections
    current_account = Client.query.filter_by(client_id=current_user.client_id).first()
    client = {
        "firstName": current_account.firstName,
        "lastName": current_account.lastName,
        "rib": current_account.rib,
        "gender": current_account.gender,
        "balance": current_account.balance,
        "email": current_account.email,
        "phone": current_account.phone,
        "address": current_account.address
    }
    if form_account.validate_on_submit():
        client_to_update = Client.query.get(current_user.client_id)
        client_to_update.firstName = form_account.firstName.data
        client_to_update.lastName = form_account.lastName.data
        client_to_update.email = form_account.email.data
        client_to_update.phone = form_account.phone.data
        client_to_update.address = form_account.address.data
        db.session.commit()
        return redirect(url_for("clientInterface"))

    if form_account_passwd.validate_on_submit():
        new_password_form = form_account_passwd.new_password.data

        new_password = db.session.query(Client).get(current_user.client_id)
        new_password.password = new_password_form
        db.session.commit()

    ## Beneficiary section
    # This is to retrieve all benefs from db and show it in the website, benef section
    benefs = Beneficiaries.query.filter_by(client_id=current_user.client_id).all()
    user_benefs = []
    for benef in benefs:
        cl = Client.query.filter_by(client_id=benef.beneficiary_id).first()
        user_benefs.append({
            "benefId": cl.client_id,
            "fName": cl.firstName,
            "lName": cl.lastName,
            "rib": cl.rib
        })

    if form_add_beneficiary.validate_on_submit():
        rib = form_add_beneficiary.rib.data
        benef_account = Client.query.filter_by(rib=rib).first()
        if benef_account:
            new_benef = Beneficiaries(
                client_id=current_user.client_id,
                beneficiary_id=benef_account.client_id
            )
            db.session.add(new_benef)
            db.session.commit()
            flash("Account added successfully.")
        else:
            # Suppose that only user from same bank should be benefs with each other
            flash("This account doesn't exist.")

    ## Transfer money section
    if form_transfer.validate_on_submit():
        pass
        # current_client = Client.query.get(current_user.client_id)
        # amount = form_transfer.amount.data
        # benef_id = request.form.get('transfer_select')
        # if float(amount) > current_client.balance:
        #     pass

    ## Card section (retrieve information)
    card = Card.query.filter_by(client_id=current_user.client_id).first()

    return render_template("client/clientInterface.html", current_user=current_user, form_account=form_account,
                           form_account_passwd=form_account_passwd, form_benef=form_add_beneficiary,
                           form_transfer=form_transfer, client=client, benefs=user_benefs, card=card)


@login_required
@app.route("/deleteBeneficiary/<int:benef_id>", methods=['GET', 'POST'])
def delete_benef(benef_id):
    benef_to_delete = Beneficiaries.query.filter_by(beneficiary_id=benef_id).one()
    db.session.delete(benef_to_delete)
    db.session.commit()
    return redirect(url_for("clientInterface"))


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)

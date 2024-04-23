from flask import render_template, redirect, url_for, flash, request
from db_models import *
from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from forms import *
import random
import datetime

# Creaing the tables of the database from db_models.py
with app.app_context():
    db.create_all()

# Flask login
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    # Load Client by user_id if exists
    client = db.session.get(Client, int(user_id))
    if client:
        return client

    # Load Admin by user_id if exists
    admin = db.session.query(Admin, int(user_id))
    if admin:
        return admin

    # If user_id does not correspond to either Client or Admin, return None
    return None


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
    return render_template("client/login.html", form=form)


@app.route("/clientInterface", methods=['GET', 'POST'])
@login_required
def clientInterface():
    return render_template("client/components/clientInterface.html", current_user=current_user)


@login_required
@app.route("/Account", methods=['GET', 'POST'])
def account():
    form_account = Account()
    if form_account.validate_on_submit():
        client_to_update = Client.query.get(current_user.client_id)
        client_to_update.firstName = form_account.firstName.data
        client_to_update.lastName = form_account.lastName.data
        client_to_update.email = form_account.email.data
        client_to_update.phone = form_account.phone.data
        client_to_update.address = form_account.address.data
        db.session.commit()
        return redirect(url_for("account"))

    form_account_passwd = AccountPassword()
    if form_account_passwd.validate_on_submit():
        new_password_form = form_account_passwd.new_password.data

        new_password = db.session.query(Client).get(current_user.client_id)
        new_password.password = new_password_form
        db.session.commit()
        return redirect(url_for("account"))
    return render_template("client/components/yourAccount.html", client=current_user, form_account=form_account,
                           form_account_passwd=form_account_passwd)


@login_required
@app.route("/balance")
def balance():
    return render_template("client/components/balance.html", client=current_user)


@login_required
@app.route("/beneficiaries", methods=['GET', 'POST'])
def benefs():
    form_add_beneficiary = AddBenef()
    ## Beneficiary section
    # This is to retrieve all benefs from db and show it in the website, benef section
    benefics = Beneficiaries.query.filter_by(client_id=current_user.client_id).all()
    user_benefs_with_duplicates = []
    for benef in benefics:
        cl = Client.query.filter_by(client_id=benef.beneficiary_id).first()
        user_benefs_with_duplicates.append({
            "benefId": cl.client_id,
            "fName": cl.firstName,
            "lName": cl.lastName,
            "rib": cl.rib
        })
    user_benefs = list(
        {
            dictionary['benefId']: dictionary for dictionary in user_benefs_with_duplicates
        }.values()
    )

    if form_add_beneficiary.validate_on_submit():
        rib = form_add_beneficiary.rib.data
        # This is to check if the rib already exists in the client table
        benef_account = Client.query.filter_by(rib=rib).first()
        if benef_account:  # if it exists
            # The current user can't add himself as a beneficiary
            if benef_account.client_id == current_user.client_id:
                flash("You can't add yourself as a beneficiary.")
                return redirect(url_for("benefs"))
            # This is to check if current client already has a beneficiary with that rib, to avoid duplications
            benefics = Beneficiaries.query.filter_by(client_id=current_user.client_id).all()
            for benef in benefics:
                query_result = Beneficiaries.query.filter_by(client_id=current_user.client_id,
                                                             beneficiary_id=benef.beneficiary_id).first()
                # Here to check if the beneficiary already exists
                if query_result.beneficiary_id == benef_account.client_id:
                    flash("This beneficiary already exists")
                    return redirect(url_for("benefs"))

            # After all conditions above, we are ready to stock the data in the db, if possible
            new_benef = Beneficiaries(
                client_id=current_user.client_id,
                beneficiary_id=benef_account.client_id
            )
            db.session.add(new_benef)
            db.session.commit()
            flash("Account added successfully.")
            return redirect(url_for("benefs"))
        else:
            # Suppose that only user from same bank should be benefs with each other
            flash("This account doesn't exist.")
    return render_template("client/components/beneficiaries.html", client=current_user, form_benef=form_add_beneficiary,
                           benefs=user_benefs)


@login_required
@app.route("/transfer_money", methods=['GET', 'POST'])
def transfer():
    form_transfer = TransferMoney()
    # Benefs to be shown in transfer section
    benefs = Beneficiaries.query.filter_by(client_id=current_user.client_id).all()
    user_benefs_with_duplicates = []
    for benef in benefs:
        cl = Client.query.filter_by(client_id=benef.beneficiary_id).first()
        user_benefs_with_duplicates.append({
            "benefId": cl.client_id,
            "fName": cl.firstName,
            "lName": cl.lastName,
            "rib": cl.rib
        })
    user_benefs = list(
        {
            dictionary['benefId']: dictionary for dictionary in user_benefs_with_duplicates
        }.values()
    )

    ## Transfer money section
    if form_transfer.validate_on_submit():
        benef_id = request.form.get('transfer_select')
        current_client = Client.query.get(current_user.client_id)
        client_to_have_money = Client.query.get(benef_id)
        amount = float(form_transfer.amount.data)
        description = form_transfer.description.data
        if amount <= current_client.balance:
            # Transaction type
            transaction = Transaction(
                client_id=current_user.client_id,
                benef_id=client_to_have_money.client_id,
                date=str(datetime.datetime.today().strftime("%d/%m/%Y")),
                transaction_type="Transfer",
                amount=amount,
                description=description
            )
            db.session.add(transaction)

            current_client.balance -= amount
            client_to_have_money.balance += amount
            db.session.commit()
        else:
            flash("You don't have enough money! Check your balance.")
        return redirect(url_for("transfer"))
    return render_template("client/components/transferMoney.html", form_transfer=form_transfer, benefs=user_benefs)


@login_required
@app.route("/deposit_money", methods=['GET', 'POST'])
def deposit():
    form_deposit = DepositMoney()
    ## Deposit money section
    if form_deposit.validate_on_submit():
        client_id = current_user.client_id
        amount = form_deposit.amount.data
        accepted_or_not = False

        deposit_transaction = Deposit(client_id=client_id,
                                      amount=float(amount),
                                      accepted_or_not=accepted_or_not)
        db.session.add(deposit_transaction)
        db.session.commit()
        return redirect(url_for("deposit"))
    return render_template("client/components/depositMoney.html", client=current_user, form_deposit=form_deposit)


@login_required
@app.route("/transactions", methods=['GET', 'POST'])
def transactions():
    ## Withdraw money section
    withdraw_transactions = Transaction.query.filter(Transaction.client_id == current_user.client_id,
                                                     Transaction.transaction_type.in_(["Withdraw", "Transfer"])).all()

    return render_template("client/components/transactions.html", client=current_user, withdraw=withdraw_transactions)


@login_required
@app.route("/loans")
def loans():
    ## Loan money section
    form_loan = Loans()
    if form_loan.validate_on_submit():
        pass
    all_loans = Loan.query.filter_by(client_id=current_user.client_id).all()
    print(type(all_loans))
    print(len(all_loans))
    for loan in all_loans:
        print(loan)
    return render_template("client/components/loans.html", client=current_user, form_loan=form_loan, loans=all_loans)


@login_required
@app.route("/card_information")
def card():
    ## Card section (retrieve information)
    card_info = Card.query.filter_by(client_id=current_user.client_id).first()
    return render_template("client/components/card.html", client=current_user, card=card_info)


@login_required
@app.route("/deleteBeneficiary/<int:benef_id>", methods=['GET', 'POST'])
def delete_benef(benef_id):
    benef_to_delete = Beneficiaries.query.filter_by(beneficiary_id=benef_id).one()
    db.session.delete(benef_to_delete)
    db.session.commit()
    return redirect(url_for("benefs"))


# This is the admin section
@app.route("/admin_auth")
def admin_auth():
    return render_template("admin/admin_section.html")


@app.route("/admin_login", methods=["GET", "POST"])
def admin_login():
    form = Login()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        existing_account = Admin.query.filter_by(email=email).first()

        if existing_account:
            if existing_account.password == password:
                login_user(existing_account)
                return redirect(url_for("home_admin"))

            else:
                flash('Wrong password. Try again!')
                return redirect(url_for('admin_login'))
        else:
            flash('Wrong email. Try again!')
            return redirect(url_for('admin_login'))
    return render_template("admin/components/login_admin.html", form=form)


@app.route("/admin_home")
def home_admin():
    return render_template("admin/components/home_admin.html")


@app.route("/admin_clients")
def clients_admin():
    all_clients = Client.query.all()
    return render_template("admin/components/clients_admin.html", clients=all_clients)


@app.route("/admin_deposits", methods=["GET", "POST"])
def deposits_admin():
    return render_template("admin/components/deposits_admin.html")


@app.route("/admin_loans_requested", methods=["GET", "POST"])
def loan_requests():
    return render_template("admin/components/loan_requests.html")


@app.route("/admin_active_loans", methods=["GET", "POST"])
def active_loans():
    return render_template("admin/components/active_loans.html")


@login_required
@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)

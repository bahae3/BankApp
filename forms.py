from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, RadioField
from wtforms.validators import DataRequired


class Signup(FlaskForm):
    firstName = StringField("First Name: ", validators=[DataRequired()])
    lastName = StringField("Last Name: ", validators=[DataRequired()])
    gender = RadioField('Gender: ', choices=[('Man', 'Man'), ('Woman', 'Woman')])
    email = StringField("Email: ", validators=[DataRequired()])
    password = PasswordField("Password: ", validators=[DataRequired()])
    phone = StringField("Phone Number: ", validators=[DataRequired()])
    address = StringField("Address: ", validators=[DataRequired()])
    signup = SubmitField("Sign Up")


class Login(FlaskForm):
    email = StringField("Email: ", validators=[DataRequired()])
    password = PasswordField("Password: ", validators=[DataRequired()])
    login = SubmitField("Log In")


class Account(FlaskForm):
    firstName = StringField("First Name: ", validators=[DataRequired()])
    lastName = StringField("Last Name: ", validators=[DataRequired()])
    email = StringField("Email: ", validators=[DataRequired()])
    phone = StringField("Phone Number: ", validators=[DataRequired()])
    address = StringField("Address: ", validators=[DataRequired()])
    update = SubmitField("Update")
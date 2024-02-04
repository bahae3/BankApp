from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired


class Signup(FlaskForm):
    firstName = StringField("First Name: ", validators=[DataRequired()])
    lastName = StringField("Last Name: ", validators=[DataRequired()])
    email = StringField("Email: ", validators=[DataRequired()])
    password = PasswordField("Password: ", validators=[DataRequired()])
    phone = StringField("Phone Number: ", validators=[DataRequired()])
    address = StringField("Address: ", validators=[DataRequired()])
    signup = SubmitField("Sign Up")


class Login(FlaskForm):
    email = StringField("Email: ", validators=[DataRequired()])
    password = PasswordField("Password: ", validators=[DataRequired()])
    login = SubmitField("Log In")

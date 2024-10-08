# 🏦 Bank App

### 🌐 Powered by Flask (Python)

## 🛠️ Technologies Used
- **Front-end**: HTML5, CSS3, JavaScript
- **Back-end**: Python
- **Database**: SQLite
- **Templating Engine**: Jinja

## 🚀 Framework
- **Flask**: A lightweight Python web framework for building web applications.

## 🏁 Getting Started

### 📋 Prerequisites
- **🐍 Python 3**: Ensure Python 3 is installed on your machine.
- **🖥️ IDE**: PyCharm or any other preferred IDE.

### 📦 Installation and Setup

1. **Clone the Repository**:
   - Download this GitHub repository to your local machine.

2. **Install Dependencies**:
   - Open your terminal and run the following command:

     ```bash
     pip install flask sqlalchemy flask-sqlalchemy flask-login flask-wtf wtforms
     ```

3. **Configure Environment Variables**:
   - In `db_models.py`, update the following lines (line 8 and 12) with your own information:

     ```python
     app.config['SECRET_KEY'] = "Your secret key"  # Example: "my_secret_key"
     app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database_name.db'  # Example: 'sqlite:///my_bank.db'
     ```

## 🎉 Usage
Give the application a try and enjoy managing your banking data! 😄

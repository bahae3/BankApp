# 🏦 BankApp - Modern Digital Banking Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![PrimeReact](https://img.shields.io/badge/PrimeReact-0A4275?style=for-the-badge&logo=primereact&logoColor=white)

BankApp is a comprehensive, secure, and fully responsive digital banking application. It provides both clients and administrators with powerful tools to manage accounts, process transactions, request loans, and oversee banking operations.

---

## 🏗️ Architectural Evolution: From Monolith to 3-Tier Architecture

BankApp was recently modernized. It has been completely refactored from a tightly coupled monolithic codebase into a highly scalable, decoupled **3-Tier Architecture**. This modular approach significantly improves maintainability, security, and scalability.

The system is strictly divided into three isolated layers:

1. **Presentation Layer (Frontend):** 
   Built entirely with **React.js** and **Vite**, replacing legacy server-side rendering. It consumes RESTful APIs and utilizes **PrimeReact** alongside a custom CSS variable-based design system for a highly responsive, modern glassmorphism UI.
2. **Application / Business Logic Layer (Backend):** 
   Powered by **Flask**. This layer acts as the brain of the application. It handles routing, authorization, and complex business logic (transfers, loan approvals) within dedicated `services/` modules to ensure controllers remain lightweight.
3. **Data Access Layer (Database):** 
   Managed by **PostgreSQL** via **SQLAlchemy**. Provides a robust, relational data structure to ensure ACID compliance for all financial transactions. 

---

## ✨ Key Features

- **Advanced Security:** 
  - **AES Encryption:** Highly sensitive data (such as Card Numbers and CVCs) are symmetrically encrypted in the database using the `cryptography` (Fernet) module.
  - **Secure Authentication:** Utilizes JWT (JSON Web Tokens) strictly delivered via **HttpOnly Cookies** to mitigate XSS attacks.
  - **Password Hashing:** Implements PBKDF2 with SHA-256 via Werkzeug.
- **Client Portal:** Beautiful dashboard to view balances, interactive credit cards, manage beneficiaries, transfer funds, and apply for loans.
- **Admin Portal:** Secure oversight panel to review user accounts, approve/reject loan requests, and manage pending deposits.
- **Modern UI/UX:** Fully responsive, mobile-first design leveraging `rem` units, CSS Grid/Flexbox, and high-quality iconography from **PrimeIcons**.

---

## 🛠️ Technologies Used

### Frontend
- **Framework:** React.js (Vite)
- **Routing:** React Router v6
- **UI Library:** PrimeReact & PrimeIcons
- **HTTP Client:** Axios (configured with `withCredentials` for secure cookies)
- **Styling:** Pure CSS with custom CSS variables (Design Tokens)

### Backend
- **Framework:** Python / Flask
- **ORM:** SQLAlchemy & Flask-Migrate
- **Authentication:** Flask-JWT-Extended
- **Cryptography:** Cryptography (Fernet) & Werkzeug Security
- **Database:** PostgreSQL

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL installed and running locally

### 1. Database Setup
1. Open PostgreSQL (pgAdmin or psql) and create a database named `bankapp_db`.
2. Ensure you have a user `bankapp_user` with the password `bahae03` (or update the `.env` file to match your local Postgres credentials).

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment:

```bash
cd backend
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows:
.\.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Set up your environment variables by checking the `.env` file. Ensure `JWT_SECRET_KEY` and `AES_SECRET_KEY` are populated.

Initialize the database schema and create the default admin account:
```bash
python seed.py
```

Run the Flask API server:
```bash
python run.py
```
*The backend will start on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory:

```bash
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```
*The frontend will start on `http://localhost:5173`*

---

## 📁 Project Structure

```text
BankApp/
│
├── backend/                  # Application Layer (Flask)
│   ├── app/
│   │   ├── models/           # Data layer ORM schemas
│   │   ├── routes/           # API endpoints (Controllers)
│   │   ├── services/         # Pure business logic
│   │   └── utils/            # AES Encryption and helpers
│   ├── requirements.txt
│   ├── run.py                # Server entry point
│   └── seed.py               # Database initialization script
│
└── frontend/                 # Presentation Layer (React)
    ├── src/
    │   ├── api/              # Axios configuration & HTTP interceptors
    │   ├── components/       # Reusable layout and UI components
    │   ├── context/          # React Context (Auth State)
    │   ├── pages/            # View layer, strictly separated into sub-folders
    │   │   ├── admin/        # Admin specific pages & CSS
    │   │   ├── client/       # Client specific pages & CSS
    │   │   └── auth/         # Login and Registration views
    │   └── styles/           # Global design system (variables, resets, utilities)
    └── package.json
```

---
*Designed & Developed for a modern, secure web experience. With <3 by Bahae*

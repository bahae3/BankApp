"""
Seed script — creates the first admin account.
Run once: python seed.py
"""
from app import create_app
from app.extensions import db
from app.models.admin import Admin


app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    if not Admin.query.filter_by(email="admin@bankapp.com").first():
        admin = Admin(email="admin@bankapp.com")
        admin.set_password("Admin@123")  # Change this before production!
        db.session.add(admin)
        db.session.commit()
        print("✅ Admin created: admin@bankapp.com / Admin@123")
    else:
        print("ℹ️  Admin already exists.")

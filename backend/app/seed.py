from app.db import SessionLocal
from app.models import User

def create_default_admin():
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.username == "admin").first()

        if not existing_user:
            admin_user = User(
                username="admin",
                password="admin123",
                full_name="Admin User",
                role="Admin",
                is_active=True,
                profile_image=None
            )
            db.add(admin_user)
            db.commit()
            print("Default admin created")
        else:
            if not existing_user.password:
                existing_user.password = "admin123"
                existing_user.full_name = existing_user.full_name or "Admin User"
                existing_user.role = existing_user.role or "Admin"
                existing_user.is_active = True
                db.commit()
                print("Admin password restored")
            else:
                print("Admin already exists")

    except Exception as e:
        db.rollback()
        print("Seed error:", e)

    finally:
        db.close()

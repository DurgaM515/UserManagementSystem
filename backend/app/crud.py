from sqlalchemy.orm import Session
from app.models import User

def get_users(db: Session):
    return db.query(User).all()

def create_user(db: Session, user):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        return None, "Username already exists"

    new_user = User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user, None

def update_user(db: Session, user_id: int, user):
    db_user = db.get(User, user_id)

    if not db_user:
         return None, "User not found"

    duplicate_user = (
        db.query(User)
        .filter(User.username == user.username, User.id != user_id)
        .first()
    )
    if duplicate_user:
        return None, "Username already exists"

    for key, value in user.model_dump().items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user, None


def delete_user(db: Session, user_id: int):
    user = db.query(User).get(user_id)
    if not user:
        return None
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


def authenticate_user(db: Session, username: str, password: str):   # ADD THIS
    user = db.query(User).filter(User.username == username).first()

    if not user:
        return None

    if user.password != password:
        return None

    return user

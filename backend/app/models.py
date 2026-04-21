from sqlalchemy import Column, Integer, String, Boolean
from app.db import Base

class User(Base):
    __tablename__="users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(100), nullable=True)
    full_name = Column(String(50), nullable=False)
    role = Column(String(20), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    profile_image = Column(String(255), nullable=True)
    

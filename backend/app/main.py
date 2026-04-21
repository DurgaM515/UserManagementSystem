from app.seed import create_default_admin
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Literal, Optional
from app.db import Base, engine, get_db
from app.init_db import create_database
from app import crud, schemas, models
import pandas as pd
import io, os
import json
import shutil
import uuid
from datetime import datetime, timedelta
import jwt
from app.schemas import LoginSchema


from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[""
    "*"],
)
@app.on_event("startup")
def startup_event():
    create_database()
    Base.metadata.create_all(bind=engine)
    create_default_admin()


# uploads folder
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# serve uploaded images
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@app.post("/users")
def create_user(form: schemas.UserForm = Depends(),
    profile_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    ):

    image_path = None

    if profile_image and profile_image.filename:
        import os, shutil, uuid

        ext = os.path.splitext(profile_image.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_image.file, buffer)

        image_path = f"uploads/{filename}"

    user_data = schemas.UserCreate(
        username=form.username,
        full_name=form.full_name,
        role=form.role,
        is_active=form.is_active,
        profile_image=image_path,
    )
    created_user, error = crud.create_user(db, user_data)
    if error:   
        raise HTTPException(status_code=400, detail=error)

    return created_user

@app.put("/users/{user_id}")
def edit_user(user_id: int,
    form: schemas.UserForm = Depends(),
    profile_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    ):

    db_user = db.get(models.User, user_id)

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    image_path = db_user.profile_image

    if profile_image and profile_image.filename:
        ext = os.path.splitext(profile_image.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_image.file, buffer)

        image_path = f"uploads/{filename}"

    user_data = schemas.UserUpdate(
        username=form.username,
        full_name=form.full_name,
        role=form.role,
        is_active=form.is_active,
        profile_image=image_path,
    )
    updated_user, error = crud.update_user(db, user_id, user_data)
    if error == "User not found":
        raise HTTPException(status_code=404, detail=error)
    if error == "Username already exists":
        raise HTTPException(status_code=400, detail=error)
    return updated_user

@app.delete("/users/{id}")
def delete_user(id: int, db: Session = Depends(get_db)):
    crud.delete_user(db, id)
    return {"msg": "deleted"}

@app.post("/api/login/")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, data.username, data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    payload = {
        "sub": user.username,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access": token,
        "token_type": "bearer"
    }

@app.get("/export/{file_type}")
def export_data(file_type: str, db: Session = Depends(get_db)):
    users = crud.get_users(db)

    # Convert SQLAlchemy objects → dict
    data = [user.__dict__ for user in users]
    for d in data:
        d.pop("_sa_instance_state", None)

    df = pd.DataFrame(data)

    # -------- CSV --------
    if file_type == "csv":
        stream = io.StringIO()
        df.to_csv(stream, index=False)
        stream.seek(0)

        return StreamingResponse(
            iter([stream.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=users.csv"}
        )

    # -------- JSON --------
    elif file_type == "json":
        stream = io.StringIO()
        json.dump(data, stream, indent=2)
        stream.seek(0)

        return StreamingResponse(
            iter([stream.getvalue()]),
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=users.json"}
        )

    # -------- XML --------
    elif file_type == "xml":
        stream = io.StringIO()
        stream.write("<users>\n")
        for user in data:
            stream.write("  <user>\n")
            for key, value in user.items():
                stream.write(f"    <{key}>{value}</{key}>\n")
            stream.write("  </user>\n")
        stream.write("</users>")
        stream.seek(0)

        return StreamingResponse(
            iter([stream.getvalue()]),
            media_type="application/xml",
            headers={"Content-Disposition": "attachment; filename=users.xml"}
        )

    # -------- TXT --------
    elif file_type == "txt":
        stream = io.StringIO()
        for user in data:
            stream.write(", ".join([f"{k}: {v}" for k, v in user.items()]) + "\n")
        stream.seek(0)

        return StreamingResponse(
            iter([stream.getvalue()]),
            media_type="text/plain",
            headers={"Content-Disposition": "attachment; filename=users.txt"}
        )

    # -------- SQL --------
    elif file_type == "sql":
        stream = io.StringIO()
        for user in data:
            columns = ", ".join(user.keys())
            values = ", ".join([f"'{str(v)}'" for v in user.values()])
            stream.write(f"INSERT INTO users ({columns}) VALUES ({values});\n")
        stream.seek(0)

        return StreamingResponse(
            iter([stream.getvalue()]),
            media_type="text/plain",
            headers={"Content-Disposition": "attachment; filename=users.sql"}
        )

    return {"error": "Invalid file type"}


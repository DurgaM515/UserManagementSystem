# UserManagementSystem
UserManagementSystem is a full-stack CRUD application designed to manage user data efficiently. The application includes authentication using JWT, dynamic user interfaces with React and TypeScript, and a FastAPI backend connected to a MySQL database. It supports user creation, editing, deletion, profile image uploads, data export, search functionality, pagination, and real-time notifications.

# 🚀 User Management System - Frontend

## 📌 Description
- Frontend application built using React and TypeScript
- Provides user interface for login and user management
- Supports table view and card view for users
- Includes notifications, search, export, print, and column selection features

---

## 🛠 Tech Stack
- React
- TypeScript
- Bootstrap
- Axios
- React Router DOM
- React Icons
- Material UI

---

## ✨ Features
- 🔐 Login page with token-based authentication
- 👤 View users in table and card layouts
- ➕ Add new users
- ✏ Edit existing users
- 🗑 Delete users
- 🔍 Search users
- 🔔 Notifications
- 📤 Export user data
- 🖨 Print users list
- 📑 Show or hide table columns
- 🖼 Profile image preview
- 🔒 Protected route for users page

---

## 📂 Project Structure
```bash
src/
├── components/
│   ├── AddUserModal.tsx
│   ├── columnsDropdown.tsx
│   ├── ExportDropdown.tsx
│   ├── Header.tsx
│   ├── ProtectedRoute.tsx
│   ├── userCards.tsx
│   └── userTable.tsx
├── hooks/
│   ├── useNotifications.ts
│   └── useUsers.ts
├── pages/
│   └── Login/
│       ├── Login.tsx
│       └── Login.css
├── assets/
├── api.ts
├── App.tsx
├── App.css
└── main.tsx

## Setup Instructions

### Install dependencies
npm install

### Run the project
npm start

### Open in browser
http://localhost:3000

# User Management System Backend

FastAPI backend for the User Management System project.  
This backend provides APIs for login, user management, image upload, and data export.

## Tech Stack

- FastAPI (Backend framework)
- Python
- SQLAlchemy (ORM)
- MySQL (Database)
- PyMySQL (MySQL driver)
- Pandas (Data export)
- JWT (Authentication)
- Uvicorn (ASGI server)
- Python Multipart (File upload support)

## Features

- User login with JWT token
- Create, read, update, delete users
- Upload profile images
- Export users data as:
  - CSV
  - JSON
  - XML
  - TXT
  - SQL
- Default admin seed user on startup
- MySQL database connection using SQLAlchemy

## Project Structure

```bash
app/
├── crud.py  → database operations
├── db.py → database connection
├── init_db.py → database creation
├── main.py  → main application file
├── models.py → database models
├── schemas.py → request/response schemas
├── seed.py → default admin creation

## Setup Instructions

Follow these steps to run the backend locally.

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd backend

### 2. Create Virtual Environment
python -m venv venv

### 3. Activate Environment

Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

### 4. Install Dependencies
pip install fastapi uvicorn sqlalchemy pymysql python-multipart pandas pyjwt 
npm install @types/react@latest @types/react-dom@latest

### 5. Configure Database
Update `db.py` with your MySQL credentials

### 6. Create Database
python -m app.init_db

### 7. Run Server
uvicorn app.main:app --reload

### 8. Open API Docs
http://127.0.0.1:8000/docs

## API Endpoints

POST /api/login/ → Login  
GET /users → Get users  
POST /users → Create user  
PUT /users/{id} → Update user  
DELETE /users/{id} → Delete user  
GET /export/{type} → Export data  

## Image Upload

Images are stored in `/uploads` folder  
Access via: http://127.0.0.1:8000/uploads/<filename>
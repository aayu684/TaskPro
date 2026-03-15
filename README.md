# TaskPro

TaskPro is a modern, high-performance task management application built with Django REST Framework and React. It features a stunning glassmorphism UI, real-time filtering, and secure JWT authentication.

## 🚀 Key Features
- **Modern UI**: Beautiful glassmorphism design with interactive animations and responsive layout.
- **Task Management**: Create, edit, delete, and mark tasks as completed.
- **Advanced Filtering**: Search by title and filter by status (All, Pending, Completed) or Priority (Low, Medium, High).
- **Authentication**: Secure login and registration with JWT (JSON Web Tokens).
- **Backend Robustness**: Powered by Django with a MySQL database.
- **API**: Custom optimized Fetch-based API client with automatic token refreshing.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Django, Django REST Framework, MySQL.
- **Authentication**: SimpleJWT.

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Python 3.x installed.
- MySQL Server installed and running.
- Node.js installed.

### 2. Backend Setup
1. **Database**: Create a MySQL database named `taskpro`.
   ```sql
   CREATE DATABASE taskpro;
   ```
2. **Environment**: Navigate to the `backend` folder and ensure your virtual environment is active.
3. **Dependencies**:
   ```bash
   pip install -r requirements.txt
   pip install pymysql
   ```
4. **Configuration**: Update `backend/taskpro_backend/settings.py` with your MySQL `USER` and `PASSWORD`.
5. **Migrations**:
   ```bash
   python manage.py migrate
   ```
6. **Run Server**:
   ```bash
   python manage.py runserver
   ```

### 3. Frontend Setup
1. **Navigate**: Go to the `frontend` folder.
2. **Install**:
   ```bash
   npm install
   ```
3. **Run**:
   ```bash
   npm run dev
   ```

---

## 🎨 UI Showcase
The dashboard features an intuitive toolbar for quick task management and a grid view of your tasks, each highlighting its priority and deadline.

Enjoy using TaskPro!

@echo off
echo Starting TaskPro (Fast Mode)...

echo Installing Backend Dependencies...
python -m pip install django djangorestframework djangorestframework-simplejwt django-cors-headers || (echo Failed to install dependencies && pause && exit /b 1)

echo Migrating Database...
python backend/manage.py migrate || (echo Migration failed && pause && exit /b 1)

echo Starting Backend...
start "TaskPro Backend" python backend/manage.py runserver

echo Starting Frontend...
cd frontend
start "TaskPro Frontend" npm run dev

echo TaskPro launched!
pause

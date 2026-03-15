@echo off
cd backend
echo Making migrations...
call venv\Scripts\python manage.py makemigrations
echo Migrating...
call venv\Scripts\python manage.py migrate
echo Done.
cd ..

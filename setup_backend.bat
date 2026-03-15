@echo off
echo Starting backend setup... > backend_debug.log
if not exist "backend" mkdir backend
cd backend
echo Creating venv... >> ..\backend_debug.log
python -m venv venv || (echo Venv creation failed >> ..\backend_debug.log && exit /b 1)
echo Activating venv... >> ..\backend_debug.log
call venv\Scripts\activate.bat || (echo Activation failed >> ..\backend_debug.log && exit /b 1)
echo Installing dependencies... >> ..\backend_debug.log
python -m pip install django djangorestframework djangorestframework-simplejwt pymysql django-cors-headers >> ..\backend_debug.log 2>&1 || (echo Pip install failed >> ..\backend_debug.log && exit /b 1)
echo Creating project... >> ..\backend_debug.log
python -m django startproject taskpro_backend . >> ..\backend_debug.log 2>&1 || (echo Project creation failed >> ..\backend_debug.log && exit /b 1)
echo Backend setup complete. >> ..\backend_debug.log
cd ..

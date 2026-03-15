@echo off
echo Starting TaskPro...
echo Starting Backend (using venv2)...
set "ROOT=%~dp0"
start "TaskPro Backend" cmd /k "cd /d \"%ROOT%backend\" && venv2\Scripts\python.exe start_server.py"

echo Starting Frontend...
start "TaskPro Frontend" cmd /k "cd /d \"%ROOT%frontend\" && npm run dev"

echo.
echo TaskPro launch commands issued.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause

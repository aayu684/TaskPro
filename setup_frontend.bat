@echo off
call npm create vite@latest frontend -- --template react-ts
cd frontend
call npm install
echo Frontend setup complete > setup_log.txt
cd ..

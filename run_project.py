import subprocess
import sys
import os
import time

def run_command(cmd, cwd=None, shell=True):
    print(f"Running: {cmd}")
    try:
        subprocess.check_call(cmd, shell=shell, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"Command failed with exit code {e.returncode}")
        sys.exit(e.returncode)

def start_process(cmd, cwd=None, title="Process"):
    print(f"Starting {title}: {cmd}")
    # Use 'start' to open in new window on Windows
    full_cmd = f'start "{title}" cmd /k "{cmd}"'
    subprocess.Popen(full_cmd, shell=True, cwd=cwd)

print("--- TaskPro Launcher ---")

# 1. Install Dependencies
print("Installing Python dependencies...")
run_command([sys.executable, "-m", "pip", "install", "django", "djangorestframework", "djangorestframework-simplejwt", "django-cors-headers"])

# 2. Migrations
print("Running Migrations...")
# Use sys.executable to ensure we use the same python
# backend/manage.py needs to be run from project root or backend dir?
# manage.py is in backend/manage.py
run_command([sys.executable, "backend/manage.py", "migrate"])

# 3. Start Backend
print("Launching Backend...")
start_process(f"{sys.executable} backend/manage.py runserver 0.0.0.0:8000", title="TaskPro Backend")

# 4. Start Frontend
print("Launching Frontend...")
# Check if node_modules exists, if not install
if not os.path.exists("frontend/node_modules"):
    print("Installing frontend dependencies...")
    run_command("npm install", cwd="frontend")

start_process("npm run dev", cwd="frontend", title="TaskPro Frontend")

print("--- Launch Complete ---")
print("Backend: http://localhost:8000")
print("Frontend: http://localhost:5173")
print("You may close this window.")
time.sleep(5)

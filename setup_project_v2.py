import os
import sys
import subprocess
import time

# Ensure output is flushed immediately if supported
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(line_buffering=True)

def log(msg):
    print(f"[SETUP] {msg}", flush=True)

def run_cmd(cmd, cwd=None, shell=True):
    log(f"Running command: {cmd} in {cwd or os.getcwd()}")
    try:
        subprocess.check_call(cmd, shell=shell, cwd=cwd)
        log("Command successful.")
    except subprocess.CalledProcessError as e:
        log(f"Command failed with exit code {e.returncode}")
        sys.exit(e.returncode)

log(f"Python executable: {sys.executable}")
log(f"CWD: {os.getcwd()}")

# Backend Setup
if not os.path.exists("backend"):
    os.makedirs("backend")
    log("Created backend directory.")

if not os.path.exists("backend/venv"):
    log("Creating venv...")
    run_cmd([sys.executable, "-m", "venv", "backend/venv"])

# Locate pip and python in venv
pip_cmd = os.path.abspath("backend/venv/Scripts/pip.exe")
python_venv = os.path.abspath("backend/venv/Scripts/python.exe")

if not os.path.exists(pip_cmd):
    log(f"Pip not found at {pip_cmd}, trying without .exe")
    pip_cmd = os.path.abspath("backend/venv/Scripts/pip")

if not os.path.exists(python_venv):
    log(f"Python venv not found at {python_venv}, trying without .exe")
    python_venv = os.path.abspath("backend/venv/Scripts/python")

log(f"Using pip: {pip_cmd}")
log("Installing backend dependencies...")
# Install one by one to isolate failures
dependencies = ["django", "djangorestframework", "djangorestframework-simplejwt", "pymysql", "django-cors-headers"]
for dep in dependencies:
    run_cmd([pip_cmd, "install", dep])

if not os.path.exists("backend/taskpro_backend"):
    log("Creating Django project...")
    run_cmd([python_venv, "-m", "django", "startproject", "taskpro_backend", "."], cwd="backend")
else:
    log("Django project already exists.")

log("Backend setup complete.")

# Frontend Setup
if not os.path.exists("frontend"):
    log("Creating frontend with Vite...")
    # Use shell=True for npx
    # Force yes to prompts
    run_cmd("npx -y create-vite@latest frontend --template react-ts", cwd=".", shell=True)
    
    log("Installing frontend dependencies...")
    run_cmd("npm install", cwd="frontend", shell=True)
else:
    log("Frontend directory exists, skipping create-vite.")
    log("Ensuring dependencies installed...")
    run_cmd("npm install", cwd="frontend", shell=True)

log("Frontend setup complete.")
log("ALL SETUP TASKS COMPLETED SUCCESSFULLY.")

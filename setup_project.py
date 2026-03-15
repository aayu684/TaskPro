import os
import sys
import subprocess

print(f"Python executable: {sys.executable}")
print(f"CWD: {os.getcwd()}")

def run_cmd(cmd, cwd=None):
    try:
        print(f"Running: {cmd}")
        subprocess.check_call(cmd, shell=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"Command failed: {cmd}")
        sys.exit(1)

# Backend Setup
if not os.path.exists("backend"):
    os.makedirs("backend")

print("Creating venv...")
run_cmd([sys.executable, "-m", "venv", "backend/venv"])

pip_cmd = os.path.abspath("backend/venv/Scripts/pip")
if not os.path.exists(pip_cmd) and os.name == 'nt':
    pip_cmd = os.path.abspath("backend/venv/Scripts/pip.exe")

print(f"Installing backend dependencies using {pip_cmd}...")
run_cmd([pip_cmd, "install", "django", "djangorestframework", "djangorestframework-simplejwt", "pymysql", "django-cors-headers"])

print("Creating Django project...")
# Use the venv python to run django-admin
python_venv = os.path.abspath("backend/venv/Scripts/python")
if not os.path.exists(python_venv) and os.name == 'nt':
    python_venv = os.path.abspath("backend/venv/Scripts/python.exe")

if not os.path.exists("backend/taskpro_backend"):
     run_cmd([python_venv, "-m", "django", "startproject", "taskpro_backend", "."], cwd="backend")

print("Backend setup complete.")

# Frontend Setup
if not os.path.exists("frontend"):
    print("Creating frontend with Vite...")
    # Use npx, might require approval? add -y
    # Use npm create vite@latest
    # Assuming node/npm is available
    run_cmd("npm create vite@latest frontend -- --template react-ts", cwd=".")
    
    print("Installing frontend dependencies...")
    run_cmd("npm install", cwd="frontend")

print("Frontend setup complete.")

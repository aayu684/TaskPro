import requests
import sys
import traceback

BASE_URL = "http://127.0.0.1:8000/api/"
AUTH_URL = "http://127.0.0.1:8000/api/auth/"

USERNAME = "debug_user_002"
PASSWORD = "DebugPassword123!"
EMAIL = "debug002@example.com"

def log(msg):
    with open("reproduce_log.txt", "a", encoding="utf-8") as f:
        f.write(msg + "\n")
    print(msg)

def get_token():
    try:
        requests.post(f"{AUTH_URL}register/", json={"username": USERNAME, "password": PASSWORD, "email": EMAIL})
    except:
        pass

    resp = requests.post(f"{AUTH_URL}login/", json={"username": USERNAME, "password": PASSWORD})
    if resp.status_code == 200:
        return resp.json()['access']
    else:
        log(f"Login failed: {resp.text}")
        sys.exit(1)

def test_create_task(token):
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Minimal payload
    payload = {
        "title": "hello",
        "description": "complete exercise"
    }
    log("Test 1: Minimal Payload")
    try:
        resp = requests.post(f"{BASE_URL}tasks/", json=payload, headers=headers)
        log(f"Status: {resp.status_code}")
        log(f"Response: {resp.text}")
    except Exception as e:
        log(f"Exception: {e}")

    # 2. Full payload
    payload2 = {
        "title": "hello full",
        "description": "complete exercise",
        "priority": "Medium",
        "due_date": "2026-02-16"
    }
    log("\nTest 2: Full Payload")
    try:
        resp = requests.post(f"{BASE_URL}tasks/", json=payload2, headers=headers)
        log(f"Status: {resp.status_code}")
        log(f"Response: {resp.text}")
    except Exception as e:
        log(f"Exception: {e}")

if __name__ == "__main__":
    with open("reproduce_log.txt", "w") as f:
        f.write("Starting reproduction...\n")
    token = get_token()
    test_create_task(token)

import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/"
AUTH_URL = "http://127.0.0.1:8000/api/auth/"

# Hardcoded credentials - assuming the user registered 'aayusoni' or similar. 
# Or we can create a new user.
USERNAME = "debug_user_001"
PASSWORD = "DebugPassword123!"
EMAIL = "debug001@example.com"

def get_token():
    # 1. Register (ignore if exists)
    try:
        requests.post(f"{AUTH_URL}register/", json={"username": USERNAME, "password": PASSWORD, "email": EMAIL})
    except:
        pass

    # 2. Login
    resp = requests.post(f"{AUTH_URL}login/", json={"username": USERNAME, "password": PASSWORD})
    if resp.status_code == 200:
        return resp.json()['access']
    else:
        print(f"Login failed: {resp.text}")
        sys.exit(1)

def test_create_task(token):
    headers = {"Authorization": f"Bearer {token}"}
    
    # Payload matching screenshot mostly
    payload = {
        "title": "hello",
        "description": "complete exercise",
        # "priority": "Medium", # Frontend might NOT send this if user didn't change dropdown from default visual
        # "due_date": "2026-02-16" # Frontend sends YYYY-MM-DD
    }
    
    # Case 1: Minimal payload (simulating user types title/desc and hits save)
    print("Test 1: Minimal Payload (Title/Desc only)")
    resp = requests.post(f"{BASE_URL}tasks/", json=payload, headers=headers)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")

    # Case 2: Full payload
    payload2 = {
        "title": "hello full",
        "description": "complete exercise",
        "priority": "Medium",
        "due_date": "2026-02-16"
    }
    print("\nTest 2: Full Payload")
    resp = requests.post(f"{BASE_URL}tasks/", json=payload2, headers=headers)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")

if __name__ == "__main__":
    token = get_token()
    test_create_task(token)

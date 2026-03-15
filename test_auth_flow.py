import requests
import random
import string
import sys

BASE_URL = "http://127.0.0.1:8000/api/auth/"

def random_string(length=10):
    return ''.join(random.choice(string.ascii_letters) for i in range(length))

username = f"user_{random_string(5)}"
password = "TestPassword123!"
email = f"{username}@example.com"

print(f"Testing with User: {username}, Email: {email}")

# 1. Register
print("\n1. Testing Registration...")
try:
    reg_response = requests.post(f"{BASE_URL}register/", json={
        "username": username,
        "password": password,
        "email": email
    })
    print(f"Status: {reg_response.status_code}")
    print(f"Response: {reg_response.text}")
    if reg_response.status_code != 201:
        print("Registration Failed!")
        sys.exit(1)
except Exception as e:
    print(f"Registration Exception: {e}")
    sys.exit(1)

# 2. Login
print("\n2. Testing Login...")
try:
    login_response = requests.post(f"{BASE_URL}login/", json={
        "username": username,
        "password": password
    })
    print(f"Status: {login_response.status_code}")
    if login_response.status_code == 200:
        data = login_response.json()
        if "access" in data and "refresh" in data:
            print("Login Successful! Tokens received.")
            print(f"Access Token: {data['access'][:20]}...")
        else:
            print(f"Login Failed! Unexpected response format: {data}")
            sys.exit(1)
    else:
        print(f"Login Failed! Response: {login_response.text}")
        sys.exit(1)

except Exception as e:
    print(f"Login Exception: {e}")
    sys.exit(1)

print("\n--- Backend Auth Flow is WORKING ---")

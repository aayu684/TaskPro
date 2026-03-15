print("Hello from Python")
import urllib.request
try:
    print("Attempting to connect...")
    urllib.request.urlopen("http://127.0.0.1:8000/api/auth/register/", timeout=2)
    print("Connection successful (stat code might be 405 which is fine)")
except Exception as e:
    print(f"Connection failed: {e}")

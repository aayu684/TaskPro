import urllib.request
import json
import urllib.error

url = "http://127.0.0.1:8000/api/auth/register/"
# Just a GET request to see if 405 (Method Not Allowed) or 200 comes back, separate from connection refused

try:
    req = urllib.request.Request(url, method="GET") # DRF might return 405 or 200 depending on permissions
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}") # 405 means server is running and route exists
except urllib.error.URLError as e:
    print(f"URL Error: {e.reason}")
    print("Backend is NOT accessible.")
except Exception as e:
    print(f"Error: {e}")

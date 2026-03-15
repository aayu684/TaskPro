import pymysql
import sys

print(f"Python executable: {sys.executable}")

try:
    print("Connecting to MySQL...")
    conn = pymysql.connect(host='localhost', user='root', password='')
    print("Connected successfully")
    with conn.cursor() as cursor:
        cursor.execute("CREATE DATABASE IF NOT EXISTS taskpro_db")
        print("Database 'taskpro_db' ensured.")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)

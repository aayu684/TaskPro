import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskpro_backend.settings')

try:
    print("Setting up Django...")
    django.setup()
    print("Django setup successful.")
except Exception as e:
    print(f"Django setup failed: {e}")

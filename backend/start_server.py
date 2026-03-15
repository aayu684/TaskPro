#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "taskpro_backend.settings")
    try:
        django.setup()
        execute_from_command_line(sys.argv + ["runserver", "0.0.0.0:8000"])
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

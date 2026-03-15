import os
import django
import sys

# Redirect stdout/stderr to files
sys.stdout = open('django_debug.out', 'w')
sys.stderr = open('django_debug.err', 'w')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskpro_backend.settings')

try:
    print("Setting up Django...")
    django.setup()
    print("Django setup successful.")
    
    from django.core.management import call_command
    print("Running makemigrations...")
    call_command('makemigrations')
    print("Running migrate...")
    call_command('migrate')
    
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
finally:
    sys.stdout.close()
    sys.stderr.close()

import os
import sys
import django
from django.core.management import call_command

# Ensure UTF-8 output file
with open('migration_log.txt', 'w', encoding='utf-8') as f:
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskpro_backend.settings')
        django.setup()
        f.write("Django setup successful.\n")
        
        f.write("Running migrations...\n")
        call_command('migrate', stdout=f, stderr=f)
        f.write("Migrations complete.\n")
        
    except Exception as e:
        f.write(f"ERROR: {e}\n")
        import traceback
        traceback.print_exc(file=f)

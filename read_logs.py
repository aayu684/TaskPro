import os

def read_file(filename):
    if os.path.exists(filename):
        print(f"--- {filename} ---")
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                print(f.read())
        except Exception as e:
            print(f"Error reading {filename}: {e}")
    else:
        print(f"{filename} not found.")

read_file('backend/django_debug.out')
read_file('backend/django_debug.err')
read_file('django_debug.out')
read_file('django_debug.err')

"""
One-time script to set all sample user passwords to 'password123' with real bcrypt hashes.
Run once: python fix_passwords.py
"""
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__),
                '..', '..', 'CMPE138_TEAM5_SOURCES', 'DB-Application')))

import bcrypt
from db import get_connection

password   = b'password123'
hashed     = bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')

conn   = get_connection()
cursor = conn.cursor()
cursor.execute("UPDATE [USER] SET password_hash = ?", hashed)
conn.commit()
conn.close()

print(f"Done! All users now have password: password123")
print(f"Hash used: {hashed}")

# login and password hashing

import bcrypt
from db import get_connection
from logger import log_info, log_error

def hash_password(plain):
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def verify_password(plain, hashed):
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def login(email, password):
    # returns user dict on success, None on failure
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT user_id, u_fname, u_lname, email, password_hash, role FROM [USER] WHERE email = ?",
            email
        )
        row = cursor.fetchone()
        conn.close()
        if row and verify_password(password, row[4]):
            log_info(f"Login success: {email}")
            return {"user_id": row[0], "u_fname": row[1], "u_lname": row[2], "email": row[3], "role": row[5]}
        log_error(f"Login failed: {email}")
        return None
    except Exception as e:
        log_error(f"Login error: {e}")
        return None

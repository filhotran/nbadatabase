# SJSU CMPE 138 SPRING 2026 TEAM5
# File: auth.py
# Description: Login and password hashing for NBA Draft Scouting Database
# Owner: Teammate 2

import bcrypt
from db import get_connection
from logger import log_info, log_error, log_warning

def hash_password(plain_password):
    """
    Hashes a plain text password using bcrypt.
    Returns the hashed password as a string.
    """
    # TODO: implement
    pass

def verify_password(plain_password, hashed_password):
    """
    Verifies a plain text password against a stored hash.
    Returns True if match, False otherwise.
    """
    # TODO: implement
    pass

def login(email, password):
    """
    Authenticates a user by email and password.
    Returns the user record dict if successful, None if failed.
    Logs the attempt either way.
    """
    # TODO: implement
    pass

def get_user_role(user_id):
    """
    Returns the role of a user given their user_id.
    Used to gate access to role-specific operations.
    """
    # TODO: implement
    pass

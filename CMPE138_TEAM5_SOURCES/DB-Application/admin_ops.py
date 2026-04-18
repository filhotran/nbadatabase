# SJSU CMPE 138 SPRING 2026 TEAM5
# File: admin_ops.py
# Description: Admin operations for NBA Draft Scouting Database
# Owner: Teammate 2

from db import get_connection
from logger import log_info, log_error

def create_user(u_fname, u_lname, email, password_hash, role):
    """Create a new user account. Role must be ADMIN/SCOUT/GM/ANALYST/FAN."""
    # TODO: implement
    pass

def update_user(user_id, field, value):
    """Update a specific field on a user record."""
    # TODO: implement
    pass

def deactivate_user(user_id):
    """Deactivate a user account (soft delete or flag)."""
    # TODO: implement
    pass

def load_prospect(prospect_data):
    """Insert a new prospect record into the database."""
    # TODO: implement
    pass

def delete_duplicate_prospect(prospect_id):
    """Delete a duplicate prospect record."""
    # TODO: implement
    pass

def manage_college(college_data):
    """Add or update a college record."""
    # TODO: implement
    pass

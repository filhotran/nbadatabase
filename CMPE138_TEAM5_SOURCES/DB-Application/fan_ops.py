# SJSU CMPE 138 SPRING 2026 TEAM5
# File: fan_ops.py
# Description: Public (fan) operations for NBA Draft Scouting Database
# Owner: Teammate 5
# Note: These operations require NO login - publicly accessible

from db import get_connection
from logger import log_info, log_error

def browse_prospects(draft_year=None):
    """Browse all prospects, optionally filtered by draft year."""
    # TODO: implement
    pass

def search_by_college(college_name):
    """Search prospects by college name."""
    # TODO: implement
    pass

def search_by_archetype(archetype_name):
    """Search prospects by archetype."""
    # TODO: implement
    pass

def view_public_prospect_profile(prospect_id):
    """
    View public prospect profile.
    Returns bio and college stats ONLY.
    No scouting reports or shortlist data.
    """
    # TODO: implement
    pass

def view_nba_comparisons(prospect_id):
    """View historical NBA career comparisons for a prospect."""
    # TODO: implement
    pass

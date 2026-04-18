# SJSU CMPE 138 SPRING 2026 TEAM5
# File: scout_ops.py
# Description: Scout operations for NBA Draft Scouting Database
# Owner: Teammate 3

from db import get_connection
from logger import log_info, log_error

def search_prospect(name=None, college=None, position=None):
    """Search prospects by name, college, or position."""
    # TODO: implement
    pass

def submit_scouting_report(prospect_id, scout_id, report_data):
    """
    Submit a new scouting report for a prospect.
    report_data dict keys: game_date, game_opponent, notes,
    scout_orating, scout_drating, scout_intangibles, overall_rating
    """
    # TODO: implement
    pass

def update_scouting_report(report_id, prospect_id, field, value):
    """Update a specific field on an existing scouting report."""
    # TODO: implement
    pass

def tag_behavioral_flag(prospect_id, flag_type, flag_label, description):
    """Tag a prospect with a behavioral flag."""
    # TODO: implement
    pass

def view_nba_comparisons(prospect_id):
    """View historical NBA player comparisons for a prospect."""
    # TODO: implement
    pass

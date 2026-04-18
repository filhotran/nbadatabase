# SJSU CMPE 138 SPRING 2026 TEAM5
# File: gm_ops.py
# Description: GM operations for NBA Draft Scouting Database
# Owner: Teammate 4

from db import get_connection
from logger import log_info, log_error

def filter_prospects_by_archetype(archetype_name):
    """Filter prospects by archetype name."""
    # TODO: implement
    pass

def filter_prospects_by_stats(stat_filters):
    """
    Filter prospects by statistical thresholds.
    stat_filters dict example: {'three_pt_pct': 0.37, 'PPG': 15.0}
    """
    # TODO: implement
    pass

def view_prospect_profile(prospect_id):
    """View full prospect profile including stats, reports, and flags."""
    # TODO: implement
    pass

def view_nba_comparisons(prospect_id):
    """View NBA career comparisons for a prospect."""
    # TODO: implement
    pass

def add_to_shortlist(gm_id, prospect_id, internal_notes):
    """Add a prospect to the GM's shortlist."""
    # TODO: implement
    pass

def update_shortlist_notes(entry_id, gm_id, internal_notes):
    """Update internal notes on a shortlist entry."""
    # TODO: implement
    pass

def remove_from_shortlist(entry_id, gm_id):
    """Remove a prospect from the GM's shortlist."""
    # TODO: implement
    pass

def view_shortlist(gm_id):
    """View all prospects on a GM's shortlist."""
    # TODO: implement
    pass

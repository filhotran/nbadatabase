# analyst operations

from db import get_connection
from logger import log_error

def get_draft_class_rankings(position=None):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        # join prospect_summary (full stats) with scout ratings
        query = """
            SELECT
                ps.prospect_id,
                ps.p_fname,
                ps.p_lname,
                ps.position,
                ps.draft_year,
                ps.college,
                ps.PPG,
                ps.RPG,
                ps.APG,
                ps.MPG,
                ps.games_played,
                ps.three_pt_pct,
                ps.fg_pct,
                ps.ft_pct,
                ps.stl,
                ps.blk,
                ps.o_rating,
                ps.d_rating,
                AVG(CAST(sr.overall_rating AS FLOAT)) AS avg_scout_rating,
                COUNT(sr.report_id)                   AS total_reports
            FROM prospect_summary ps
            LEFT JOIN SCOUTING_REPORT sr ON ps.prospect_id = sr.prospect_id
        """
        if position:
            query += " WHERE ps.position = ?"
            query += " GROUP BY ps.prospect_id, ps.p_fname, ps.p_lname, ps.position, ps.draft_year, ps.college, ps.PPG, ps.RPG, ps.APG, ps.MPG, ps.games_played, ps.three_pt_pct, ps.fg_pct, ps.ft_pct, ps.stl, ps.blk, ps.o_rating, ps.d_rating"
            cursor.execute(query, position)
        else:
            query += " GROUP BY ps.prospect_id, ps.p_fname, ps.p_lname, ps.position, ps.draft_year, ps.college, ps.PPG, ps.RPG, ps.APG, ps.MPG, ps.games_played, ps.three_pt_pct, ps.fg_pct, ps.ft_pct, ps.stl, ps.blk, ps.o_rating, ps.d_rating"
            cursor.execute(query)
        rows = cursor.fetchall()
        conn.close()
        return [dict(zip([d[0] for d in cursor.description], r)) for r in rows]
    except Exception as e:
        log_error(f"get_draft_class_rankings: {e}")
        return []

def get_all_scouting_reports():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM scout_report_summary ORDER BY submission_date DESC")
        rows = cursor.fetchall()
        conn.close()
        return [dict(zip([d[0] for d in cursor.description], r)) for r in rows]
    except Exception as e:
        log_error(f"get_all_scouting_reports: {e}")
        return []

def get_stats_comparison():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """SELECT
                ps.prospect_id,
                ps.p_fname + ' ' + ps.p_lname AS name,
                ps.position,
                ps.college,
                ps.PPG,
                ps.RPG,
                ps.APG,
                ps.MPG,
                ps.games_played,
                ps.three_pt_pct,
                ps.fg_pct,
                ps.ft_pct,
                ps.stl,
                ps.blk,
                ps.o_rating,
                ps.d_rating
               FROM prospect_summary ps
               ORDER BY ps.PPG DESC"""
        )
        rows = cursor.fetchall()
        conn.close()
        return [dict(zip([d[0] for d in cursor.description], r)) for r in rows]
    except Exception as e:
        log_error(f"get_stats_comparison: {e}")
        return []

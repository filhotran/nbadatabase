# public fan operations

from db import get_connection
from logger import log_error

def get_all_prospects():
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
                ps.draft_year,
                ps.height,
                ps.weight,
                ps.hometown,
                ps.eligibility_status,
                npr.draft_pick_no
               FROM prospect_summary ps
               LEFT JOIN NBA_PLAYER_RECORD npr ON ps.prospect_id = npr.prospect_id
               ORDER BY npr.draft_pick_no ASC"""
        )
        rows = cursor.fetchall()
        conn.close()
        return [dict(zip([d[0] for d in cursor.description], r)) for r in rows]
    except Exception as e:
        log_error(f"get_all_prospects: {e}")
        return []

def search_by_name(name):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM prospect_search WHERE full_name LIKE ?",
            f"%{name}%"
        )
        rows = cursor.fetchall()
        conn.close()
        return [dict(zip([d[0] for d in cursor.description], r)) for r in rows]
    except Exception as e:
        log_error(f"search_by_name: {e}")
        return []

def search_by_archetype(archetype_name):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM prospects_by_archetype WHERE arch_name LIKE ?",
            f"%{archetype_name}%"
        )
        rows = cursor.fetchall()
        conn.close()
        return [dict(zip([d[0] for d in cursor.description], r)) for r in rows]
    except Exception as e:
        log_error(f"search_by_archetype: {e}")
        return []

def get_public_profile(prospect_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT
                p.prospect_id,
                p.p_fname,
                p.p_lname,
                p.date_of_birth,
                p.hometown,
                p.height,
                p.weight,
                p.position,
                p.draft_year,
                p.eligibility_status,
                c.c_name    AS college,
                c.conference,
                cs.PPG,
                cs.RPG,
                cs.APG,
                cs.TPG,
                cs.MPG,
                cs.games_played,
                cs.three_pt_pct,
                cs.fg_pct,
                cs.ft_pct,
                cs.stl,
                cs.blk,
                cs.o_rating,
                cs.d_rating
            FROM PROSPECT p
            JOIN COLLEGE c        ON p.college_id  = c.college_id
            JOIN COLLEGE_STATS cs ON p.prospect_id = cs.prospect_id
            WHERE p.prospect_id = ?
        """, prospect_id)
        row = cursor.fetchone()
        bio = dict(zip([d[0] for d in cursor.description], row)) if row else {}

        cursor.execute("SELECT * FROM nba_comparison_view WHERE prospect_id = ?", prospect_id)
        row = cursor.fetchone()
        nba_comp = dict(zip([d[0] for d in cursor.description], row)) if row else {}

        conn.close()
        return {"bio": bio, "nba_comp": nba_comp}
    except Exception as e:
        log_error(f"get_public_profile: {e}")
        return {}

def get_all_archetypes():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT archetype_id, arch_name, description FROM ARCHETYPE ORDER BY arch_name")
        rows = cursor.fetchall()
        conn.close()
        return [{"archetype_id": r[0], "arch_name": r[1], "description": r[2]} for r in rows]
    except Exception as e:
        log_error(f"get_all_archetypes: {e}")
        return []

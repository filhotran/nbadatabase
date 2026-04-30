# general manager operations

from db import get_connection
from logger import log_info, log_error
from datetime import date

def filter_prospects(position=None, min_PPG=0, min_RPG=0, min_APG=0,
                     min_TPG=0, min_MPG=0, min_three_pct=0, min_fg_pct=0,
                     min_ft_pct=0, min_stl=0, min_blk=0,
                     min_o_rating=0, min_d_rating=0):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        where = "WHERE cs.PPG >= ? AND cs.RPG >= ? AND cs.APG >= ? AND cs.TPG >= ? AND cs.MPG >= ? AND cs.three_pt_pct >= ? AND cs.fg_pct >= ? AND cs.ft_pct >= ? AND cs.stl >= ? AND cs.blk >= ? AND cs.o_rating >= ? AND cs.d_rating >= ?"
        params = [min_PPG, min_RPG, min_APG, min_TPG, min_MPG, min_three_pct, min_fg_pct, min_ft_pct, min_stl, min_blk, min_o_rating, min_d_rating]
        if position:
            where += " AND p.position = ?"
            params.append(position)
        cursor.execute(
            f"""SELECT p.prospect_id, p.p_fname + ' ' + p.p_lname AS name,
                      p.position, c.c_name AS college,
                      cs.PPG, cs.RPG, cs.APG, cs.three_pt_pct,
                      cs.fg_pct, cs.ft_pct,
                      cs.stl, cs.blk, cs.o_rating, cs.d_rating
               FROM PROSPECT p
               JOIN COLLEGE c        ON p.college_id  = c.college_id
               JOIN COLLEGE_STATS cs ON p.prospect_id = cs.prospect_id
               {where}
               ORDER BY cs.PPG DESC""",
            *params
        )
        rows = cursor.fetchall()
        conn.close()
        return [{"prospect_id": r[0], "name": r[1], "position": r[2],
                 "college": r[3], "PPG": r[4], "RPG": r[5], "APG": r[6],
                 "three_pt_pct": r[7], "fg_pct": r[8], "ft_pct": r[9],
                 "stl": r[10], "blk": r[11],
                 "o_rating": r[12], "d_rating": r[13]} for r in rows]
    except Exception as e:
        log_error(f"filter_prospects: {e}")
        return []

def get_prospect_profile(prospect_id):
    # returns full profile
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM prospect_summary WHERE prospect_id = ?", prospect_id)
        bio = dict(zip([d[0] for d in cursor.description], cursor.fetchone() or []))

        cursor.execute("SELECT * FROM scout_report_summary WHERE prospect_id = ?", prospect_id)
        reports = [dict(zip([d[0] for d in cursor.description], r)) for r in cursor.fetchall()]

        cursor.execute("SELECT flag_type, flag_label, description FROM prospect_behavioral_flags WHERE prospect_id = ?", prospect_id)
        flags = [{"flag_type": r[0], "flag_label": r[1], "description": r[2]} for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM nba_comparison_view WHERE prospect_id = ?", prospect_id)
        row = cursor.fetchone()
        nba_comp = dict(zip([d[0] for d in cursor.description], row)) if row else {}

        conn.close()
        return {"bio": bio, "reports": reports, "flags": flags, "nba_comp": nba_comp}
    except Exception as e:
        log_error(f"get_prospect_profile: {e}")
        return {}

def add_to_shortlist(gm_id, prospect_id, internal_notes):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT 1 FROM SHORTLIST_ENTRY WHERE gm_id = ? AND prospect_id = ?",
            gm_id, prospect_id
        )
        if cursor.fetchone():
            conn.close()
            return False, "Prospect already on shortlist."
        cursor.execute(
            "SELECT ISNULL(MAX(entry_id), 0) + 1 FROM SHORTLIST_ENTRY WHERE gm_id = ?",
            gm_id
        )
        new_id = cursor.fetchone()[0]
        cursor.execute(
            """INSERT INTO SHORTLIST_ENTRY (entry_id, gm_id, prospect_id, date_added, internal_notes)
               VALUES (?, ?, ?, ?, ?)""",
            new_id, gm_id, prospect_id, date.today(), internal_notes
        )
        conn.commit()
        conn.close()
        log_info(f"GM {gm_id} shortlisted prospect {prospect_id}")
        return True, "Prospect added to shortlist."
    except Exception as e:
        log_error(f"add_to_shortlist: {e}")
        return False, str(e)

def get_shortlist(gm_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM gm_shortlist_view WHERE gm_id = ? ORDER BY date_added DESC",
            gm_id
        )
        rows = cursor.fetchall()
        conn.close()
        return [dict(zip([d[0] for d in cursor.description], r)) for r in rows]
    except Exception as e:
        log_error(f"get_shortlist: {e}")
        return []

def remove_from_shortlist(gm_id, prospect_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM SHORTLIST_ENTRY WHERE gm_id = ? AND prospect_id = ?",
            gm_id, prospect_id
        )
        conn.commit()
        conn.close()
        log_info(f"GM {gm_id} removed prospect {prospect_id} from shortlist")
        return True, "Prospect removed."
    except Exception as e:
        log_error(f"remove_from_shortlist: {e}")
        return False, str(e)

def update_shortlist_notes(gm_id, prospect_id, new_notes):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE SHORTLIST_ENTRY SET internal_notes = ? WHERE gm_id = ? AND prospect_id = ?",
            new_notes, gm_id, prospect_id
        )
        conn.commit()
        conn.close()
        log_info(f"Shortlist notes updated: GM {gm_id}, prospect {prospect_id}")
        return True, "Notes updated."
    except Exception as e:
        log_error(f"update_shortlist_notes: {e}")
        return False, str(e)

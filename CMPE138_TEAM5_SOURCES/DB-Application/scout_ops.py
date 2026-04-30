# scout operations 

from db import get_connection
from logger import log_info, log_error
from datetime import date

def search_prospects(name=None, college=None, position=None):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT p.prospect_id, p.p_fname + ' ' + p.p_lname AS name,
                   p.position, c.c_name AS college, cs.PPG, cs.RPG, cs.APG
            FROM PROSPECT p
            JOIN COLLEGE c        ON p.college_id  = c.college_id
            JOIN COLLEGE_STATS cs ON p.prospect_id = cs.prospect_id
            WHERE 1=1
        """
        params = []
        if name:
            query += " AND (p.p_fname + ' ' + p.p_lname) LIKE ?"
            params.append(f"%{name}%")
        if college:
            query += " AND c.c_name LIKE ?"
            params.append(f"%{college}%")
        if position:
            query += " AND p.position = ?"
            params.append(position)
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        return [{"prospect_id": r[0], "name": r[1], "position": r[2],
                 "college": r[3], "PPG": r[4], "RPG": r[5], "APG": r[6]} for r in rows]
    except Exception as e:
        log_error(f"search_prospects: {e}")
        return []

def submit_report(prospect_id, scout_id, game_date, game_opponent,
                  notes, scout_orating, scout_drating, scout_intangibles, overall_rating):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT ISNULL(MAX(report_id), 0) + 1 FROM SCOUTING_REPORT WHERE prospect_id = ?",
            prospect_id
        )
        new_id = cursor.fetchone()[0]
        cursor.execute(
            """INSERT INTO SCOUTING_REPORT
               (report_id, prospect_id, scout_id, submission_date, game_date,
                game_opponent, notes, scout_orating, scout_drating, scout_intangibles, overall_rating)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            new_id, prospect_id, scout_id, date.today(), game_date,
            game_opponent, notes, scout_orating, scout_drating, scout_intangibles, overall_rating
        )
        conn.commit()
        conn.close()
        log_info(f"Report submitted: scout {scout_id} -> prospect {prospect_id}")
        return True, "Report submitted."
    except Exception as e:
        log_error(f"submit_report: {e}")
        return False, str(e)

def tag_flag(prospect_id, flag_type, flag_label, description):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT ISNULL(MAX(assessment_id), 0) + 1 FROM BEHAVIORAL_ASSESSMENT WHERE prospect_id = ?",
            prospect_id
        )
        new_id = cursor.fetchone()[0]
        cursor.execute(
            """INSERT INTO BEHAVIORAL_ASSESSMENT
               (assessment_id, prospect_id, flag_type, flag_label, description)
               VALUES (?, ?, ?, ?, ?)""",
            new_id, prospect_id, flag_type, flag_label, description
        )
        conn.commit()
        conn.close()
        log_info(f"Flag tagged: prospect {prospect_id} - {flag_label}")
        return True, f"Flag '{flag_label}' added."
    except Exception as e:
        log_error(f"tag_flag: {e}")
        return False, str(e)

def get_my_reports(scout_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """SELECT sr.report_id, p.p_fname + ' ' + p.p_lname AS prospect,
                      sr.game_date, sr.game_opponent, sr.overall_rating, sr.notes
               FROM SCOUTING_REPORT sr
               JOIN PROSPECT p ON sr.prospect_id = p.prospect_id
               WHERE sr.scout_id = ?
               ORDER BY sr.submission_date DESC""",
            scout_id
        )
        rows = cursor.fetchall()
        conn.close()
        return [{"report_id": r[0], "prospect": r[1], "game_date": str(r[2]),
                 "opponent": r[3], "rating": r[4], "notes": r[5]} for r in rows]
    except Exception as e:
        log_error(f"get_my_reports: {e}")
        return []

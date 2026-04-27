# admin operations

from db import get_connection
from auth import hash_password
from logger import log_info, log_error

def get_all_users():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, u_fname, u_lname, email, role FROM [USER] ORDER BY role")
        rows = cursor.fetchall()
        conn.close()
        return [{"user_id": r[0], "name": f"{r[1]} {r[2]}", "email": r[3], "role": r[4]} for r in rows]
    except Exception as e:
        log_error(f"get_all_users: {e}")
        return []

def create_user(u_fname, u_lname, email, password, role):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO [USER] (u_fname, u_lname, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            u_fname, u_lname, email, hash_password(password), role
        )
        conn.commit()
        conn.close()
        log_info(f"User created: {email} ({role})")
        return True, f"User {u_fname} {u_lname} created."
    except Exception as e:
        log_error(f"create_user: {e}")
        return False, str(e)

def update_user_email(user_id, new_email):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE [USER] SET email = ? WHERE user_id = ?", new_email, user_id)
        conn.commit()
        conn.close()
        log_info(f"Email updated for user {user_id}")
        return True, "Email updated."
    except Exception as e:
        log_error(f"update_user_email: {e}")
        return False, str(e)

def deactivate_user(user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM [USER] WHERE user_id = ?", user_id)
        conn.commit()
        conn.close()
        log_info(f"User deleted: {user_id}")
        return True, "User removed."
    except Exception as e:
        log_error(f"deactivate_user: {e}")
        return False, str(e)

def add_prospect(p_fname, p_lname, position, draft_year, college_id,
                 games_played, PPG, RPG, APG):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO PROSPECT (p_fname, p_lname, position, draft_year, college_id, eligibility_status)
               VALUES (?, ?, ?, ?, ?, 'Freshman')""",
            p_fname, p_lname, position, draft_year, college_id
        )
        cursor.execute("SELECT MAX(prospect_id) FROM PROSPECT")
        new_id = cursor.fetchone()[0]
        cursor.execute(
            """INSERT INTO COLLEGE_STATS
               (stat_id, prospect_id, season_year, games_played, PPG, RPG, APG,
                MPG, TPG, three_pt_pct, fg_pct, ft_pct, stl, blk, o_rating, d_rating)
               VALUES (1, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0)""",
            new_id, draft_year, games_played, PPG, RPG, APG
        )
        conn.commit()
        conn.close()
        log_info(f"Prospect added: {p_fname} {p_lname} ID {new_id}")
        return True, f"Prospect added with ID {new_id}."
    except Exception as e:
        log_error(f"add_prospect: {e}")
        return False, str(e)

def update_prospect_stats(prospect_id, field, value):
    # field must be a valid COLLEGE_STATS column name
    allowed = ['PPG','RPG','APG','TPG','MPG','three_pt_pct','fg_pct',
               'ft_pct','stl','blk','o_rating','d_rating','games_played']
    if field not in allowed:
        return False, "Invalid field."
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(f"UPDATE COLLEGE_STATS SET {field} = ? WHERE prospect_id = ?", value, prospect_id)
        conn.commit()
        conn.close()
        log_info(f"Updated {field} for prospect {prospect_id}")
        return True, f"{field} updated."
    except Exception as e:
        log_error(f"update_prospect_stats: {e}")
        return False, str(e)

def delete_prospect(prospect_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        # delete dependents first then prospect
        for table in ['SHORTLIST_ENTRY', 'NBA_PLAYER_RECORD', 'BEHAVIORAL_ASSESSMENT',
                      'SCOUTING_REPORT', 'COLLEGE_STATS', 'PROSPECT_ARCHETYPE']:
            cursor.execute(f"DELETE FROM {table} WHERE prospect_id = ?", prospect_id)
        cursor.execute("DELETE FROM PROSPECT WHERE prospect_id = ?", prospect_id)
        conn.commit()
        conn.close()
        log_info(f"Prospect deleted: {prospect_id}")
        return True, "Prospect deleted."
    except Exception as e:
        log_error(f"delete_prospect: {e}")
        return False, str(e)

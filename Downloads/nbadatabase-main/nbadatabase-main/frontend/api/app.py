"""
Flask API — wraps the existing DB-Application Python modules as HTTP endpoints.
When DB is not connected, falls back to sample data from 06_sample_data.sql.
"""
import sys
import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS

# ── point Python at the existing DB-Application folder ──────────────────────
DB_APP = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                      '..', '..', 'CMPE138_TEAM5_SOURCES', 'DB-Application'))
sys.path.insert(0, DB_APP)

try:
    from auth          import login as db_login
    from fan_ops       import (get_all_prospects, search_by_name,
                               get_public_profile, get_all_archetypes,
                               search_by_archetype)
    from scout_ops     import search_prospects, submit_report, tag_flag, get_my_reports
    from gm_ops        import (filter_prospects, get_prospect_profile,
                               add_to_shortlist, get_shortlist,
                               remove_from_shortlist, update_shortlist_notes)
    from analyst_ops   import (get_draft_class_rankings, get_all_scouting_reports,
                               get_stats_comparison)
    from admin_ops     import (get_all_users, create_user, update_user_email,
                               deactivate_user, add_prospect,
                               update_prospect_stats, delete_prospect)
    DB_AVAILABLE = True
    DB_ERROR     = None
except Exception as e:
    DB_AVAILABLE = False
    DB_ERROR     = str(e)
    print(f"[WARNING] DB not connected ({e}). Running in DEV mode with sample data.")

# ── DEV fallback data (mirrors 06_sample_data.sql, used when DB is offline) ─
DEV_USERS = [
    {"user_id":1,"name":"James Garden",     "u_fname":"James",   "u_lname":"Garden",     "email":"admin@nbascout.com",   "password":"password123","role":"ADMIN"},
    {"user_id":2,"name":"Ricardo Jefferson","u_fname":"Ricardo", "u_lname":"Jefferson",  "email":"scout1@nbascout.com",  "password":"password123","role":"SCOUT"},
    {"user_id":3,"name":"Morris Burke",     "u_fname":"Morris",  "u_lname":"Burke",      "email":"scout2@nbascout.com",  "password":"password123","role":"SCOUT"},
    {"user_id":4,"name":"Kevin McFarlan",   "u_fname":"Kevin",   "u_lname":"McFarlan",   "email":"scout3@nbascout.com",  "password":"password123","role":"SCOUT"},
    {"user_id":5,"name":"Bike Bumleavy",    "u_fname":"Bike",    "u_lname":"Bumleavy",   "email":"gm1@nbascout.com",     "password":"password123","role":"GM"},
    {"user_id":6,"name":"Bob Perinka",      "u_fname":"Bob",     "u_lname":"Perinka",    "email":"gm2@nbascout.com",     "password":"password123","role":"GM"},
    {"user_id":7,"name":"Kendrick Lerkins", "u_fname":"Kendrick","u_lname":"Lerkins",    "email":"analyst@nbascout.com", "password":"password123","role":"ANALYST"},
    {"user_id":8,"name":"Glen Rivers",      "u_fname":"Glen",    "u_lname":"Rivers",     "email":"fan1@nbascout.com",    "password":"password123","role":"FAN"},
    {"user_id":9,"name":"Jordan Pond",      "u_fname":"Jordan",  "u_lname":"Pond",       "email":"fan2@nbascout.com",    "password":"password123","role":"FAN"},
]
DEV_ARCHETYPES = [
    {"archetype_id":1,"arch_name":"3-and-D Wing",    "description":"Perimeter player who spaces the floor and guards multiple positions"},
    {"archetype_id":2,"arch_name":"Playmaking Guard", "description":"Ball handler who creates for others and scores off the dribble"},
    {"archetype_id":3,"arch_name":"Rim Protector",    "description":"Interior defender who alters and blocks shots near the basket"},
    {"archetype_id":4,"arch_name":"Scoring Wing",     "description":"Wing scorer who can create own shot and score in volume"},
    {"archetype_id":5,"arch_name":"Stretch Big",      "description":"Big man who can step out and shoot the three"},
    {"archetype_id":6,"arch_name":"Two-Way Wing",     "description":"Versatile wing with impact on both ends of the floor"},
    {"archetype_id":7,"arch_name":"Pass-First Guard", "description":"Floor general who prioritizes playmaking over scoring"},
]
_A = DEV_ARCHETYPES
DEV_PROSPECTS = [
    {"prospect_id":1, "p_fname":"AJ",       "p_lname":"Dybantsa", "full_name":"AJ Dybantsa",      "position":"SF","height":"6-9", "weight":205,"hometown":"Ossining, NY",    "draft_year":2026,"eligibility_status":"Freshman","college":"BYU",                        "conference":"Big 12","games_played":35,"MPG":35.2,"PPG":25.5,"RPG":6.8, "APG":3.7,"TPG":2.8,"three_pt_pct":0.361,"fg_pct":0.478,"ft_pct":0.798,"stl":1.4,"blk":0.9,"o_rating":123.1,"d_rating":102.4,"archetypes":[_A[5],_A[3]]},
    {"prospect_id":2, "p_fname":"Darryn",   "p_lname":"Peterson", "full_name":"Darryn Peterson",   "position":"PG","height":"6-6", "weight":195,"hometown":"Memphis, TN",     "draft_year":2026,"eligibility_status":"Freshman","college":"University of Kansas",       "conference":"Big 12","games_played":24,"MPG":33.4,"PPG":20.2,"RPG":4.2, "APG":1.6,"TPG":2.3,"three_pt_pct":0.348,"fg_pct":0.451,"ft_pct":0.812,"stl":1.3,"blk":0.4,"o_rating":119.6,"d_rating":105.8,"archetypes":[_A[1],_A[3]]},
    {"prospect_id":3, "p_fname":"Cameron",  "p_lname":"Boozer",   "full_name":"Cameron Boozer",    "position":"PF","height":"6-9", "weight":225,"hometown":"Miami, FL",       "draft_year":2026,"eligibility_status":"Freshman","college":"Duke University",            "conference":"ACC",   "games_played":38,"MPG":34.1,"PPG":22.5,"RPG":10.2,"APG":4.1,"TPG":2.4,"three_pt_pct":0.391,"fg_pct":0.512,"ft_pct":0.831,"stl":1.1,"blk":1.2,"o_rating":124.8,"d_rating":100.7,"archetypes":[_A[4],_A[5]]},
    {"prospect_id":4, "p_fname":"Caleb",    "p_lname":"Wilson",   "full_name":"Caleb Wilson",      "position":"PF","height":"6-10","weight":215,"hometown":"Atlanta, GA",     "draft_year":2026,"eligibility_status":"Freshman","college":"University of North Carolina","conference":"ACC",   "games_played":24,"MPG":32.8,"PPG":19.8,"RPG":9.4, "APG":2.7,"TPG":2.1,"three_pt_pct":0.259,"fg_pct":0.501,"ft_pct":0.774,"stl":0.9,"blk":1.4,"o_rating":118.3,"d_rating":103.2,"archetypes":[_A[4],_A[5]]},
    {"prospect_id":5, "p_fname":"Keaton",   "p_lname":"Wagler",   "full_name":"Keaton Wagler",     "position":"PG","height":"6-6", "weight":190,"hometown":"Goshen, IN",      "draft_year":2026,"eligibility_status":"Freshman","college":"University of Illinois",      "conference":"Big Ten","games_played":37,"MPG":33.6,"PPG":17.9,"RPG":5.1, "APG":4.2,"TPG":1.8,"three_pt_pct":0.397,"fg_pct":0.461,"ft_pct":0.821,"stl":1.2,"blk":0.3,"o_rating":120.4,"d_rating":104.6,"archetypes":[_A[6],_A[1]]},
    {"prospect_id":6, "p_fname":"Darius",   "p_lname":"Acuff",    "full_name":"Darius Acuff",      "position":"PG","height":"6-3", "weight":180,"hometown":"Little Rock, AR", "draft_year":2026,"eligibility_status":"Freshman","college":"University of Arkansas",      "conference":"SEC",   "games_played":36,"MPG":32.9,"PPG":23.5,"RPG":3.1, "APG":6.4,"TPG":2.2,"three_pt_pct":0.440,"fg_pct":0.489,"ft_pct":0.801,"stl":1.6,"blk":0.2,"o_rating":122.7,"d_rating":106.3,"archetypes":[_A[1],_A[6]]},
    {"prospect_id":7, "p_fname":"Kingston", "p_lname":"Flemings", "full_name":"Kingston Flemings", "position":"PG","height":"6-4", "weight":185,"hometown":"Houston, TX",     "draft_year":2026,"eligibility_status":"Freshman","college":"University of Houston",       "conference":"Big 12","games_played":37,"MPG":32.1,"PPG":16.1,"RPG":4.1, "APG":5.2,"TPG":2.1,"three_pt_pct":0.334,"fg_pct":0.448,"ft_pct":0.792,"stl":1.5,"blk":0.4,"o_rating":118.9,"d_rating":103.8,"archetypes":[_A[1]]},
    {"prospect_id":8, "p_fname":"Nate",     "p_lname":"Ament",    "full_name":"Nate Ament",        "position":"SF","height":"6-10","weight":205,"hometown":"Portland, OR",    "draft_year":2026,"eligibility_status":"Freshman","college":"University of Tennessee",     "conference":"SEC",   "games_played":35,"MPG":31.8,"PPG":16.7,"RPG":6.3, "APG":2.3,"TPG":1.9,"three_pt_pct":0.312,"fg_pct":0.462,"ft_pct":0.758,"stl":1.0,"blk":0.8,"o_rating":116.2,"d_rating":104.1,"archetypes":[_A[5],_A[0]]},
    {"prospect_id":9, "p_fname":"Mikel",    "p_lname":"Brown",    "full_name":"Mikel Brown",       "position":"PG","height":"6-5", "weight":195,"hometown":"Louisville, KY",  "draft_year":2026,"eligibility_status":"Freshman","college":"University of Louisville",    "conference":"ACC",   "games_played":21,"MPG":33.2,"PPG":18.2,"RPG":3.3, "APG":4.7,"TPG":2.6,"three_pt_pct":0.340,"fg_pct":0.447,"ft_pct":0.814,"stl":1.3,"blk":0.3,"o_rating":117.4,"d_rating":107.2,"archetypes":[_A[1]]},
    {"prospect_id":10,"p_fname":"Brayden",  "p_lname":"Burries",  "full_name":"Brayden Burries",   "position":"SG","height":"6-4", "weight":200,"hometown":"Scottsdale, AZ",  "draft_year":2026,"eligibility_status":"Freshman","college":"University of Arizona",       "conference":"Big 12","games_played":39,"MPG":32.4,"PPG":16.1,"RPG":4.9, "APG":2.4,"TPG":1.7,"three_pt_pct":0.318,"fg_pct":0.468,"ft_pct":0.801,"stl":1.4,"blk":0.5,"o_rating":116.8,"d_rating":104.9,"archetypes":[_A[0],_A[1]]},
]
DEV_REPORTS = [
    {"report_id":1, "prospect_id":1, "prospect_name":"AJ Dybantsa",      "scout_id":2,"scout_name":"Ricardo Jefferson","submission_date":"2026-02-10","game_date":"2026-02-08","game_opponent":"Utah",      "notes":"Dybantsa carried BYU single-handedly. Wing scoring is as good as any player I have scouted. Easiest number one pick I have evaluated.",                                        "scout_orating":10,"scout_drating":9, "scout_intangibles":10,"overall_rating":10},
    {"report_id":2, "prospect_id":1, "prospect_name":"AJ Dybantsa",      "scout_id":3,"scout_name":"Morris Burke",     "submission_date":"2026-03-01","game_date":"2026-02-28","game_opponent":"TCU",       "notes":"Another dominant performance. Size, skill and makeup are all elite. Ceiling as high as anyone in the class.",                                                               "scout_orating":9, "scout_drating":9, "scout_intangibles":10,"overall_rating":9},
    {"report_id":3, "prospect_id":2, "prospect_name":"Darryn Peterson",  "scout_id":2,"scout_name":"Ricardo Jefferson","submission_date":"2026-01-20","game_date":"2026-01-18","game_opponent":"Baylor",    "notes":"Peterson is the most gifted shotmaker in this draft. Health questions from preseason cramping episode are worth monitoring.",                                               "scout_orating":9, "scout_drating":7, "scout_intangibles":7, "overall_rating":8},
    {"report_id":4, "prospect_id":3, "prospect_name":"Cameron Boozer",   "scout_id":3,"scout_name":"Morris Burke",     "submission_date":"2026-02-15","game_date":"2026-02-13","game_opponent":"NC State",  "notes":"Boozer was dominant in every phase. Comparable to Sabonis in how he impacts winning. Legitimate Player of the Year.",                                                   "scout_orating":8, "scout_drating":8, "scout_intangibles":10,"overall_rating":9},
    {"report_id":5, "prospect_id":4, "prospect_name":"Caleb Wilson",     "scout_id":4,"scout_name":"Kevin McFarlan",  "submission_date":"2026-01-25","game_date":"2026-01-23","game_opponent":"Wake Forest","notes":"Wilson showed explosive tools and excellent motor. Three point shooting is a real concern but physicality compensated.",                                               "scout_orating":7, "scout_drating":8, "scout_intangibles":8, "overall_rating":8},
    {"report_id":6, "prospect_id":5, "prospect_name":"Keaton Wagler",    "scout_id":2,"scout_name":"Ricardo Jefferson","submission_date":"2026-02-20","game_date":"2026-02-18","game_opponent":"Michigan",  "notes":"Wagler was the smartest player on the floor. Reminded me of a young Haliburton.",                                                                                        "scout_orating":8, "scout_drating":7, "scout_intangibles":9, "overall_rating":8},
    {"report_id":7, "prospect_id":6, "prospect_name":"Darius Acuff",     "scout_id":4,"scout_name":"Kevin McFarlan",  "submission_date":"2026-03-10","game_date":"2026-03-08","game_opponent":"Kentucky",  "notes":"Acuff was sensational in the SEC tournament. Most NBA-ready point guard in the class.",                                                                                  "scout_orating":9, "scout_drating":6, "scout_intangibles":9, "overall_rating":9},
    {"report_id":8, "prospect_id":7, "prospect_name":"Kingston Flemings","scout_id":3,"scout_name":"Morris Burke",     "submission_date":"2026-02-12","game_date":"2026-02-10","game_opponent":"Texas Tech","notes":"Flemings put immense pressure on the paint. Speed and finishing are elite.",                                                                                         "scout_orating":7, "scout_drating":7, "scout_intangibles":8, "overall_rating":8},
    {"report_id":9, "prospect_id":8, "prospect_name":"Nate Ament",       "scout_id":2,"scout_name":"Ricardo Jefferson","submission_date":"2026-01-30","game_date":"2026-01-28","game_opponent":"Vanderbilt","notes":"Ament flashed skill and fluidity but left scouts wanting more. Upside is real if healthy.",                                                                           "scout_orating":7, "scout_drating":7, "scout_intangibles":7, "overall_rating":7},
    {"report_id":10,"prospect_id":10,"prospect_name":"Brayden Burries",  "scout_id":4,"scout_name":"Kevin McFarlan",  "submission_date":"2026-02-25","game_date":"2026-02-23","game_opponent":"UCLA",      "notes":"Burries was solid and multifaceted. Not elite in any one area but added value everywhere.",                                                                               "scout_orating":7, "scout_drating":7, "scout_intangibles":8, "overall_rating":7},
]
DEV_FLAGS = [
    {"prospect_id":1, "flag_type":"positive","flag_label":"High Motor",         "description":"Relentless effort on both ends"},
    {"prospect_id":1, "flag_type":"positive","flag_label":"Coachable",          "description":"Strong makeup and work ethic"},
    {"prospect_id":2, "flag_type":"positive","flag_label":"Shot Creator",       "description":"Most gifted scorer and shotmaker in the class"},
    {"prospect_id":2, "flag_type":"negative","flag_label":"Health Concern",     "description":"Full-body cramping episode in preseason"},
    {"prospect_id":3, "flag_type":"positive","flag_label":"High Motor",         "description":"Led college basketball with 17.1 box plus-minus"},
    {"prospect_id":3, "flag_type":"positive","flag_label":"Clutch",             "description":"Carried Duke to near Final Four berth"},
    {"prospect_id":4, "flag_type":"positive","flag_label":"High Motor",         "description":"Physicality and motor compensated for unpolished skill"},
    {"prospect_id":4, "flag_type":"negative","flag_label":"Streaky Shooter",    "description":"Shot just 7-for-27 from three"},
    {"prospect_id":5, "flag_type":"positive","flag_label":"Floor General",      "description":"Smart decision-making, constantly makes the next pass"},
    {"prospect_id":6, "flag_type":"positive","flag_label":"Clutch",             "description":"Led Arkansas to SEC tournament title, won Player of the Year"},
    {"prospect_id":7, "flag_type":"negative","flag_label":"Streaky Shooter",    "description":"Jumper still has room for improvement"},
    {"prospect_id":8, "flag_type":"negative","flag_label":"Injury Prone",       "description":"Knee and ankle injuries interrupted strong second half"},
    {"prospect_id":9, "flag_type":"negative","flag_label":"Injury Prone",       "description":"Lingering back injury caused missed postseason"},
    {"prospect_id":10,"flag_type":"positive","flag_label":"Versatile Defender", "description":"Multifaceted contributor adding value defensively"},
]
DEV_COMPS = [
    {"prospect_id":1, "comp_player_name":"Kevin Durant",           "draft_pick_no":1,  "nba_team":"San Antonio Spurs",     "role_level":"superstar",   "seasons_played":4,"career_orating":125.1,"career_drating":99.2},
    {"prospect_id":2, "comp_player_name":"Devin Booker",           "draft_pick_no":2,  "nba_team":"Washington Wizards",    "role_level":"All-Star",    "seasons_played":4,"career_orating":120.4,"career_drating":104.3},
    {"prospect_id":3, "comp_player_name":"Domantas Sabonis",       "draft_pick_no":3,  "nba_team":"Indiana Pacers",        "role_level":"All-Star",    "seasons_played":5,"career_orating":121.8,"career_drating":103.6},
    {"prospect_id":4, "comp_player_name":"Jaren Jackson Jr",       "draft_pick_no":4,  "nba_team":"Charlotte Hornets",     "role_level":"starter",     "seasons_played":3,"career_orating":114.2,"career_drating":104.8},
    {"prospect_id":5, "comp_player_name":"Tyrese Haliburton",      "draft_pick_no":6,  "nba_team":"Minnesota Timberwolves","role_level":"starter",     "seasons_played":4,"career_orating":116.3,"career_drating":105.1},
    {"prospect_id":6, "comp_player_name":"Trae Young",             "draft_pick_no":5,  "nba_team":"New Orleans Pelicans",  "role_level":"All-Star",    "seasons_played":4,"career_orating":119.6,"career_drating":106.4},
    {"prospect_id":7, "comp_player_name":"Shai Gilgeous-Alexander","draft_pick_no":8,  "nba_team":"Oklahoma City Thunder", "role_level":"starter",     "seasons_played":3,"career_orating":113.8,"career_drating":104.2},
    {"prospect_id":8, "comp_player_name":"OG Anunoby",             "draft_pick_no":10, "nba_team":"Portland Trail Blazers","role_level":"role player", "seasons_played":3,"career_orating":109.4,"career_drating":105.7},
    {"prospect_id":10,"comp_player_name":"Josh Hart",              "draft_pick_no":12, "nba_team":"Atlanta Hawks",         "role_level":"role player", "seasons_played":3,"career_orating":108.7,"career_drating":106.1},
]
DEV_SHORTLISTS = [
    {"entry_id":1,"gm_id":5,"prospect_id":1,"date_added":"2026-02-15","internal_notes":"Best prospect in class. Would need to trade up significantly."},
    {"entry_id":2,"gm_id":5,"prospect_id":3,"date_added":"2026-02-20","internal_notes":"Boozer fits our system perfectly. Love the Sabonis comp."},
    {"entry_id":3,"gm_id":5,"prospect_id":6,"date_added":"2026-03-01","internal_notes":"Acuff is the most NBA-ready PG in class."},
    {"entry_id":4,"gm_id":6,"prospect_id":2,"date_added":"2026-01-25","internal_notes":"Peterson is the best pure scorer. Need full medical before committing."},
    {"entry_id":5,"gm_id":6,"prospect_id":5,"date_added":"2026-02-22","internal_notes":"Wagler is a steal in the back half of lottery."},
    {"entry_id":6,"gm_id":6,"prospect_id":7,"date_added":"2026-03-05","internal_notes":"Flemings speed fits our transition style."},
]

app = Flask(__name__)
app.secret_key = 'nba-scout-2026-dev-key'
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://localhost:3000'])

# ── helpers ──────────────────────────────────────────────────────────────────
def db_required(f):
    """No-op when DB is available; falls back to dev data when not."""
    return f  # routes handle DB_AVAILABLE themselves

def auth_required(*roles):
    def decorator(f):
        from functools import wraps
        @wraps(f)
        def wrapper(*args, **kwargs):
            if 'user' not in session:
                return jsonify({'error': 'Not logged in'}), 401
            if roles and session['user']['role'] not in roles:
                return jsonify({'error': 'Forbidden'}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

# ── auth ─────────────────────────────────────────────────────────────────────
@app.route('/api/login', methods=['POST'])
def api_login():
    data     = request.json or {}
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')
    if DB_AVAILABLE:
        user = db_login(email, password)
    else:
        u = next((u for u in DEV_USERS if u['email'] == email and u['password'] == password), None)
        user = {k: v for k, v in u.items() if k != 'password'} if u else None
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    session['user'] = user
    return jsonify(user)

@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({'ok': True})

@app.route('/api/me')
def api_me():
    return jsonify(session.get('user'))

# ── public / fan ─────────────────────────────────────────────────────────────
@app.route('/api/prospects')
def api_prospects():
    if not DB_AVAILABLE:
        q  = (request.args.get('q') or '').lower()
        results = DEV_PROSPECTS
        if q:
            results = [p for p in results if q in p['full_name'].lower() or q in p['college'].lower()]
        return jsonify(results)
    q         = request.args.get('q')
    archetype = request.args.get('archetype')
    if q:        return jsonify(search_by_name(q))
    if archetype: return jsonify(search_by_archetype(archetype))
    return jsonify(get_all_prospects())

@app.route('/api/prospects/<int:pid>')
def api_prospect(pid):
    if not DB_AVAILABLE:
        p      = next((p for p in DEV_PROSPECTS if p['prospect_id'] == pid), None)
        if not p: return jsonify({'error': 'Not found'}), 404
        user   = session.get('user')
        reports= [r for r in DEV_REPORTS if r['prospect_id'] == pid]
        flags  = [f for f in DEV_FLAGS   if f['prospect_id'] == pid]
        comp   = next((c for c in DEV_COMPS if c['prospect_id'] == pid), None)
        return jsonify({'bio': p, 'reports': reports if user else [], 'flags': flags if user else [], 'nba_comp': comp, 'archetypes': p.get('archetypes', [])})
    user = session.get('user')
    if user and user['role'] in ('GM', 'ANALYST', 'SCOUT', 'ADMIN'):
        return jsonify(get_prospect_profile(pid))
    return jsonify(get_public_profile(pid))

@app.route('/api/archetypes')
def api_archetypes():
    if not DB_AVAILABLE:
        return jsonify(DEV_ARCHETYPES)
    return jsonify(get_all_archetypes())

# ── scout ─────────────────────────────────────────────────────────────────────
@app.route('/api/prospects/search')
@db_required
@auth_required('SCOUT', 'GM', 'ANALYST', 'ADMIN')
def api_search():
    return jsonify(search_prospects(
        name     = request.args.get('name'),
        college  = request.args.get('college'),
        position = request.args.get('position')
    ))

@app.route('/api/reports', methods=['GET', 'POST'])
def api_reports():
    if 'user' not in session: return jsonify({'error': 'Not logged in'}), 401
    if request.method == 'GET':
        if session['user']['role'] not in ('SCOUT', 'GM', 'ANALYST', 'ADMIN'): return jsonify({'error': 'Forbidden'}), 403
        if not DB_AVAILABLE: return jsonify(DEV_REPORTS)
        return jsonify(get_all_scouting_reports())
    if session['user']['role'] != 'SCOUT': return jsonify({'error': 'Forbidden'}), 403
    d = request.json or {}
    if not DB_AVAILABLE:
        DEV_REPORTS.append({**d, 'report_id': len(DEV_REPORTS)+1, 'scout_id': session['user']['user_id'], 'scout_name': session['user']['name'], 'submission_date': '2026-04-25'})
        return jsonify({'ok': True, 'message': 'Report submitted (dev mode).'})
    ok, msg = submit_report(d['prospect_id'], session['user']['user_id'], d['game_date'], d['game_opponent'], d['notes'], d['scout_orating'], d['scout_drating'], d['scout_intangibles'], d['overall_rating'])
    return jsonify({'ok': ok, 'message': msg}), (200 if ok else 400)

@app.route('/api/my-reports')
def api_my_reports():
    if 'user' not in session or session['user']['role'] != 'SCOUT': return jsonify({'error': 'Forbidden'}), 403
    sid = session['user']['user_id']
    if not DB_AVAILABLE:
        return jsonify([r for r in DEV_REPORTS if r['scout_id'] == sid])
    return jsonify(get_my_reports(sid))

@app.route('/api/flags', methods=['POST'])
def api_add_flag():
    if 'user' not in session or session['user']['role'] != 'SCOUT': return jsonify({'error': 'Forbidden'}), 403
    d = request.json or {}
    if not DB_AVAILABLE:
        DEV_FLAGS.append(d)
        return jsonify({'ok': True, 'message': f"Flag '{d.get('flag_label')}' added (dev mode)."})
    ok, msg = tag_flag(d['prospect_id'], d['flag_type'], d['flag_label'], d['description'])
    return jsonify({'ok': ok, 'message': msg}), (200 if ok else 400)

# ── gm ───────────────────────────────────────────────────────────────────────
@app.route('/api/filter')
def api_filter():
    if 'user' not in session or session['user']['role'] not in ('GM', 'SCOUT', 'ANALYST', 'FAN'): return jsonify({'error': 'Forbidden'}), 403
    a = request.args
    if not DB_AVAILABLE:
        pos  = a.get('position') or None
        res  = [p for p in DEV_PROSPECTS if
                (not pos or p['position'] == pos) and
                p['PPG']  >= float(a.get('min_PPG', 0)) and
                p['RPG']  >= float(a.get('min_RPG', 0)) and
                p['APG']  >= float(a.get('min_APG', 0)) and
                p['stl']  >= float(a.get('min_stl', 0)) and
                p['blk']  >= float(a.get('min_blk', 0)) and
                p['three_pt_pct'] >= float(a.get('min_three_pct', 0)) and
                p['fg_pct']       >= float(a.get('min_fg_pct', 0))]
        return jsonify(sorted(res, key=lambda x: x['PPG'], reverse=True))
    return jsonify(filter_prospects(position=a.get('position') or None, min_PPG=float(a.get('min_PPG',0)), min_RPG=float(a.get('min_RPG',0)), min_APG=float(a.get('min_APG',0)), min_three_pct=float(a.get('min_three_pct',0)), min_fg_pct=float(a.get('min_fg_pct',0)), min_stl=float(a.get('min_stl',0)), min_blk=float(a.get('min_blk',0))))

@app.route('/api/shortlist', methods=['GET', 'POST'])
def api_shortlist():
    if 'user' not in session or session['user']['role'] != 'GM': return jsonify({'error': 'Forbidden'}), 403
    gm_id = session['user']['user_id']
    if request.method == 'GET':
        if not DB_AVAILABLE:
            entries = [s for s in DEV_SHORTLISTS if s['gm_id'] == gm_id]
            result  = []
            for e in entries:
                p = next((p for p in DEV_PROSPECTS if p['prospect_id'] == e['prospect_id']), None)
                if p: result.append({**p, 'date_added': e['date_added'], 'internal_notes': e['internal_notes']})
            return jsonify(result)
        return jsonify(get_shortlist(gm_id))
    d = request.json or {}
    if not DB_AVAILABLE:
        if any(s['gm_id'] == gm_id and s['prospect_id'] == d['prospect_id'] for s in DEV_SHORTLISTS):
            return jsonify({'ok': False, 'message': 'Already on shortlist'}), 400
        DEV_SHORTLISTS.append({'entry_id': len(DEV_SHORTLISTS)+1, 'gm_id': gm_id, 'prospect_id': d['prospect_id'], 'date_added': '2026-04-25', 'internal_notes': d.get('internal_notes','')})
        return jsonify({'ok': True, 'message': 'Added to shortlist.'})
    ok, msg = add_to_shortlist(gm_id, d['prospect_id'], d.get('internal_notes', ''))
    return jsonify({'ok': ok, 'message': msg}), (200 if ok else 400)

@app.route('/api/shortlist/<int:pid>', methods=['DELETE'])
def api_shortlist_remove(pid):
    if 'user' not in session or session['user']['role'] != 'GM': return jsonify({'error': 'Forbidden'}), 403
    gm_id = session['user']['user_id']
    if not DB_AVAILABLE:
        DEV_SHORTLISTS[:] = [s for s in DEV_SHORTLISTS if not (s['gm_id'] == gm_id and s['prospect_id'] == pid)]
        return jsonify({'ok': True, 'message': 'Removed.'})
    ok, msg = remove_from_shortlist(gm_id, pid)
    return jsonify({'ok': ok, 'message': msg}), (200 if ok else 400)

@app.route('/api/shortlist/<int:pid>/notes', methods=['PUT'])
def api_shortlist_notes(pid):
    if 'user' not in session or session['user']['role'] != 'GM': return jsonify({'error': 'Forbidden'}), 403
    d = request.json or {}
    if not DB_AVAILABLE:
        for s in DEV_SHORTLISTS:
            if s['gm_id'] == session['user']['user_id'] and s['prospect_id'] == pid:
                s['internal_notes'] = d.get('notes','')
        return jsonify({'ok': True, 'message': 'Notes updated.'})
    ok, msg = update_shortlist_notes(session['user']['user_id'], pid, d.get('notes', ''))
    return jsonify({'ok': ok, 'message': msg}), (200 if ok else 400)

# ── analyst ───────────────────────────────────────────────────────────────────
@app.route('/api/rankings')
def api_rankings():
    if 'user' not in session or session['user']['role'] not in ('SCOUT', 'GM', 'ANALYST','ADMIN'): return jsonify({'error':'Forbidden'}),403
    if not DB_AVAILABLE:
        pos = request.args.get('position')
        out = []
        for p in DEV_PROSPECTS:
            if pos and p['position'] != pos: continue
            reps = [r for r in DEV_REPORTS if r['prospect_id'] == p['prospect_id']]
            avg  = round(sum(r['overall_rating'] for r in reps) / len(reps), 1) if reps else None
            out.append({**p, 'avg_scout_rating': avg, 'total_reports': len(reps)})
        return jsonify(sorted(out, key=lambda x: (x['avg_scout_rating'] or 0), reverse=True))
    return jsonify(get_draft_class_rankings(position=request.args.get('position') or None))

@app.route('/api/stats')
def api_stats():
    if 'user' not in session or session['user']['role'] not in ('SCOUT', 'GM', 'ANALYST','ADMIN'): return jsonify({'error':'Forbidden'}),403
    if not DB_AVAILABLE:
        return jsonify([{**p, 'name': p['full_name']} for p in DEV_PROSPECTS])
    return jsonify(get_stats_comparison())

# ── admin ─────────────────────────────────────────────────────────────────────
@app.route('/api/users', methods=['GET', 'POST'])
def api_users():
    if 'user' not in session or session['user']['role'] != 'ADMIN': return jsonify({'error':'Forbidden'}),403
    if request.method == 'GET':
        if not DB_AVAILABLE: return jsonify([{k:v for k,v in u.items() if k!='password'} for u in DEV_USERS])
        return jsonify(get_all_users())
    d = request.json or {}
    if not DB_AVAILABLE:
        DEV_USERS.append({'user_id': max(u['user_id'] for u in DEV_USERS)+1, 'name': f"{d['u_fname']} {d['u_lname']}", **d})
        return jsonify({'ok': True, 'message': 'User created (dev mode).'})
    ok, msg = create_user(d['u_fname'], d['u_lname'], d['email'], d['password'], d['role'])
    return jsonify({'ok': ok, 'message': msg}), (200 if ok else 400)

@app.route('/api/users/<int:uid>', methods=['DELETE'])
def api_delete_user(uid):
    if 'user' not in session or session['user']['role'] != 'ADMIN': return jsonify({'error':'Forbidden'}),403
    if not DB_AVAILABLE:
        DEV_USERS[:] = [u for u in DEV_USERS if u['user_id'] != uid]
        return jsonify({'ok': True, 'message': 'User removed (dev mode).'})
    ok, msg = deactivate_user(uid)
    return jsonify({'ok': ok, 'message': msg}), (200 if ok else 400)

@app.route('/api/colleges')
def api_colleges():
    if not DB_AVAILABLE:
        return jsonify([
            {"college_id":1,"c_name":"BYU"},{"college_id":2,"c_name":"University of Kansas"},
            {"college_id":3,"c_name":"Duke University"},{"college_id":4,"c_name":"University of North Carolina"},
            {"college_id":5,"c_name":"University of Illinois"},{"college_id":6,"c_name":"University of Arkansas"},
            {"college_id":7,"c_name":"University of Houston"},{"college_id":8,"c_name":"University of Tennessee"},
            {"college_id":9,"c_name":"University of Louisville"},{"college_id":10,"c_name":"University of Arizona"},
        ])
    try:
        from db import get_connection
        conn   = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT college_id, c_name FROM COLLEGE ORDER BY c_name")
        rows   = cursor.fetchall()
        conn.close()
        return jsonify([{"college_id": r[0], "c_name": r[1]} for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/prospects', methods=['POST'])
def api_add_prospect():
    if 'user' not in session or session['user']['role'] != 'ADMIN': return jsonify({'error':'Forbidden'}),403
    if not DB_AVAILABLE: return jsonify({'ok': False, 'message': 'Connect DB to add prospects.'}), 503
    d = request.json or {}
    ok, msg = add_prospect(d['p_fname'], d['p_lname'], d['position'], d['draft_year'], d['college_id'], d['games_played'], d['PPG'], d['RPG'], d['APG'])
    return jsonify({'ok': ok, 'message': msg}), (200 if ok else 400)

@app.route('/api/admin/prospects/<int:pid>', methods=['DELETE'])
def api_delete_prospect(pid):
    if 'user' not in session or session['user']['role'] != 'ADMIN': return jsonify({'error':'Forbidden'}),403
    if not DB_AVAILABLE:
        DEV_PROSPECTS[:] = [p for p in DEV_PROSPECTS if p['prospect_id'] != pid]
        return jsonify({'ok': True, 'message': 'Prospect deleted (dev mode).'})
    ok, msg = delete_prospect(pid)
    return jsonify({'ok': ok, 'message': msg}), (200 if ok else 400)

if __name__ == '__main__':
    app.run(debug=True, port=5001)

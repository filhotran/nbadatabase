-- views for the NBA Draft Scouting Database

USE nba_scouting;
GO

-- full prospect summary
-- SELECT * FROM prospect_summary
CREATE VIEW prospect_summary AS
SELECT
    p.prospect_id,
    p.p_fname,
    p.p_lname,
    p.position,
    p.height,
    p.weight,
    p.hometown,
    p.draft_year,
    p.eligibility_status,
    c.c_name        AS college,
    c.conference,
    c.division,
    cs.PPG,
    cs.RPG,
    cs.APG,
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
JOIN COLLEGE_STATS cs ON p.prospect_id = cs.prospect_id;
GO

-- prospest ranking
-- SELECT * FROM draft_class_rankings
CREATE VIEW draft_class_rankings AS
SELECT
    p.prospect_id,
    p.p_fname,
    p.p_lname,
    p.position,
    p.draft_year,
    c.c_name                                  AS college,
    cs.PPG,
    cs.RPG,
    cs.APG,
    AVG(CAST(sr.overall_rating AS FLOAT))     AS avg_scout_rating,
    COUNT(sr.report_id)                       AS total_reports
FROM PROSPECT p
JOIN COLLEGE c        ON p.college_id  = c.college_id
JOIN COLLEGE_STATS cs ON p.prospect_id = cs.prospect_id
LEFT JOIN SCOUTING_REPORT sr ON p.prospect_id = sr.prospect_id
GROUP BY
    p.prospect_id, p.p_fname, p.p_lname,
    p.position, p.draft_year, c.c_name,
    cs.PPG, cs.RPG, cs.APG;
GO

-- scout report summary for evaluations
-- SELECT * FROM scout_report_summary
CREATE VIEW scout_report_summary AS
SELECT
    sr.report_id,
    sr.prospect_id,
    p.p_fname + ' ' + p.p_lname    AS prospect_name,
    u.u_fname + ' ' + u.u_lname    AS scout_name,
    sr.submission_date,
    sr.game_date,
    sr.game_opponent,
    sr.scout_orating,
    sr.scout_drating,
    sr.scout_intangibles,
    sr.overall_rating,
    sr.notes
FROM SCOUTING_REPORT sr
JOIN PROSPECT p ON sr.prospect_id = p.prospect_id
JOIN [USER] u   ON sr.scout_id    = u.user_id;
GO

-- shortlist for team general managers
-- SELECT * FROM gm_shortlist_view
CREATE VIEW gm_shortlist_view AS
SELECT
    se.entry_id,
    se.gm_id,
    u.u_fname + ' ' + u.u_lname    AS gm_name,
    p.prospect_id,
    p.p_fname + ' ' + p.p_lname    AS prospect_name,
    p.position,
    c.c_name                        AS college,
    cs.PPG,
    cs.RPG,
    cs.APG,
    se.date_added,
    se.internal_notes
FROM SHORTLIST_ENTRY se
JOIN [USER] u         ON se.gm_id       = u.user_id
JOIN PROSPECT p       ON se.prospect_id = p.prospect_id
JOIN COLLEGE c        ON p.college_id   = c.college_id
JOIN COLLEGE_STATS cs ON p.prospect_id  = cs.prospect_id;
GO

-- prospect flags
-- SELECT * FROM prospect_behavioral_flags
CREATE VIEW prospect_behavioral_flags AS
SELECT
    ba.assessment_id,
    ba.prospect_id,
    p.p_fname + ' ' + p.p_lname    AS prospect_name,
    p.position,
    c.c_name                        AS college,
    ba.flag_type,
    ba.flag_label,
    ba.description
FROM BEHAVIORAL_ASSESSMENT ba
JOIN PROSPECT p ON ba.prospect_id = p.prospect_id
JOIN COLLEGE c  ON p.college_id   = c.college_id;
GO

-- prospect nba comparisons
-- SELECT * FROM nba_comparison_view
CREATE VIEW nba_comparison_view AS
SELECT
    npr.career_id,
    npr.prospect_id,
    p.p_fname + ' ' + p.p_lname    AS prospect_name,
    p.position,
    c.c_name                        AS college,
    npr.comp_player_name,
    npr.draft_pick_no,
    npr.nba_team,
    npr.role_level,
    npr.seasons_played,
    npr.career_orating,
    npr.career_drating
FROM NBA_PLAYER_RECORD npr
JOIN PROSPECT p ON npr.prospect_id = p.prospect_id
JOIN COLLEGE c  ON p.college_id    = c.college_id;
GO
    
-- quick name search for the website search bar
CREATE VIEW prospect_search AS
SELECT
    p.prospect_id,
    p.p_fname + ' ' + p.p_lname    AS full_name,
    p.position,
    p.draft_year,
    c.c_name                        AS college
FROM PROSPECT p
JOIN COLLEGE c ON p.college_id = c.college_id;
GO

-- browse by archetype
CREATE VIEW prospects_by_archetype AS
SELECT
    a.arch_name,
    a.description,
    p.prospect_id,
    p.p_fname + ' ' + p.p_lname    AS prospect_name,
    p.position,
    c.c_name                        AS college,
    cs.PPG, cs.RPG, cs.APG
FROM ARCHETYPE a
JOIN PROSPECT_ARCHETYPE pa ON a.archetype_id  = pa.archetype_id
JOIN PROSPECT p            ON pa.prospect_id  = p.prospect_id
JOIN COLLEGE c             ON p.college_id    = c.college_id
JOIN COLLEGE_STATS cs      ON p.prospect_id   = cs.prospect_id;
GO

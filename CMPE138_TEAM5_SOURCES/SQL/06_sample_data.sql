-- SJSU CMPE 138 SPRING 2026 TEAM5
-- File: 06_sample_data.sql
-- Description: Sample data for the NBA Draft Scouting Database
-- Owner: Filho Tran

USE nba_scouting;
GO

-- ============================================================
-- COLLEGES
-- ============================================================
INSERT INTO COLLEGE (c_name, conference, division) VALUES
('Duke University', 'ACC', 'Division I'),
('University of Kansas', 'Big 12', 'Division I'),
('University of Kentucky', 'SEC', 'Division I'),
('University of Alabama', 'SEC', 'Division I'),
('Gonzaga University', 'WCC', 'Division I'),
('University of Connecticut', 'Big East', 'Division I');
GO

-- ============================================================
-- ARCHETYPES
-- ============================================================
INSERT INTO ARCHETYPE (arch_name, description) VALUES
('3-and-D Wing', 'Perimeter player who spaces the floor and guards multiple positions'),
('Playmaking Guard', 'Ball handler who creates for others and scores off the dribble'),
('Rim Protector', 'Interior defender who alters and blocks shots near the basket'),
('Scoring Guard', 'Shoot-first guard who can create their own shot'),
('Stretch Big', 'Big man who can step out and shoot the three');
GO

-- ============================================================
-- USERS (passwords are bcrypt hashed placeholder for "password123")
-- ============================================================
INSERT INTO [USER] (u_fname, u_lname, email, password_hash, role) VALUES
('James',   'Hawkins',  'admin@nbascout.com',   '$2b$12$placeholder_admin_hash',   'ADMIN'),
('Marcus',  'Cole',     'scout1@nbascout.com',  '$2b$12$placeholder_scout1_hash',  'SCOUT'),
('Denise',  'Park',     'scout2@nbascout.com',  '$2b$12$placeholder_scout2_hash',  'SCOUT'),
('Sarah',   'Mitchell', 'gm1@nbascout.com',     '$2b$12$placeholder_gm1_hash',     'GM'),
('Kevin',   'Okafor',   'gm2@nbascout.com',     '$2b$12$placeholder_gm2_hash',     'GM'),
('Priya',   'Nair',     'analyst@nbascout.com', '$2b$12$placeholder_analyst_hash', 'ANALYST'),
('Alex',    'Rivera',   'fan@nbascout.com',     '$2b$12$placeholder_fan_hash',     'FAN');
GO

-- ============================================================
-- PROSPECTS
-- ============================================================
INSERT INTO PROSPECT (p_fname, p_lname, date_of_birth, hometown, height, weight, position, draft_year, eligibility_status, college_id) VALUES
('Darryn',  'Peterson',  '2006-03-14', 'Memphis, TN',      '6-5',  195, 'SG',  2025, 'Freshman',   2),
('Liam',    'McNeely',   '2006-01-22', 'Dallas, TX',       '6-7',  200, 'SF',  2025, 'Freshman',   1),
('Tre',     'Johnson',   '2005-11-09', 'Dallas, TX',       '6-5',  185, 'SG',  2025, 'Freshman',   4),
('Kasparas','Jakucionis', '2005-05-30', 'Jonava, Lithuania','6-5',  185, 'PG',  2025, 'Freshman',   6),
('Kon',     'Knueppel',  '2005-09-17', 'Green Bay, WI',    '6-7',  210, 'SF',  2025, 'Freshman',   1),
('Khaman',  'Maluach',   '2006-02-12', 'South Sudan',      '7-2',  245, 'C',   2025, 'Freshman',   1),
('Egor',    'Demin',     '2006-04-09', 'Novosibirsk, Russia','6-9',210, 'PG',  2025, 'Freshman',   3),
('Nique',   'Clifford',  '2002-08-11', 'Denver, CO',       '6-7',  210, 'SF',  2025, 'Senior',     5),
('Boogie',  'Fland',     '2005-12-05', 'Spring Valley, NY','6-2',  175, 'PG',  2025, 'Freshman',   3),
('Dylan',   'Harper',    '2006-01-04', 'Totowa, NJ',       '6-6',  195, 'SG',  2025, 'Freshman',   6);
GO

-- ============================================================
-- PROSPECT_ARCHETYPE
-- ============================================================
INSERT INTO PROSPECT_ARCHETYPE (prospect_id, archetype_id) VALUES
(1, 2),  -- Peterson: Playmaking Guard
(1, 4),  -- Peterson: Scoring Guard
(2, 1),  -- McNeely: 3-and-D Wing
(3, 4),  -- Johnson: Scoring Guard
(4, 2),  -- Jakucionis: Playmaking Guard
(5, 1),  -- Knueppel: 3-and-D Wing
(6, 3),  -- Maluach: Rim Protector
(7, 2),  -- Demin: Playmaking Guard
(8, 1),  -- Clifford: 3-and-D Wing
(9, 2),  -- Fland: Playmaking Guard
(10, 4); -- Harper: Scoring Guard
GO

-- ============================================================
-- COLLEGE_STATS (2024-25 season)
-- ============================================================
INSERT INTO COLLEGE_STATS (stat_id, prospect_id, season_year, games_played, MPG, PPG, RPG, APG, TPG, three_pt_pct, fg_pct, ft_pct, stl, blk, o_rating, d_rating) VALUES
(1,  1,  2025, 18, 33.1, 19.9, 4.4, 4.5, 2.8, 0.362, 0.441, 0.756, 1.4, 0.3, 118.2, 108.4),
(2,  2,  2025, 20, 32.5, 17.2, 5.1, 2.3, 1.9, 0.391, 0.462, 0.812, 1.2, 0.6, 121.3, 105.7),
(3,  3,  2025, 19, 34.2, 22.3, 3.8, 2.1, 2.4, 0.348, 0.455, 0.798, 1.1, 0.2, 119.8, 109.1),
(4,  4,  2025, 22, 31.8, 15.6, 3.9, 6.2, 2.2, 0.378, 0.448, 0.821, 1.6, 0.3, 122.1, 106.3),
(5,  5,  2025, 21, 30.4, 14.8, 5.3, 2.8, 1.5, 0.412, 0.478, 0.867, 1.0, 0.5, 123.4, 104.8),
(6,  6,  2025, 20, 28.9, 12.1, 8.9, 1.2, 1.8, 0.289, 0.612, 0.654, 0.8, 3.2, 115.6, 98.3),
(7,  7,  2025, 17, 29.3, 13.4, 5.2, 5.8, 2.6, 0.334, 0.421, 0.778, 1.3, 0.4, 116.9, 107.2),
(8,  8,  2025, 25, 32.7, 16.8, 6.4, 3.1, 1.7, 0.401, 0.489, 0.834, 1.5, 0.8, 124.2, 103.6),
(9,  9,  2025, 21, 30.1, 17.3, 3.2, 4.8, 2.9, 0.356, 0.438, 0.792, 1.8, 0.2, 117.4, 108.9),
(10, 10, 2025, 22, 33.8, 21.1, 4.6, 4.2, 2.3, 0.371, 0.467, 0.814, 1.3, 0.4, 120.5, 106.8);
GO

-- ============================================================
-- BEHAVIORAL_ASSESSMENTS
-- ============================================================
INSERT INTO BEHAVIORAL_ASSESSMENT (assessment_id, prospect_id, flag_type, flag_label, description) VALUES
(1,  1,  'positive', 'Floor General',    'Commands offense, makes smart decisions under pressure'),
(2,  1,  'negative', 'Ball Stopper',     'Occasionally holds the ball too long in isolation'),
(3,  2,  'positive', 'High Motor',       'Relentless effort on both ends, never takes plays off'),
(4,  2,  'positive', 'Coachable',        'Responds well to coaching adjustments mid-game'),
(5,  3,  'positive', 'Shot Creator',     'Elite ability to generate own shot off the dribble'),
(6,  3,  'negative', 'Streaky Shooter',  'Inconsistent from three, goes cold for stretches'),
(7,  4,  'positive', 'Floor General',    'Controls tempo and makes everyone around him better'),
(8,  5,  'positive', 'High Motor',       'Plays hard every possession, great off-ball movement'),
(9,  6,  'positive', 'Versatile Defender','Can guard multiple positions, excellent shot blocker'),
(10, 6,  'neutral',  'Project Player',   'Raw offensively, needs development time at NBA level'),
(11, 8,  'positive', 'Clutch',           'Consistently performs in high-pressure situations'),
(12, 10, 'positive', 'Shot Creator',     'Has the handle and athleticism to get his shot anywhere');
GO

-- ============================================================
-- SCOUTING_REPORTS
-- ============================================================
INSERT INTO SCOUTING_REPORT (report_id, prospect_id, scout_id, submission_date, game_date, game_opponent, notes, scout_orating, scout_drating, scout_intangibles, overall_rating) VALUES
(1, 1, 2, '2025-01-15', '2025-01-12', 'Texas Tech',    'Peterson showed elite playmaking tonight. Vision is NBA-ready. Needs to tighten handle under pressure.', 8, 7, 8, 8),
(2, 1, 3, '2025-01-28', '2025-01-25', 'Baylor',        'Impressive scoring performance. Shot creation off dribble is special. Defensive effort inconsistent.', 9, 6, 7, 8),
(3, 2, 2, '2025-01-20', '2025-01-18', 'NC State',      'McNeely shot the ball beautifully. Off-ball movement is elite. Locked up his man all night.', 8, 8, 9, 9),
(4, 3, 3, '2025-02-01', '2025-01-30', 'Auburn',        'Johnson is a bucket. Pure scorer mentality. Defense needs significant work at next level.', 9, 5, 7, 7),
(5, 6, 2, '2025-01-22', '2025-01-19', 'Louisville',    'Maluach was dominant around the rim. 4 blocks, controlled the paint. Offensively very limited.', 5, 10, 7, 8),
(6, 10, 3, '2025-02-05', '2025-02-03', 'Seton Hall',   'Harper looks like a lottery pick. Smooth scorer with size. Handles and vision better than expected.', 9, 7, 8, 9);
GO

-- ============================================================
-- NBA_PLAYER_RECORDS (historical comparison data)
-- ============================================================
INSERT INTO NBA_PLAYER_RECORD (career_id, prospect_id, draft_pick_no, nba_team, role_level, seasons_played, career_orating, career_drating) VALUES
(1, 1,  4,  'Oklahoma City Thunder', 'starter',      3,  112.3, 108.1),
(2, 2,  8,  'Boston Celtics',        'All-Star',     5,  118.7, 104.2),
(3, 3,  12, 'Houston Rockets',       'role player',  2,  108.4, 110.3),
(4, 6,  3,  'San Antonio Spurs',     'starter',      4,  109.8, 101.6),
(5, 10, 1,  'Philadelphia 76ers',    'All-Star',     4,  119.2, 105.8);
GO

-- ============================================================
-- SHORTLIST_ENTRIES (GM shortlists)
-- ============================================================
INSERT INTO SHORTLIST_ENTRY (entry_id, gm_id, prospect_id, date_added, internal_notes) VALUES
(1, 4, 2,  '2025-02-01', 'Top target if available at our pick. Monitor pre-draft workouts.'),
(2, 4, 5,  '2025-02-03', 'Best shooter in class. Fits our offensive system perfectly.'),
(3, 4, 10, '2025-02-10', 'Lottery talent. Would need to trade up to get him.'),
(4, 5, 1,  '2025-01-28', 'High upside playmaker. Character concerns worth monitoring.'),
(5, 5, 6,  '2025-02-05', 'Best defensive prospect in class. Rim protection is a need for us.');
GO

-- sample data manually compiled from tankathon.com, cbssports.com, espn.com and nbadraft.com
USE nba_scouting;
GO

-- clear existing data
DELETE FROM SHORTLIST_ENTRY;
DELETE FROM NBA_PLAYER_RECORD;
DELETE FROM BEHAVIORAL_ASSESSMENT;
DELETE FROM SCOUTING_REPORT;
DELETE FROM COLLEGE_STATS;
DELETE FROM PROSPECT_ARCHETYPE;
DELETE FROM PROSPECT;
DELETE FROM [USER];
DELETE FROM COLLEGE;
DELETE FROM ARCHETYPE;
GO

-- reset identity counters
DBCC CHECKIDENT ('COLLEGE', RESEED, 0);
DBCC CHECKIDENT ('ARCHETYPE', RESEED, 0);
DBCC CHECKIDENT ('[USER]', RESEED, 0);
DBCC CHECKIDENT ('PROSPECT', RESEED, 0);
GO

-- colleges (no duplicates - shared by multiple prospects where applicable)
INSERT INTO COLLEGE (c_name, conference, division) VALUES
('BYU',                          'Big 12',   'Division I'),   -- 1  Dybantsa
('University of Kansas',          'Big 12',   'Division I'),   -- 2  Peterson
('Duke University',               'ACC',      'Division I'),   -- 3  Boozer
('University of North Carolina',  'ACC',      'Division I'),   -- 4  Wilson
('University of Arkansas',        'SEC',      'Division I'),   -- 5  Acuff, Thomas
('University of Houston',         'Big 12',   'Division I'),   -- 6  Flemings, Cenac
('University of Illinois',        'Big Ten',  'Division I'),   -- 7  Wagler
('University of Louisville',      'ACC',      'Division I'),   -- 8  Brown
('University of Tennessee',       'SEC',      'Division I'),   -- 9  Ament
('University of Arizona',         'Big 12',   'Division I'),   -- 10 Burries, Peat
('University of Kentucky',        'SEC',      'Division I'),   -- 11 Quaintance
('University of Florida',         'SEC',      'Division I'),   -- 12 Haugh
('University of Alabama',         'SEC',      'Division I'),   -- 13 Philon
('University of Michigan',        'Big Ten',  'Division I'),   -- 14 Lendeborg, Johnson
('University of Iowa',            'Big Ten',  'Division I'),   -- 15 Stirtz
('Texas Tech University',         'Big 12',   'Division I'),   -- 16 Anderson
('University of Washington',      'Big Ten',  'Division I'),   -- 17 Steinbach
('Baylor University',             'Big 12',   'Division I'),   -- 18 Carr
('UConn',                         'Big East', 'Division I'),   -- 19 Mullins
('Santa Clara University',        'WCC',      'Division I'),   -- 20 Graves
('University of Texas',           'SEC',      'Division I');   -- 21 Swain
GO

-- archetypes
INSERT INTO ARCHETYPE (arch_name, description) VALUES
('3-and-D Wing',        'Perimeter player who spaces the floor and guards multiple positions'),
('Playmaking Guard',    'Ball handler who creates for others and scores off the dribble'),
('Rim Protector',       'Interior defender who alters and blocks shots near the basket'),
('Scoring Wing',        'Wing scorer who can create own shot and score in volume'),
('Stretch Big',         'Big man who can step out and shoot the three'),
('Two-Way Wing',        'Versatile wing with impact on both ends of the floor'),
('Pass-First Guard',    'Floor general who prioritizes playmaking over scoring'),
('Interior Scorer',     'Big man who dominates close to the basket');
GO

-- users
INSERT INTO [USER] (u_fname, u_lname, email, password_hash, role) VALUES
('James',    'Garden',    'admin@nbascout.com',    '$2b$12$ADMIN_PLACEHOLDER_HASH',    'ADMIN'),
('Ricardo',  'Jefferson', 'scout1@nbascout.com',   '$2b$12$SCOUT1_PLACEHOLDER_HASH',   'SCOUT'),
('Morris',   'Burke',     'scout2@nbascout.com',   '$2b$12$SCOUT2_PLACEHOLDER_HASH',   'SCOUT'),
('Kevin',    'McFarlan',  'scout3@nbascout.com',   '$2b$12$SCOUT3_PLACEHOLDER_HASH',   'SCOUT'),
('Bike',     'Bumleavy',  'gm1@nbascout.com',      '$2b$12$GM1_PLACEHOLDER_HASH',      'GM'),
('Bob',      'Okafor',    'gm2@nbascout.com',      '$2b$12$GM2_PLACEHOLDER_HASH',      'GM'),
('Kendrick', 'Lerkins',   'analyst@nbascout.com',  '$2b$12$ANALYST_PLACEHOLDER_HASH',  'ANALYST'),
('Glen',     'Rivers',    'fan1@nbascout.com',     '$2b$12$FAN1_PLACEHOLDER_HASH',     'FAN'),
('Jordan',   'Pond',      'fan2@nbascout.com',     '$2b$12$FAN2_PLACEHOLDER_HASH',     'FAN');
GO

-- prospects (top 25 per NBADraft.net 2026 mock)
INSERT INTO PROSPECT (p_fname, p_lname, date_of_birth, hometown, height, weight, position, draft_year, eligibility_status, college_id) VALUES
('AJ',        'Dybantsa',    '2007-01-29', 'Brockton, MA',       '6-9',  212, 'SF',  2026, 'Freshman',  1),   -- BYU
('Darryn',    'Peterson',    '2006-03-14', 'Memphis, TN',        '6-6',  205, 'PG',  2026, 'Freshman',  2),   -- Kansas
('Cameron',   'Boozer',      '2006-11-23', 'Miami, FL',          '6-9',  250, 'PF',  2026, 'Freshman',  3),   -- Duke
('Caleb',     'Wilson',      '2005-11-04', 'Atlanta, GA',        '6-10', 215, 'PF',  2026, 'Freshman',  4),   -- UNC
('Darius',    'Acuff',       '2006-02-08', 'Little Rock, AR',    '6-3',  190, 'PG',  2026, 'Freshman',  5),   -- Arkansas
('Kingston',  'Flemings',    '2006-07-19', 'San Antonio, TX',    '6-4',  190, 'PG',  2026, 'Freshman',  6),   -- Houston
('Keaton',    'Wagler',      '2006-08-12', 'Goshen, IN',         '6-6',  185, 'PG',  2026, 'Freshman',  7),   -- Illinois
('Mikel',     'Brown',       '2005-04-10', 'Louisville, KY',     '6-5',  190, 'PG',  2026, 'Freshman',  8),   -- Louisville
('Nate',      'Ament',       '2006-06-28', 'Portland, OR',       '6-10', 207, 'PF',  2026, 'Freshman',  9),   -- Tennessee
('Brayden',   'Burries',     '2005-01-15', 'Scottsdale, AZ',     '6-4',  205, 'SG',  2026, 'Freshman',  10),  -- Arizona
('Jayden',    'Quaintance',  '2005-09-12', 'Phoenix, AZ',        '6-10', 255, 'C',   2026, 'Sophomore', 11),  -- Kentucky
('Thomas',    'Haugh',       '2003-07-07', 'New Oxford, PA',     '6-9',  215, 'SF',  2026, 'Junior',    12),  -- Florida
('Labaron',   'Philon',      '2005-08-22', 'Mobile, AL',         '6-3',  185, 'PG',  2026, 'Sophomore', 13),  -- Alabama
('Koa',       'Peat',        '2006-09-15', 'Gilbert, AZ',        '6-8',  235, 'PF',  2026, 'Freshman',  10),  -- Arizona
('Yaxel',     'Lendeborg',   '2002-09-30', 'New Jersey',         '6-9',  235, 'PF',  2026, 'Senior',    14),  -- Michigan
('Bennett',   'Stirtz',      '2002-03-15', 'Ankeny, IA',         '6-4',  190, 'PG',  2026, 'Senior',    15),  -- Iowa
('Meleek',    'Thomas',      '2006-08-06', 'Pittsburgh, PA',     '6-5',  185, 'SG',  2026, 'Freshman',  5),   -- Arkansas
('Christian', 'Anderson',    '2004-05-22', 'Lubbock, TX',        '6-3',  178, 'PG',  2026, 'Sophomore', 16),  -- Texas Tech
('Hannes',    'Steinbach',   '2006-05-01', 'Wurzburg, Germany',  '6-11', 229, 'PF',  2026, 'Freshman',  17),  -- Washington
('Chris',     'Cenac',       '2006-11-10', 'Beaumont, TX',       '6-11', 240, 'C',   2026, 'Freshman',  6),   -- Houston
('Cameron',   'Carr',        '2004-11-24', 'Eden Prairie, MN',   '6-5',  190, 'SG',  2026, 'Junior',    18),  -- Baylor
('Braylon',   'Mullins',     '2006-04-18', 'Greenfield, IN',     '6-5',  180, 'SG',  2026, 'Freshman',  19),  -- UConn
('Allen',     'Graves',      '2006-07-28', 'Ponchatoula, LA',    '6-9',  225, 'PF',  2026, 'Freshman',  20),  -- Santa Clara
('Morez',     'Johnson',     '2006-01-25', 'Riverdale, IL',      '6-9',  250, 'PF',  2026, 'Sophomore', 14),  -- Michigan
('Dailyn',    'Swain',       '2005-07-15', 'Columbus, OH',       '6-7',  220, 'SF',  2026, 'Junior',    21);  -- Texas
GO

-- prospect_archetype
INSERT INTO PROSPECT_ARCHETYPE (prospect_id, archetype_id) VALUES
(1,  6),  -- Dybantsa: Two-Way Wing
(1,  4),  -- Dybantsa: Scoring Wing
(2,  2),  -- Peterson: Playmaking Guard
(2,  4),  -- Peterson: Scoring Wing
(3,  5),  -- Boozer: Stretch Big
(3,  6),  -- Boozer: Two-Way Wing
(4,  6),  -- Wilson: Two-Way Wing
(4,  5),  -- Wilson: Stretch Big
(5,  2),  -- Acuff: Playmaking Guard
(5,  7),  -- Acuff: Pass-First Guard
(6,  2),  -- Flemings: Playmaking Guard
(7,  7),  -- Wagler: Pass-First Guard
(7,  2),  -- Wagler: Playmaking Guard
(8,  2),  -- Brown: Playmaking Guard
(9,  6),  -- Ament: Two-Way Wing
(9,  5),  -- Ament: Stretch Big
(10, 1),  -- Burries: 3-and-D Wing
(10, 2),  -- Burries: Playmaking Guard
(11, 3),  -- Quaintance: Rim Protector
(12, 6),  -- Haugh: Two-Way Wing
(12, 1),  -- Haugh: 3-and-D Wing
(13, 2),  -- Philon: Playmaking Guard
(14, 8),  -- Peat: Interior Scorer
(15, 5),  -- Lendeborg: Stretch Big
(15, 6),  -- Lendeborg: Two-Way Wing
(16, 7),  -- Stirtz: Pass-First Guard
(17, 1),  -- Thomas: 3-and-D Wing
(17, 4),  -- Thomas: Scoring Wing
(18, 7),  -- Anderson: Pass-First Guard
(19, 5),  -- Steinbach: Stretch Big
(19, 8),  -- Steinbach: Interior Scorer
(20, 3),  -- Cenac: Rim Protector
(21, 4),  -- Carr: Scoring Wing
(22, 1),  -- Mullins: 3-and-D Wing
(23, 6),  -- Graves: Two-Way Wing
(23, 5),  -- Graves: Stretch Big
(24, 8),  -- Johnson: Interior Scorer
(24, 3),  -- Johnson: Rim Protector
(25, 6),  -- Swain: Two-Way Wing
(25, 4);  -- Swain: Scoring Wing
GO

-- college_stats (2025-26 season)
INSERT INTO COLLEGE_STATS (stat_id, prospect_id, season_year, games_played, MPG, PPG, RPG, APG, TPG, three_pt_pct, fg_pct, ft_pct, stl, blk, o_rating, d_rating) VALUES
(1,  1,  2026, 35, 34.8, 25.5, 6.8, 3.7, 3.1, 0.331, 0.510, 0.774, 1.1, 0.3, 122.1, 108.8),  -- Dybantsa
(2,  2,  2026, 24, 29.0, 20.2, 4.2, 1.6, 2.3, 0.348, 0.438, 0.812, 1.0, 0.4, 119.6, 105.8),  -- Peterson
(3,  3,  2026, 38, 33.5, 22.5,10.2, 4.1, 2.4, 0.391, 0.556, 0.831, 1.7, 0.8, 124.8, 100.7),  -- Boozer
(4,  4,  2026, 24, 31.2, 19.8, 9.4, 2.7, 2.1, 0.259, 0.578, 0.774, 1.4, 1.5, 118.3, 103.2),  -- Wilson
(5,  5,  2026, 36, 35.2, 23.5, 3.1, 6.4, 2.2, 0.440, 0.484, 0.801, 1.6, 0.2, 122.7, 106.3),  -- Acuff
(6,  6,  2026, 37, 31.7, 16.1, 4.1, 5.2, 2.1, 0.387, 0.476, 0.845, 1.5, 0.4, 118.9, 103.8),  -- Flemings
(7,  7,  2026, 37, 33.9, 17.9, 5.1, 4.2, 1.8, 0.397, 0.445, 0.821, 1.2, 0.3, 120.4, 104.6),  -- Wagler
(8,  8,  2026, 21, 29.0, 18.2, 3.3, 4.7, 2.6, 0.340, 0.410, 0.814, 1.3, 0.3, 117.4, 107.2),  -- Brown
(9,  9,  2026, 35, 29.7, 16.7, 6.3, 2.3, 1.9, 0.312, 0.399, 0.758, 1.0, 0.8, 116.2, 104.1),  -- Ament
(10, 10, 2026, 39, 29.9, 16.1, 4.9, 2.4, 1.7, 0.391, 0.491, 0.805, 1.5, 0.5, 116.8, 104.9),  -- Burries
(11, 11, 2026, 17, 17.0,  5.0, 5.0, 0.5, 0.8, 0.000, 0.571, 0.480, 0.8, 1.2, 108.4, 101.2),  -- Quaintance
(12, 12, 2026, 35, 33.3, 17.1, 6.1, 2.1, 1.5, 0.342, 0.461, 0.774, 1.1, 1.0, 118.6, 103.4),  -- Haugh
(13, 13, 2026, 35, 30.9, 22.0, 3.5, 5.0, 2.2, 0.399, 0.501, 0.798, 1.4, 0.3, 121.3, 105.7),  -- Philon
(14, 14, 2026, 35, 27.8, 14.1, 5.6, 2.6, 1.5, 0.316, 0.528, 0.616, 0.8, 0.7, 114.8, 102.3),  -- Peat
(15, 15, 2026, 35, 30.2, 15.1, 6.8, 3.2, 1.1, 0.374, 0.515, 0.828, 1.2, 1.2, 119.4, 103.8),  -- Lendeborg
(16, 16, 2026, 35, 37.8, 19.8, 2.6, 4.4, 1.8, 0.421, 0.477, 0.881, 1.4, 0.2, 118.7, 104.2),  -- Stirtz
(17, 17, 2026, 37, 30.5, 15.6, 3.8, 2.5, 1.0, 0.416, 0.435, 0.843, 1.5, 0.2, 116.3, 105.1),  -- Thomas
(18, 18, 2026, 35, 38.4, 18.5, 3.6, 7.4, 2.1, 0.398, 0.472, 0.856, 1.3, 0.3, 119.2, 104.8),  -- Anderson
(19, 19, 2026, 30, 34.6, 18.5,11.8, 1.6, 2.0, 0.340, 0.577, 0.759, 1.1, 1.2, 117.8, 102.6),  -- Steinbach
(20, 20, 2026, 24, 24.8,  9.5, 7.9, 0.7, 1.3, 0.182, 0.485, 0.571, 0.6, 1.4, 109.6, 100.4),  -- Cenac
(21, 21, 2026, 34, 30.0, 18.9, 5.8, 2.6, 1.4, 0.374, 0.494, 0.801, 1.2, 1.3, 117.4, 103.6),  -- Carr
(22, 22, 2026, 32, 28.0, 12.0, 3.4, 1.4, 1.2, 0.337, 0.430, 0.889, 1.0, 0.6, 114.2, 106.1),  -- Mullins
(23, 23, 2026, 30, 22.4, 11.6, 6.5, 1.8, 0.7, 0.416, 0.517, 0.736, 2.0, 0.9, 116.8, 103.2),  -- Graves
(24, 24, 2026, 38, 25.1, 13.2, 7.3, 1.2, 1.3, 0.364, 0.625, 0.773, 0.7, 1.1, 115.4, 101.8),  -- Johnson
(25, 25, 2026, 35, 31.0, 17.4, 7.5, 3.5, 2.6, 0.352, 0.545, 0.821, 1.7, 0.5, 116.9, 104.3);  -- Swain
GO

-- behavioral assessments (standardized descriptions per label)
INSERT INTO BEHAVIORAL_ASSESSMENT (assessment_id, prospect_id, flag_type, flag_label, description) VALUES
(1,  1,  'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(2,  1,  'positive', 'Coachable',          'Responds well to coaching and shows good adjustment'),
(3,  1,  'negative', 'Streaky Shooter',    'Shooting percentage can be inconsistent from game to game'),
(4,  2,  'positive', 'Shot Creator',       'Creates own shot off the dribble at all three levels'),
(5,  2,  'negative', 'Injury Prone',       'Has missed significant time due to recurring injuries'),
(6,  2,  'negative', 'Ball Stopper',       'Tends to hold the ball and slow offensive movement'),
(7,  3,  'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(8,  3,  'positive', 'Clutch',             'Performs well in high pressure and late game situations'),
(9,  3,  'positive', 'Coachable',          'Responds well to coaching and shows good adjustment'),
(10, 4,  'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(11, 4,  'negative', 'Streaky Shooter',    'Shooting percentage can be inconsistent from game to game'),
(12, 4,  'negative', 'Injury Prone',       'Has missed significant time due to recurring injuries'),
(13, 5,  'positive', 'Clutch',             'Performs well in high pressure and late game situations'),
(14, 5,  'positive', 'Floor General',      'Controls the offense and elevates teammates around him'),
(15, 5,  'negative', 'Poor Defender',      'Defensive effort and focus is inconsistent'),
(16, 6,  'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(17, 6,  'positive', 'Shot Creator',       'Creates own shot off the dribble at all three levels'),
(18, 6,  'negative', 'Streaky Shooter',    'Shooting percentage can be inconsistent from game to game'),
(19, 7,  'positive', 'Floor General',      'Controls the offense and elevates teammates around him'),
(20, 7,  'positive', 'Coachable',          'Responds well to coaching and shows good adjustment'),
(21, 7,  'negative', 'Poor Athlete',       'Lacks ideal quickness and athleticism for the position'),
(22, 8,  'positive', 'Shot Creator',       'Creates own shot off the dribble at all three levels'),
(23, 8,  'negative', 'Injury Prone',       'Has missed significant time due to recurring injuries'),
(24, 8,  'negative', 'Ball Stopper',       'Tends to hold the ball and slow offensive movement'),
(25, 9,  'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(26, 9,  'negative', 'Injury Prone',       'Has missed significant time due to recurring injuries'),
(27, 9,  'neutral',  'Project Player',     'Raw talent that needs development time at the next level'),
(28, 10, 'positive', 'Versatile Defender', 'Can guard multiple positions and disrupt passing lanes'),
(29, 10, 'positive', 'Clutch',             'Performs well in high pressure and late game situations'),
(30, 10, 'negative', 'Ball Stopper',       'Tends to hold the ball and slow offensive movement'),
(31, 11, 'positive', 'Rim Protector',      'Protects the paint and alters shots near the basket'),
(32, 11, 'negative', 'Injury Prone',       'Has missed significant time due to recurring injuries'),
(33, 11, 'negative', 'Poor FT Shooter',    'Below average free throw shooter limiting late game use'),
(34, 12, 'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(35, 12, 'positive', 'Coachable',          'Responds well to coaching and shows good adjustment'),
(36, 12, 'neutral',  'System Player',      'Production may be tied to a specific system or role'),
(37, 13, 'positive', 'Shot Creator',       'Creates own shot off the dribble at all three levels'),
(38, 13, 'positive', 'Floor General',      'Controls the offense and elevates teammates around him'),
(39, 13, 'negative', 'Streaky Shooter',    'Shooting percentage can be inconsistent from game to game'),
(40, 14, 'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(41, 14, 'positive', 'Coachable',          'Responds well to coaching and shows good adjustment'),
(42, 14, 'negative', 'Poor FT Shooter',    'Below average free throw shooter limiting late game use'),
(43, 15, 'positive', 'Versatile Defender', 'Can guard multiple positions and disrupt passing lanes'),
(44, 15, 'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(45, 15, 'neutral',  'Late Bloomer',       'Came to the game late and still developing his ceiling'),
(46, 16, 'positive', 'Floor General',      'Controls the offense and elevates teammates around him'),
(47, 16, 'positive', 'Coachable',          'Responds well to coaching and shows good adjustment'),
(48, 16, 'negative', 'Poor Athlete',       'Lacks ideal quickness and athleticism for the position'),
(49, 17, 'positive', 'Shot Creator',       'Creates own shot off the dribble at all three levels'),
(50, 17, 'positive', 'Versatile Defender', 'Can guard multiple positions and disrupt passing lanes'),
(51, 17, 'negative', 'Streaky Shooter',    'Shooting percentage can be inconsistent from game to game'),
(52, 18, 'positive', 'Floor General',      'Controls the offense and elevates teammates around him'),
(53, 18, 'positive', 'Coachable',          'Responds well to coaching and shows good adjustment'),
(54, 18, 'negative', 'Poor Athlete',       'Lacks ideal quickness and athleticism for the position'),
(55, 19, 'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(56, 19, 'positive', 'Rim Protector',      'Protects the paint and alters shots near the basket'),
(57, 19, 'neutral',  'Project Player',     'Raw talent that needs development time at the next level'),
(58, 20, 'positive', 'Rim Protector',      'Protects the paint and alters shots near the basket'),
(59, 20, 'neutral',  'Project Player',     'Raw talent that needs development time at the next level'),
(60, 20, 'negative', 'Poor FT Shooter',    'Below average free throw shooter limiting late game use'),
(61, 21, 'positive', 'Shot Creator',       'Creates own shot off the dribble at all three levels'),
(62, 21, 'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(63, 21, 'negative', 'Poor Defender',      'Defensive effort and focus is inconsistent'),
(64, 22, 'positive', 'Clutch',             'Performs well in high pressure and late game situations'),
(65, 22, 'negative', 'Streaky Shooter',    'Shooting percentage can be inconsistent from game to game'),
(66, 22, 'negative', 'Poor Athlete',       'Lacks ideal quickness and athleticism for the position'),
(67, 23, 'positive', 'Floor General',      'Controls the offense and elevates teammates around him'),
(68, 23, 'positive', 'Coachable',          'Responds well to coaching and shows good adjustment'),
(69, 23, 'neutral',  'System Player',      'Production may be tied to a specific system or role'),
(70, 24, 'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(71, 24, 'positive', 'Rim Protector',      'Protects the paint and alters shots near the basket'),
(72, 24, 'negative', 'Poor Athlete',       'Lacks ideal quickness and athleticism for the position'),
(73, 25, 'positive', 'High Motor',         'Plays hard on both ends of the floor every possession'),
(74, 25, 'positive', 'Versatile Defender', 'Can guard multiple positions and disrupt passing lanes'),
(75, 25, 'negative', 'Ball Stopper',       'Tends to hold the ball and slow offensive movement');
GO

-- scouting_reports
-- scout_id 2 = Ricardo Jefferson
-- scout_id 3 = Morris Burke
-- scout_id 4 = Kevin McFarlan
INSERT INTO SCOUTING_REPORT (report_id, prospect_id, scout_id, submission_date, game_date, game_opponent, notes, scout_orating, scout_drating, scout_intangibles, overall_rating) VALUES
(1,  1,  2, '2026-02-10', '2026-02-08', 'Utah',           'Dybantsa dominated on both ends. Elite sing scoring and defense. Clear number one pick.', 10, 9, 10, 10),
(2,  1,  3, '2026-03-01', '2026-02-28', 'TCU',            'Another dominant showing. Size, skill and makeup are  elite. Ball handling and consistency can improve.', 9,  9, 10,  9),
(3,  2,  2, '2026-01-20', '2026-01-18', 'Baylor',         'Best shotmaker in the class. Special talent when fully healthy, but availability could be a concern', 9,  7,  7,  8),
(4,  3,  3, '2026-02-15', '2026-02-13', 'NC State',       'Boozer was dominant in every phase. Impeccable offensive feel and winning plays all night. Legitimate Player of the Year.', 8,  8, 10,  9),
(5,  4,  4, '2026-01-25', '2026-01-23', 'Wake Forest',    'Wilson showed elite tools and motor. Physical player, but needs improvement on threes.', 7,  8,  8,  8),
(6,  5,  2, '2026-03-10', '2026-03-08', 'Kentucky',       'Acuff was sensational. Most NBA-ready PG in the class with low turnovers at high usage. Defense might be a concern.', 9,  6,  9,  9),
(7,  6,  4, '2026-02-12', '2026-02-10', 'Texas Tech',     'Flemings speed and finishing are elite. Jumper is inconsistent but improving. High ceiling player.', 7,  7,  8,  8),
(8,  7,  3, '2026-02-20', '2026-02-18', 'Michigan',       'Wagler displayed high IQ and with his size, NBA upside as a lead guard is high.', 8,  7,  9,  8),
(9,  8,  2, '2026-01-30', '2026-01-28', 'Virginia',       'Brown showed excellent feel and vision. Back injury history is worth monitoring.', 7,  7,  7,  7),
(10, 9,  3, '2026-01-15', '2026-01-13', 'Vanderbilt',     'Ament flashed real skill and fluidity. Size and touch fit a valuable archetype.', 7,  7,  7,  7),
(11, 10, 4, '2026-02-25', '2026-02-23', 'UCLA',           'Burries was solid all night. Not elite in one area but added value everywhere. Strong and creative player.', 7,  7,  8,  7),
(12, 12, 2, '2026-02-08', '2026-02-06', 'LSU',            'Haugh is a versatile contributor on both ends. Older but knows exactly what he is and makes good decisions.', 7,  7,  8,  7),
(13, 13, 3, '2026-02-18', '2026-02-16', 'Mississippi St', 'Philon was in control all night. Impressive shooting leap showing coachability.', 8,  7,  8,  8),
(14, 15, 4, '2026-02-22', '2026-02-20', 'Ohio State',     'Lendeborg does everything. Versatility, length, and feel are all NBA ready. Older prospect with IQ and translatable skillset.', 8,  8,  8,  8),
(15, 16, 2, '2026-02-14', '2026-02-12', 'Penn State',     'Stirtz is one of the smartest players in the class with good feel and shot-making. Howevery physicallity is average.', 8,  6,  9,  8),
(16, 19, 3, '2026-02-05', '2026-02-03', 'Oregon',         'Steinbach was a dominant rebounder with improving touch around the rim. Perimeter game needs development.', 7,  7,  8,  7),
(17, 21, 4, '2026-03-05', '2026-03-03', 'Kansas State',   'Carr was an explosive finisher who makes big plays. Defensive consistency and decision making need work.', 8,  6,  7,  7),
(18, 25, 2, '2026-02-28', '2026-02-26', 'Oklahoma',       'Swain impressed with his athleticism and versatility. Good vision for a wing. Handling needs polish, but upside is there.', 7,  7,  7,  7);
GO

-- nba_player_records with projected comps and projected team draft based on one sim lottery on tankathon.com)
INSERT INTO NBA_PLAYER_RECORD (career_id, prospect_id, comp_player_name, draft_pick_no, nba_team, role_level, seasons_played, career_orating, career_drating) VALUES
(1,  1,  'Paul George',         1,  'Sacramento Kings',       'superstar',   4, 125.1,  99.2),
(2,  2,  'Tyrese Maxey',        2,  'Utah Jazz',              'All-Star',    4, 120.4, 104.3),
(3,  3,  'Kevin Love',          3,  'Brookklyn Nets',         'All-Star',    5, 121.8, 103.6),
(4,  4,  'Pascal Siakam',       4,  'Washington Wizards',     'All-Star',    4, 119.6, 102.8),
(5,  5,  'Deron Williams',      5,  'Indiana Pacers',         'All-Star',    4, 118.9, 105.4),
(6,  6,  'John Wall',           6,  'Memphis Grizzlies',      'starter',     3, 113.8, 104.2),
(7,  7,  'Austin Reaves',       7,  'Atlanta Hawks',          'starter',     4, 116.3, 105.1),
(8,  8,  'Darius Garland',      8,  'Dallas Mavericks',       'starter',     3, 114.7, 106.2),
(9,  9,  'Zaccharie Risacher',  9,  'Chicago Bulls',          'role player', 3, 109.4, 105.7),
(10, 10, 'Derrick White',       10, 'Milwaukee Bucks',        'starter',     3, 112.6, 103.8),
(11, 11, 'Jalen Duren',         11, 'Golden State Warriors',  'starter',     3, 110.4, 101.6),
(12, 12, 'Jaime Jaquez Jr',     12, 'Oaklahoma City Thunder', 'role player', 3, 108.7, 104.1),
(13, 13, 'Dejounte Murray',     13, 'Miami Heat',             'starter',     3, 113.2, 104.8),
(14, 15, 'OG Anunoby',          15, 'Charlotte Hornets',      'starter',     3, 111.8, 102.4),
(15, 16, 'Ty Jerome',           16, 'Chicago Bullls',         'role player', 3, 109.6, 105.3),
(16, 19, 'Domantas Sabonis',    19, 'Memphis GRizzlies',      'starter',     3, 112.4, 103.6),
(17, 21, 'Zach LaVine',         21, 'Oaklahoma City Thunder', 'role player', 3, 108.9, 106.4),
(18, 25, 'Kelly Oubre Jr',      25, 'Charlotte Hornets',      'role player', 3, 107.6, 105.8);
GO

-- shortlist_entries
-- gm_id 5 = Bike Bumleavy, gm_id 6 = Bob Okafor
INSERT INTO SHORTLIST_ENTRY (entry_id, gm_id, prospect_id, date_added, internal_notes) VALUES
(1, 5, 1,  '2026-02-15', 'Top target. Best player in the class. Would need to move up to get him.'),
(2, 5, 3,  '2026-02-20', 'Boozer fits our system. High floor winner, love the Kevin Love comp.'),
(3, 5, 5,  '2026-03-01', 'Acuff is the most NBA-ready PG in the class. Addresses our biggest need.'),
(4, 5, 7,  '2026-03-05', 'Wagler is a smart player who elevates lineups. Good value in mid lottery.'),
(5, 6, 2,  '2026-01-25', 'Peterson is the best pure scorer in class. Need full medical before committing.'),
(6, 6, 4,  '2026-02-01', 'Wilson has elite tools and motor. Hand injury worth monitoring closely.'),
(7, 6, 6,  '2026-02-10', 'Flemings speed and pressure game fits our style. Monitor shot development.'),
(8, 6, 10, '2026-02-28', 'Burries is a steady two-way guard. Good value at his projected range.');
GO

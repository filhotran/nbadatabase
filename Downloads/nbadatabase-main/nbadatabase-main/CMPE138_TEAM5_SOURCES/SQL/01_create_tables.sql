USE nba_scouting;
GO

CREATE TABLE [USER] (
    user_id            INT IDENTITY(1,1) PRIMARY KEY,
    u_fname            VARCHAR(50) NOT NULL,
    u_lname            VARCHAR(50) NOT NULL,
    email              VARCHAR(100) NOT NULL UNIQUE,
    password_hash      VARCHAR(255) NOT NULL,
    role               VARCHAR(10) NOT NULL CHECK (role IN ('ADMIN','SCOUT','GM','ANALYST','FAN'))
);
GO

CREATE TABLE COLLEGE (
    college_id    INT IDENTITY(1,1) PRIMARY KEY,
    c_name        VARCHAR(100) NOT NULL,
    conference    VARCHAR(50),
    division      VARCHAR(50)
);
GO

CREATE TABLE ARCHETYPE (
    archetype_id    INT IDENTITY(1,1) PRIMARY KEY,
    arch_name       VARCHAR(100) NOT NULL,
    description     TEXT
);
GO

CREATE TABLE PROSPECT (
    prospect_id           INT IDENTITY(1,1) PRIMARY KEY,
    p_fname               VARCHAR(50) NOT NULL,
    p_lname               VARCHAR(50) NOT NULL,
    date_of_birth         DATE,
    hometown              VARCHAR(100),
    height                VARCHAR(10),
    weight                INT,
    position              VARCHAR(20),
    draft_year            INT,
    eligibility_status    VARCHAR(50),
    college_id            INT,
    FOREIGN KEY (college_id) REFERENCES COLLEGE(college_id)
);
GO

-- PROSPECT_ARCHETYPE junction table
CREATE TABLE PROSPECT_ARCHETYPE (
    prospect_id     INT,
    archetype_id    INT,
    PRIMARY KEY (prospect_id, archetype_id),
    FOREIGN KEY (prospect_id) REFERENCES PROSPECT(prospect_id),
    FOREIGN KEY (archetype_id) REFERENCES ARCHETYPE(archetype_id)
);
GO

-- weak entity
CREATE TABLE COLLEGE_STATS (
    stat_id         INT,
    prospect_id     INT,
    season_year     INT,
    games_played    INT,
    MPG             DECIMAL(4,1),
    PPG             DECIMAL(4,1),
    RPG             DECIMAL(4,1),
    APG             DECIMAL(4,1),
    TPG             DECIMAL(4,1),
    three_pt_pct    DECIMAL(5,3),
    fg_pct          DECIMAL(5,3),
    ft_pct          DECIMAL(5,3),
    stl             DECIMAL(4,1),
    blk             DECIMAL(4,1),
    o_rating        DECIMAL(5,1),
    d_rating        DECIMAL(5,1),
    PRIMARY KEY (stat_id, prospect_id),
    FOREIGN KEY (prospect_id) REFERENCES PROSPECT(prospect_id)
);
GO

-- weak entity
CREATE TABLE SCOUTING_REPORT (
    report_id           INT,
    prospect_id         INT,
    scout_id            INT,
    submission_date     DATE,
    game_date           DATE,
    game_opponent       VARCHAR(100),
    notes               TEXT,
    scout_orating       INT CHECK (scout_orating BETWEEN 1 AND 10),
    scout_drating       INT CHECK (scout_drating BETWEEN 1 AND 10),
    scout_intangibles   INT CHECK (scout_intangibles BETWEEN 1 AND 10),
    overall_rating      INT CHECK (overall_rating BETWEEN 1 AND 10),
    PRIMARY KEY (report_id, prospect_id),
    FOREIGN KEY (prospect_id) REFERENCES PROSPECT(prospect_id),
    FOREIGN KEY (scout_id) REFERENCES [USER](user_id)
);
GO

-- weak entity
CREATE TABLE BEHAVIORAL_ASSESSMENT (
    assessment_id   INT,
    prospect_id     INT,
    flag_type       VARCHAR(10) CHECK (flag_type IN 
                    ('positive','negative','neutral')),
    flag_label      VARCHAR(100) NOT NULL,
    description     TEXT,
    PRIMARY KEY (assessment_id, prospect_id),
    FOREIGN KEY (prospect_id) REFERENCES PROSPECT(prospect_id)
);
GO

-- weak entity
CREATE TABLE NBA_PLAYER_RECORD (
    career_id           INT,
    prospect_id         INT,
    comp_player_name    VARCHAR(100),
    draft_pick_no       INT,
    nba_team            VARCHAR(100),
    role_level          VARCHAR(20) CHECK (role_level IN 
                        ('bust','role player','starter','All-Star','superstar')),
    seasons_played      INT,
    career_orating      DECIMAL(5,1),
    career_drating      DECIMAL(5,1),
    PRIMARY KEY (career_id, prospect_id),
    FOREIGN KEY (prospect_id) REFERENCES PROSPECT(prospect_id)
);
GO

-- weak entity
CREATE TABLE SHORTLIST_ENTRY (
    entry_id        INT,
    gm_id           INT,
    prospect_id     INT,
    date_added      DATE,
    internal_notes  TEXT,
    PRIMARY KEY (entry_id, gm_id),
    FOREIGN KEY (gm_id) REFERENCES [USER](user_id),
    FOREIGN KEY (prospect_id) REFERENCES PROSPECT(prospect_id)
);
GO

-- triggers for the NBA Draft Scouting Database
USE nba_scouting;
GO

-- log table for scouting report activity
CREATE TABLE SCOUTING_REPORT_LOG (
    log_id      INT IDENTITY(1,1) PRIMARY KEY,
    prospect_id INT,
    scout_id    INT,
    action_time DATETIME DEFAULT GETDATE(),
    details     VARCHAR(255)
);
GO

-- log table for user account activity
CREATE TABLE USER_LOG (
    log_id      INT IDENTITY(1,1) PRIMARY KEY,
    user_id     INT,
    email       VARCHAR(100),
    role        VARCHAR(10),
    action      VARCHAR(20),
    action_time DATETIME DEFAULT GETDATE()
);
GO

-- logs every new scouting report automatically
CREATE TRIGGER trg_log_scouting_report
ON SCOUTING_REPORT
AFTER INSERT
AS
BEGIN
    INSERT INTO SCOUTING_REPORT_LOG (prospect_id, scout_id, action_time, details)
    SELECT
        i.prospect_id,
        i.scout_id,
        GETDATE(),
        'Report submitted for prospect ID ' + CAST(i.prospect_id AS VARCHAR) +
        ' with overall rating ' + CAST(i.overall_rating AS VARCHAR)
    FROM inserted i;
END;
GO

-- logs every new user account creation
CREATE TRIGGER trg_log_user_creation
ON [USER]
AFTER INSERT
AS
BEGIN
    INSERT INTO USER_LOG (user_id, email, role, action, action_time)
    SELECT i.user_id, i.email, i.role, 'INSERT', GETDATE()
    FROM inserted i;
END;
GO

-- prevents a GM from adding the same prospect to their shortlist twice
CREATE TRIGGER trg_prevent_duplicate_shortlist
ON SHORTLIST_ENTRY
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM SHORTLIST_ENTRY se
        JOIN inserted i ON se.gm_id = i.gm_id
                       AND se.prospect_id = i.prospect_id
        WHERE se.entry_id != i.entry_id
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR ('This prospect is already on your shortlist.', 16, 1);
    END
END;
GO

-- enforces all scouting ratings stay between 1 and 10
CREATE TRIGGER trg_validate_ratings
ON SCOUTING_REPORT
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM inserted
        WHERE overall_rating    < 1 OR overall_rating    > 10
           OR scout_orating     < 1 OR scout_orating     > 10
           OR scout_drating     < 1 OR scout_drating     > 10
           OR scout_intangibles < 1 OR scout_intangibles > 10
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR ('All ratings must be between 1 and 10.', 16, 1);
    END
END;
GO

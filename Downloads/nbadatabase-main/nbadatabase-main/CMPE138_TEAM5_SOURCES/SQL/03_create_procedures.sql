-- stored procedures for the NBA Draft Scouting Database
USE nba_scouting;
GO

-- returns full profile for a prospect
-- use: EXEC sp_get_prospect_profile @prospect_id = 1;
CREATE PROCEDURE sp_get_prospect_profile
    @prospect_id INT
AS
BEGIN
    SELECT * FROM prospect_summary
    WHERE prospect_id = @prospect_id;

    SELECT * FROM scout_report_summary
    WHERE prospect_id = @prospect_id;

    SELECT * FROM prospect_behavioral_flags
    WHERE prospect_id = @prospect_id;

    SELECT * FROM nba_comparison_view
    WHERE prospect_id = @prospect_id;
END;
GO

-- filter prospects by any combination of stats
-- use: EXEC sp_filter_prospects @position = 'PG', @min_PPG = 18.0;
--      EXEC sp_filter_prospects @min_PPG = 20.0, @min_three_pct = 0.35;
--      EXEC sp_filter_prospects;  -- returns all prospects
CREATE PROCEDURE sp_filter_prospects
    @position       VARCHAR(20)  = NULL,
    @min_PPG        DECIMAL(4,1) = 0,
    @min_RPG        DECIMAL(4,1) = 0,
    @min_APG        DECIMAL(4,1) = 0,
    @min_TPG        DECIMAL(4,1) = 0,
    @min_MPG        DECIMAL(4,1) = 0,
    @min_three_pct  DECIMAL(5,3) = 0,
    @min_fg_pct     DECIMAL(5,3) = 0,
    @min_ft_pct     DECIMAL(5,3) = 0,
    @min_stl        DECIMAL(4,1) = 0,
    @min_blk        DECIMAL(4,1) = 0,
    @min_o_rating   DECIMAL(5,1) = 0,
    @min_d_rating   DECIMAL(5,1) = 0
AS
BEGIN
    SELECT
        p.prospect_id,
        p.p_fname + ' ' + p.p_lname    AS prospect_name,
        p.position,
        c.c_name                        AS college,
        cs.PPG, cs.RPG, cs.APG, cs.TPG,
        cs.three_pt_pct, cs.fg_pct, cs.ft_pct,
        cs.stl, cs.blk, cs.o_rating, cs.d_rating
    FROM PROSPECT p
    JOIN COLLEGE c        ON p.college_id  = c.college_id
    JOIN COLLEGE_STATS cs ON p.prospect_id = cs.prospect_id
    WHERE (@position      IS NULL OR p.position = @position)
      AND cs.PPG          >= @min_PPG
      AND cs.RPG          >= @min_RPG
      AND cs.APG          >= @min_APG
      AND cs.TPG          >= @min_TPG
      AND cs.MPG          >= @min_MPG
      AND cs.three_pt_pct >= @min_three_pct
      AND cs.fg_pct       >= @min_fg_pct
      AND cs.ft_pct       >= @min_ft_pct
      AND cs.stl          >= @min_stl
      AND cs.blk          >= @min_blk
      AND cs.o_rating     >= @min_o_rating
      AND cs.d_rating     >= @min_d_rating
    ORDER BY cs.PPG DESC;
END;
GO

-- inserts a new prospect and their stats in one transaction
-- use: EXEC sp_add_prospect 'John', 'Doe', 'PG', 2026, 1, 30, 18.5, 5.2, 4.1;
CREATE PROCEDURE sp_add_prospect
    @p_fname        VARCHAR(50),
    @p_lname        VARCHAR(50),
    @position       VARCHAR(20),
    @draft_year     INT,
    @college_id     INT,
    @games_played   INT,
    @PPG            DECIMAL(4,1),
    @RPG            DECIMAL(4,1),
    @APG            DECIMAL(4,1)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        INSERT INTO PROSPECT (p_fname, p_lname, position, draft_year, college_id, eligibility_status)
        VALUES (@p_fname, @p_lname, @position, @draft_year, @college_id, 'Freshman');

        DECLARE @new_id INT = SCOPE_IDENTITY();

        INSERT INTO COLLEGE_STATS (stat_id, prospect_id, season_year, games_played, PPG, RPG, APG, MPG, TPG, three_pt_pct, fg_pct, ft_pct, stl, blk, o_rating, d_rating)
        VALUES (1, @new_id, @draft_year, @games_played, @PPG, @RPG, @APG, 0, 0, 0, 0, 0, 0, 0, 0, 0);

        COMMIT TRANSACTION;
        PRINT 'Prospect added with ID ' + CAST(@new_id AS VARCHAR);
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        PRINT 'Error: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

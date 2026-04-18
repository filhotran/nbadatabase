-- SJSU CMPE 138 SPRING 2026 TEAM5
-- File: 05_create_indexes.sql
-- Description: Indexes for the NBA Draft Scouting Database
-- Owner: Teammate 6

USE nba_scouting;
GO

-- TODO: Add indexes here
-- Example indexes to implement:
--   - idx_prospect_draft_year: speed up filtering by draft year
--   - idx_prospect_position: speed up filtering by position
--   - idx_college_stats_prospect: speed up stat lookups per prospect
--   - idx_scouting_report_scout: speed up report lookups per scout
--   - idx_user_email: speed up login lookup by email

CREATE INDEX idx_prospect_draft_year ON PROSPECT(draft_year);
GO
CREATE INDEX idx_prospect_position ON PROSPECT(position);
GO
CREATE INDEX idx_college_stats_prospect ON COLLEGE_STATS(prospect_id);
GO
CREATE INDEX idx_scouting_report_scout ON SCOUTING_REPORT(scout_id);
GO
CREATE INDEX idx_user_email ON [USER](email);
GO

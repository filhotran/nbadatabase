-- indexes for the NBA Draft Scouting Database
USE nba_scouting;
GO

-- speeds up login lookup (used on every login attempt)
CREATE INDEX idx_user_email
ON [USER](email);
GO

-- speeds up role-based access checks
CREATE INDEX idx_user_role
ON [USER](role);
GO

-- speeds up filtering by position
CREATE INDEX idx_prospect_position
ON PROSPECT(position);
GO

-- speeds up filtering by draft year
CREATE INDEX idx_prospect_draft_year
ON PROSPECT(draft_year);
GO

-- speeds up prospect lookups by college
CREATE INDEX idx_prospect_college
ON PROSPECT(college_id);
GO

-- speeds up stat lookups per prospect (used in almost every query)
CREATE INDEX idx_college_stats_prospect
ON COLLEGE_STATS(prospect_id);
GO

-- speeds up stat filtering (PPG is the most commonly filtered stat)
CREATE INDEX idx_college_stats_ppg
ON COLLEGE_STATS(PPG);
GO

-- speeds up pulling all reports for a prospect
CREATE INDEX idx_scouting_report_prospect
ON SCOUTING_REPORT(prospect_id);
GO

-- speeds up pulling all reports submitted by a scout
CREATE INDEX idx_scouting_report_scout
ON SCOUTING_REPORT(scout_id);
GO

-- speeds up behavioral flag lookups per prospect
CREATE INDEX idx_behavioral_prospect
ON BEHAVIORAL_ASSESSMENT(prospect_id);
GO

-- speeds up GM shortlist lookups
CREATE INDEX idx_shortlist_gm
ON SHORTLIST_ENTRY(gm_id);
GO

-- speeds up archetype filtering
CREATE INDEX idx_prospect_archetype
ON PROSPECT_ARCHETYPE(archetype_id);
GO

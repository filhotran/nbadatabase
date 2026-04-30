# NBA Draft Scouting Database
## SJSU CMPE 138 Spring 2026 — Team 5

**Members:** Yusuf Kose, Ian Posada Kim, Filho Tran, Michael Kim, Joshua Lu, Devin Roberson

---

## Project Overview
A relational database platform for NBA  scouting and prospect research. Front office personnel (scouts, managers, analysts) will use it to evaluate college basketball prospects. Fans can browse basketball player profiles.

---

## Tech Stack
- **Database:** Microsoft SQL Server Express (MSSQL)
- **Application:** Python
- **DB Connector:** pyodbc
- **Password Hashing:** bcrypt

---

## Setup Instructions

### 1. Install Requirements
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/en-us/sql/ssms)
- Python
- Run: `pip install pyodbc bcrypt`

### 2. Database Setup
Open SSMS and run scripts **in order**:
1. `SQL/01_create_tables.sql`
2. `SQL/06_sample_data.sql`
3. `SQL/02_create_views.sql`
4. `SQL/03_create_procedures.sql`
5. `SQL/04_create_triggers.sql`
6. `SQL/05_create_indexes.sql`

### 3. Run the Application
```bash
cd DB-Application
python app.py
```

---

## Primary File Contributions
| File | Contributer |
|------|-------|
| SQL/01_create_tables.sql | Filho |
| SQL/06_sample_data.sql | Filho |
| SQL/02_create_views.sql | Teammate 6 |
| SQL/03_create_procedures.sql | Teammate 6 |
| SQL/04_create_triggers.sql | Teammate 6 |
| SQL/05_create_indexes.sql | Teammate 6 |
| DB-Application/db.py | Filho |
| DB-Application/logger.py | Filho |
| DB-Application/app.py | Filho |
| DB-Application/auth.py | Teammate 2 |
| DB-Application/admin_ops.py | Teammate 2 |
| DB-Application/scout_ops.py | Teammate 3 |
| DB-Application/gm_ops.py | Teammate 4 |
| DB-Application/analyst_ops.py | Teammate 5 |
| DB-Application/fan_ops.py | Teammate 5 |

---

## Sample Login Credentials (after running 06_sample_data.sql)
| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@nbascout.com | password123 |
| GM | gm1@nbascout.com | password123 |
| ANALYST | analyst@nbascout.com | password123 |
| SCOUT | scout1@nbascout.com | password123 |
| FAN | fan@nbascout.com | password123 |

> Note: Passwords in sample data are placeholder hashes. Auth.py hash utility will generate real bcrypt hashes.

Foundation/Admin
- Admin logs in
- Creates a new scout account
- Loads a new prospect into the database
- Shows the new rows appear in the tables

Scout
- Scout logs in
- Searches for a prospect by name
- Submits a new scouting report with ratings
- Tags a behavioral flag on the prospect
- Shows the new report in SCOUTING_REPORT table

GM
- GM logs in
- Filters prospects by archetype e.g. "3-and-D Wing"
- Filters by stat threshold e.g. PPG > 20
- Adds a prospect to shortlist with internal notes
- Shows SHORTLIST_ENTRY table updated

Analyst
- Analyst logs in
- Views aggregated stats across the draft class
- Pulls up draft class rankings by position
- Views all scouting reports for a specific prospect
- -Read-only — shows no INSERT/UPDATE/DELETE access

Fan
- Visits without logging in
- Searches prospects by college e.g. "Duke"
- Views a prospect's public profile and stats
- Views NBA career comparisons
- Shows no access to scouting reports or shortlists

Database Objects
- Demonstrates a stored procedure executing
- Shows a trigger firing e.g. when a report is submitted
- Shows a view returning data
- Walks through the schema and normalization

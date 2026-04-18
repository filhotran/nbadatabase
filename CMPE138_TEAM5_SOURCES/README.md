# NBA Draft Scouting Database
## SJSU CMPE 138 Spring 2026 — Team 5

**Members:** Yusuf Kose, Ian Posada Kim, Filho Tran, Michael Kim, Joshua Lu, Devin Roberson

---

## Project Overview
A relational database platform for NBA draft scouting and prospect research. Front office personnel (scouts, GMs, analysts) use it to evaluate college basketball prospects. Fans can browse public prospect profiles without logging in.

---

## Tech Stack
- **Database:** Microsoft SQL Server Express (MSSQL)
- **Application:** Python 3.x
- **DB Connector:** pyodbc
- **Password Hashing:** bcrypt

---

## Setup Instructions

### 1. Install Requirements
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/en-us/sql/ssms)
- Python 3.x
- Run: `pip install pyodbc bcrypt`

### 2. Database Setup
Open SSMS and run scripts **in this exact order**:
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

## Branch Naming Convention
| Branch | Owner | Responsibility |
|--------|-------|----------------|
| `main` | All | Stable, final code only |
| `dev` | All | Integration branch |
| `foundation` | Filho | Tables, sample data, db.py, logger.py |
| `auth-admin` | Teammate 2 | auth.py, admin_ops.py |
| `scout-ops` | Teammate 3 | scout_ops.py |
| `gm-ops` | Teammate 4 | gm_ops.py |
| `analyst-fan-ops` | Teammate 5 | analyst_ops.py, fan_ops.py |
| `db-objects` | Teammate 6 | Views, procedures, triggers, indexes |

**Rules:**
- Never push directly to `main`
- Always branch from `dev`
- Open a pull request into `dev` when your module works
- Tag Filho to review before merging

---

## File Ownership
| File | Owner |
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
| SCOUT | scout1@nbascout.com | password123 |
| GM | gm1@nbascout.com | password123 |
| ANALYST | analyst@nbascout.com | password123 |
| FAN | fan@nbascout.com | password123 |

> Note: Passwords in sample data are placeholder hashes. Run auth.py hash utility to generate real bcrypt hashes before testing login.

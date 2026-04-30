# NBA Draft Scouting Database — Setup Guide
**SJSU CMPE 138 Spring 2026 — Team 5**

---

## Prerequisites

Install all of these before starting:

- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) — choose **Basic** install
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- [Python 3.9+](https://www.python.org/downloads/) — check **Add Python to PATH** during install
- [Node.js LTS](https://nodejs.org/)

---

## Finding Your Project Folder

After downloading and extracting the repo, your folder structure should look like this:

```
nbadatabase-main/
  CMPE138_TEAM5_SOURCES/
  frontend/
  tables.sql
```

All terminal commands below should be run from inside this folder unless specified otherwise. Replace `username` with your Windows username and `nbadatabase-main` with whatever your folder is named.

---

## Step 1 — Database Setup

1. Open **SSMS** and connect with:
   - Server name: `.\SQLEXPRESS`
   - Authentication: **Windows Authentication**

2. Click **New Query**, paste this, and press **F5**:
   ```sql
   CREATE DATABASE nba_scouting;
   ```

3. Run each SQL file in this exact order using **File → Open → File**, then **F5**:

   | Order | File |
   |-------|------|
   | 1 | `CMPE138_TEAM5_SOURCES/SQL/01_create_tables.sql` |
   | 2 | `CMPE138_TEAM5_SOURCES/SQL/06_sample_data.sql` |
   | 3 | `CMPE138_TEAM5_SOURCES/SQL/02_create_views.sql` |
   | 4 | `CMPE138_TEAM5_SOURCES/SQL/03_create_procedures.sql` |
   | 5 | `CMPE138_TEAM5_SOURCES/SQL/04_create_triggers.sql` |
   | 6 | `CMPE138_TEAM5_SOURCES/SQL/05_create_indexes.sql` |

   > **Note:** If you see "object already exists" errors when running `01_create_tables.sql`, the tables are already there — skip to step 2.

---

## Step 2 — Install Python Dependencies

Open a terminal and run:

```bash
python -m pip install pyodbc bcrypt flask flask-cors
```

---

## Step 3 — Fix Sample Passwords

The sample data uses placeholder hashes. Run this once to set all passwords to `password123`:

```bash
cd C:\Users\username\Downloads\nbadatabase-main\frontend\api
python fix_passwords.py
```

---

## Step 4 — Install React Dependencies

```bash
cd C:\Users\username\Downloads\nbadatabase-main\frontend\web
npm install
```

---

## Step 5 — Run the App

You need **two terminals open at the same time**.

**Terminal 1 — Flask API:**
```bash
cd C:\Users\username\Downloads\nbadatabase-main\frontend\api
python app.py
```
Leave this running. If the database is connected correctly you will see no `[WARNING]` message.

**Terminal 2 — React:**
```bash
cd C:\Users\username\Downloads\nbadatabase-main\frontend\web
npm run dev
```
Leave this running too.

Then open **http://localhost:5173** in your browser.

---

## Sample Login Credentials

All passwords are `password123`

| Role | Email |
|------|-------|
| ADMIN | admin@nbascout.com |
| SCOUT | scout1@nbascout.com |
| GM | gm1@nbascout.com |
| ANALYST | analyst@nbascout.com |
| FAN | fan1@nbascout.com |

> The public prospect page is accessible without logging in.

---

## Troubleshooting

**"Site cannot be reached" on localhost:5173**
→ Make sure `npm run dev` is still running in Terminal 2.

**"Database offline" error on the website**
→ Make sure `python app.py` is still running in Terminal 1.

**"Invalid email or password" on login**
→ Run `python fix_passwords.py` again from the `frontend/api` folder.

**`pip` not recognized**
→ Use `python -m pip install ...` instead of `pip install ...`

**"Cannot connect to SQL Server" error**
→ Open Windows search → type **Services** → find **SQL Server (SQLEXPRESS)** → right click → **Start**

**Tables already exist error when running SQL scripts**
→ Skip `01_create_tables.sql` and continue from `06_sample_data.sql`

**Port conflict on 5001**
→ Change the port in `frontend/api/app.py` (last line) and `frontend/web/vite.config.js` to match.

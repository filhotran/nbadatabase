# NBA Draft Scout — Frontend Setup

## Prerequisites

Install these before starting:

- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) — choose **Basic** install
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- [Python](https://www.python.org/downloads/) (3.9+)
- [Node.js](https://nodejs.org/) (LTS version)

---

## Step 1 — Database Setup

1. Open **SSMS** and connect with:
   - Server name: `.\SQLEXPRESS`
   - Authentication: Windows Authentication

2. Click **New Query**, paste the line below, and press **F5**:
   ```sql
   CREATE DATABASE nba_scouting;
   ```

3. Run each SQL script in order using **File → Open → File**, then **F5**:
   - `CMPE138_TEAM5_SOURCES/SQL/01_create_tables.sql` — skip line 1 (`CREATE DATABASE...`), select the rest and press F5
   - `CMPE138_TEAM5_SOURCES/SQL/06_sample_data.sql`
   - `CMPE138_TEAM5_SOURCES/SQL/02_create_views.sql`
   - `CMPE138_TEAM5_SOURCES/SQL/03_create_procedures.sql`
   - `CMPE138_TEAM5_SOURCES/SQL/04_create_triggers.sql`
   - `CMPE138_TEAM5_SOURCES/SQL/05_create_indexes.sql`

---

## Step 2 — Install Python Dependencies

```bash
python -m pip install pyodbc bcrypt flask flask-cors
```

---

## Step 3 — Fix Sample Passwords

The sample data has placeholder password hashes. Run this once to set them all to `password123`:

```bash
cd frontend/api
python fix_passwords.py
```

---

## Step 4 — Install React Dependencies

```bash
cd frontend/web
npm install
```

---

## Step 5 — Run the App

You need **two terminals open at the same time**:

**Terminal 1 — Flask API:**
```bash
cd frontend/api
python app.py
```
You should see no `[WARNING]` message if the DB is connected correctly.

**Terminal 2 — React:**
```bash
cd frontend/web
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Sample Login Credentials

All passwords are `password123`

| Role     | Email                  |
|----------|------------------------|
| ADMIN    | admin@nbascout.com     |
| SCOUT    | scout1@nbascout.com    |
| GM       | gm1@nbascout.com       |
| ANALYST  | analyst@nbascout.com   |
| FAN      | fan1@nbascout.com      |

---

## Troubleshooting

**"site cannot be reached" on localhost:5173**
→ Make sure `npm run dev` is running in a terminal.

**"Database offline" error on the website**
→ Make sure `python app.py` is running in a separate terminal.

**Login says "Invalid email or password"**
→ Run `python fix_passwords.py` again.

**`pip` not recognized**
→ Use `python -m pip install ...` instead.

**Port conflict on 5001**
→ Change the port in `frontend/api/app.py` (last line) and `frontend/web/vite.config.js` to match.

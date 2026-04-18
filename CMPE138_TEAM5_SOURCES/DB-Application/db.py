# SJSU CMPE 138 SPRING 2026 TEAM5
# File: db.py
# Description: Database connection module for NBA Draft Scouting Database
# Owner: Filho Tran
# All teammates import get_connection() from this file

import pyodbc

def get_connection():
    """
    Returns a connection to the nba_scouting MSSQL database.
    Uses Windows Authentication (Trusted_Connection).
    Update SERVER if your SQL Server instance name is different.
    """
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=.\\SQLEXPRESS;'
        'DATABASE=nba_scouting;'
        'Trusted_Connection=yes;'
    )
    return conn

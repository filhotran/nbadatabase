# database connection for NBA Draft Database

import pyodbc

# connects to the nba_scouting MSSQL database.
def get_connection():
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=.\\SQLEXPRESS;'
        'DATABASE=nba_scouting;'
        'Trusted_Connection=yes;'
    )
    return conn

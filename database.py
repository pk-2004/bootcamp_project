# database.py
import sqlite3

def get_db_connection():
    """Returns a database connection."""
    conn = sqlite3.connect("attendance.db")
    conn.row_factory = sqlite3.Row  # To access rows as dictionaries
    return conn

def setup_database():
    """Sets up the database and creates necessary tables."""
    conn = get_db_connection()
    conn.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()

def insert_attendance(student_name: str, date: str, status: str):
    """Inserts a single attendance record into the database."""
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO attendance (student_name, date, status) VALUES (?, ?, ?)",
        (student_name, date, status)
    )
    conn.commit()
    conn.close()

def insert_multiple_attendance(records):
    """Inserts multiple attendance records at once."""
    conn = get_db_connection()
    conn.executemany("INSERT INTO attendance (student_name, date, status) VALUES (?, ?, ?)", records)
    conn.commit()
    conn.close()

def get_all_attendance():
    """Fetches all attendance records from the database."""
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM attendance").fetchall()
    conn.close()
    return rows

def get_attendance_by_student(student_name: str):
    """Fetches attendance records for a specific student."""
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM attendance WHERE student_name = ?", (student_name,)).fetchall()
    conn.close()
    return rows


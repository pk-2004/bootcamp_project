from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# defining a data model
class Attendance(BaseModel):
    student_name: str
    date: str
    status: str

# functions for database interactions

# function for connecting to the database
def get_db_connection():
    conn = sqlite3.connect("attendance.db")
    conn.row_factory = sqlite3.Row 
    return conn

# function for inserting new attendance records
def insert_attendance(student_name: str, date: str, status: str):
    conn = get_db_connection()
    conn.execute("INSERT INTO attendance (student_name, date, status) VALUES (?, ?, ?)",
                 (student_name, date, status))
    conn.commit()
    conn.close()

# function for retrieving attendance records
def get_attendance_by_student(student_name: str):
    conn = get_db_connection()
    attendance = conn.execute("SELECT * FROM attendance WHERE student_name = ?",
                              (student_name,)).fetchall()
    conn.close()
    return attendance

# defining two routes
# one route will be for adding attendance
# another route will be for seeing information on a specific selected student
# Using POST and GET requests

@app.post
def add_attendance(attendance: Attendance):
    insert_attendance(attendance.student_name, attendance.date, attendance.status)
    return {"message": f"Attendance for {attendance.student_name} on {attendance.date} was added."}

@app.get("/attendance/{student_name}")
def get_attendance(student_name: str):
    # retrieving attendance data for a specific student
    attendance = get_attendance_by_student(student_name)
    
    # using a fail checker to make sure errors are caught
    if attendance:
        return {"attendance": [dict(row) for row in attendance]}
    raise HTTPException(status_code=404, detail="Student not found")
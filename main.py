# main.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import csv
from database import get_db_connection, setup_database, insert_attendance, insert_multiple_attendance, get_all_attendance, get_attendance_by_student

app = FastAPI()

# Initialize the database on startup
setup_database()

# Data model for the attendance endpoint
class Attendance(BaseModel):
    student_name: str
    date: str
    status: str

# Route to add individual attendance
@app.post("/add_attendance/")
def add_attendance(attendance: Attendance):
    insert_attendance(attendance.student_name, attendance.date, attendance.status)
    return {"message": f"Attendance for {attendance.student_name} on {attendance.date} was added."}

# Route to retrieve attendance for a specific student
@app.get("/attendance/{student_name}")
def get_attendance(student_name: str):
    attendance = get_attendance_by_student(student_name)
    if attendance:
        return {"attendance": [dict(row) for row in attendance]}
    raise HTTPException(status_code=404, detail="Student not found")

# Route to upload multiple attendance records from a CSV
@app.post("/upload_csv/")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
    
    records = []
    try:
        content = await file.read()
        decoded_content = content.decode("utf-8").splitlines()
        reader = csv.DictReader(decoded_content)
        
        for row in reader:
            student_name = row["name"]
            date = row["date"]
            records.append((student_name, date, "Present"))  # Default status to "Present"

        insert_multiple_attendance(records)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

    return {"message": f"Uploaded {len(records)} attendance records successfully."}

# Route to get all attendance records
@app.get("/attendance/")
def get_all_attendance_records():
    rows = get_all_attendance()
    return {"attendance": [dict(row) for row in rows]}

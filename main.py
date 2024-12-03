from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import csv
import sqlite3
from database import get_db_connection, setup_database, insert_attendance, insert_multiple_attendance, get_all_attendance, get_attendance_by_student

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

# Allow CORS for all origins (adjust this as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace "*" with specific origins for more security
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

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
def get_attendance_by_student(student_name: str):
    conn = sqlite3.connect("attendance.db")
    cursor = conn.cursor()
    cursor.execute("SELECT date, status FROM attendance WHERE student_name = ?", (student_name,))
    rows = cursor.fetchall()
    conn.close()

    # Ensure we return the data in the correct structure
    if not rows:
        raise HTTPException(status_code=404, detail=f"No attendance records found for {student_name}.")

    attendance_records = [{"date": row[0], "status": row[1]} for row in rows]
    return attendance_records

# Route to upload multiple attendance records from a CSV
@app.post("/upload_csv/")
async def upload_csv(file: UploadFile = File(...)):

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
    
    records = []
    try:
        print(f"Uploading file: {file.filename}")
        content = await file.read()
        decoded_content = content.decode("utf-8").splitlines()
        print(content.decode("utf-8"))
        reader = csv.DictReader(decoded_content)
        
        for row in reader:
            print(f"Processing row: {row}")  # Add print statements to debug row processing
            student_name = row["name"]
            date = row["date"]
            records.append((student_name, date, "Present"))  # Default status to "Present"

        insert_multiple_attendance(records)
    except Exception as e:
        print(f"Error: {str(e)}")  # Add error logging for better debugging
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

    return {"message": f"Uploaded {len(records)} attendance records successfully."}

# Route to get all attendance records
@app.get("/attendance/")
def get_all_attendance_records():
    rows = get_all_attendance()
    return {"attendance": [dict(row) for row in rows]}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./StudentPage.css"; // Import custom CSS for this page

interface AttendanceRecord {
  date: string;
  status: string;
}

function StudentPage() {
  const { name } = useParams(); // Get the student name from the URL
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendance records for the student
  useEffect(() => {
    async function fetchStudentAttendance() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/attendance/${decodeURIComponent(name || "")}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch attendance: ${response.statusText}`);
        }
        const data: AttendanceRecord[] = await response.json();
        setAttendance(data);
      } catch (err: any) {
        console.error(err); // Log the error to the console for debugging
        setError(err.message); // Set the error state to display to the user
      } finally {
        setLoading(false); // Stop loading once the data is fetched or error occurs
      }
    }

    if (name) {
      fetchStudentAttendance();
    }
  }, [name]);

  // Calculate attendance percentage
  const totalClasses = attendance.length;
  const presentCount = attendance.filter(record => record.status === "Present").length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="student-page">
      <h2>{name}</h2>
      <section id="student-performance">
        <div className="performance-card">
          <h3>Attendance</h3>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${attendancePercentage}%` }}></div>
          </div>
          <p>{attendancePercentage}% attendance</p>
        </div>
      </section>

      <div id="attendance-records">
        {attendance.map((record, index) => (
          <div key={index} className={`attendance-record ${record.status.toLowerCase()}`}>
            <p><strong>{record.date}</strong>: {record.status}</p>
          </div>
        ))}
      </div>

      <Link to="/" className="back-link">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default StudentPage;

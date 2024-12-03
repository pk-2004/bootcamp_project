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
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: AttendanceRecord[] = await response.json();
        setAttendance(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (name) {
      fetchStudentAttendance();
    }
  }, [name]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  // Calculate attendance percentage
  const totalClasses = attendance.length;
  const presentCount = attendance.filter(record => record.status === "Present").length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  return (
    <div className="student-page">
      <h2 className="student-name">{name}</h2>
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

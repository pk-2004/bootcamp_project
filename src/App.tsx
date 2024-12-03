import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import "./App.css";
import Navbar from "./Navbar";

// Interface for attendance records
interface AttendanceRecord {
  date: string;
  status: string;
}

// Student type definition
type Student = { name: string };

// Mock data for students
const students = [
  { name: "Emily Lawrence" },
  { name: "Cedric Pierre-Louis" },
  { name: "Pranav Krishnamurthy" },
  { name: "Misha Khan" },
  { name: "Harini Thirukonda" },
  { name: "Kira Le" },
  { name: "Andy Chen" },
  { name: "Riya Lakhani" },
  { name: "Rachel Li" },
  { name: "Uriel Vit-Ojiegbe" },
  { name: "Kyle Yin" },
];

// Component for displaying individual student names as links
function Student({ name }: Student) {
  return (
    <Link to={`/student/${encodeURIComponent(name)}`} className="student-link">
      <div className="student">
        <h3>{name}</h3>
      </div>
    </Link>
  );
}

// Component for the student detail page
function StudentPage() {
  const { name } = useParams(); // Get the student name from the URL
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [selectedWeeks, setSelectedWeeks] = useState<boolean[]>(new Array(9).fill(false)); // 9 weeks from 9/24 to 11/26

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

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
  };

  const handleNoteSubmit = () => {
    if (newNote.trim()) {
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setNewNote(""); // Clear the input after submitting
    }
  };

  // Calculate attendance percentage
  const totalClasses = attendance.length;
  const presentCount = attendance.filter(record => record.status === "Present").length;
  const attendancePercentage = totalClasses ? (presentCount / totalClasses) * 100 : 0;

  // Calculate progress based on selected checkboxes (weeks)
  const handleWeekCheckboxChange = (index: number) => {
    const updatedWeeks = [...selectedWeeks];
    updatedWeeks[index] = !updatedWeeks[index]; // Toggle the selected state
    setSelectedWeeks(updatedWeeks);
  };

  const selectedWeeksCount = selectedWeeks.filter(Boolean).length;
  const progressBarPercentage = (selectedWeeksCount / selectedWeeks.length) * 100;

  return (
    <div className="student-page">
      <h2>{name}</h2>
      <section id="student-performance">

        <div className="weeks-container">
          <h3>Attendance</h3>
          <table className="weeks-table">
            <thead>
              <tr>
                <th>Week</th>
                <th>Select Week</th>
              </tr>
            </thead>
            <tbody>
              {["9/24", "10/1", "10/8", "10/15", "10/22", "10/29", "11/5", "11/12", "11/19"].map((week, index) => (
                <tr key={index}>
                  <td>{week}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedWeeks[index]}
                      onChange={() => handleWeekCheckboxChange(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progressBarPercentage}%` }}></div>
          </div>
          <p>{progressBarPercentage.toFixed(2)}% progress</p>
        </div>
      </section>

      <div id="attendance-records">
        {attendance.map((record, index) => (
          <div key={index} className="attendance-record">
            <p>
              {record.date}: {record.status}
            </p>
          </div>
        ))}
      </div>

      <section id="notes-section">
        <h3>Notes</h3>
        <textarea
          value={newNote}
          onChange={handleNoteChange}
          placeholder="Add a note"
        />
        <button onClick={handleNoteSubmit}>Save Note</button>
        <div className="notes-list">
          {notes.map((note, index) => (
            <p key={index} className="note-item">{note}</p>
          ))}
        </div>
      </section>

      <Link to="/" className="back-link">
        Back to Dashboard
      </Link>
    </div>
  );
}

// Component for the main student dashboard
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload_csv/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("File uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("An error occurred while uploading the file.");
    }
  };

  return (
    <>
      <Navbar />
      <h1 id="title">Bootcamp Student Attendance</h1>
      <div id="box">
        <div id="students-container">
          <input
            type="text"
            id="search-bar"
            placeholder="Search for a student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="student-list">
            {filteredStudents.map((student, index) => (
              <li key={index}>
                <Student name={student.name} />
              </li>
            ))}
          </ul>
        </div>

        <div id="upload-container">
          <h2>Upload Attendance</h2>
          <input type="file" onChange={handleFileChange} />
          {file && <p>Selected File: {file.name}</p>}
          <button id="submit-button" onClick={handleFileUpload}>
            Upload
          </button>
          {uploadStatus && <p>{uploadStatus}</p>}
        </div>
      </div>
    </>
  );
}

// Router for managing navigation between pages
function AppWithRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/student/:name" element={<StudentPage />} />
      </Routes>
    </Router>
  );
}

export default AppWithRoutes;
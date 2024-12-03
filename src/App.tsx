import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import './App.css'
import Navbar from './Navbar'

interface AttendanceRecord {
  name: string;
  date: string;
  status: string;
}

type Student = {name: string}; //attendance: Array<Attendance>};

{/*temporary until we figure out how to add students and access them from api*/}
const students = [
  { name: "Emily Lawrence"},
  { name: "Cedric Pierre-Louis"},
  { name: "Pranav Krishnamurthy"},
  { name: "Misha Khan"},
  { name: "Harini Thirukonda"},
  { name: "Kira Le"},
  { name: "Andy Chen"},
  { name: "Riya Lakhani"},
  { name: "Rachel Li"},
  { name: "Uriel Vit-Ojiegbe"},
  { name: "Kyle Yin"},
];


function Checkbox({content} : {content: string}) {
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={isChecked} 
          onChange={handleOnChange}
        />
        {content}
      </label>
    </div>
  );
}

function Student({name}: Student ) {
  
  return (
    <>
    <Link to={`/student/${name}`}>
      <div className="student">
        <h3>{name}</h3>
      </div>
    </Link>
    </>
  )
}


function App() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Navbar></Navbar>
      <h1 id="title">Bootcamp Student Attendance</h1>
      
      <div id="box">

        <div id="students-container">
          {/* <h3 id="student-title">Students</h3> */}
          <input type="text" id="search-bar" placeholder="Search for a student..." value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}></input>

          {/* Student List */}

          <ul className="student-list">
            {filteredStudents.map((student, index) => (
              <li key={index}>
                <Student name={student.name}></Student>
              </li>
            ))}
          </ul>

        </div>
       
      </div>
    </>
  )
}

{/*student page which should be different for each student by using the data from backend*/}
function StudentPage({ name }: { name: string }) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStudentAttendance() {
    try {
      const response = await fetch(`http://127.0.0.1:8000/attendance/${decodeURIComponent(name)}`);
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
  };

  useEffect(() => {
      fetchStudentAttendance();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
      return <p>Error: {error}</p>;
  }
  
  return (
    <div>
      <h2>{name}</h2>
      <section id="student-performance">
            <div className="performance-card">
                <h3>Attendance</h3>
                {/*add the attendance and hw here based on the backend data*/}

                <div className="progress-bar">
                    <div className="progress"></div>
                </div>

                {/*have this update accordingly*/}
                <p>75% attendance</p>
            </div>

        </section>

        <div id="attendance-checkboxes">
  
          {attendance.map((record, index) => (
              <tr key={index}>
              <td>{record.date}</td>
              <td>{record.status}</td>
          </tr>
          ))}

          {/* <Checkbox content={}></Checkbox> */}
        </div>
       
      <Link to="/">Back to Dashboard</Link>
    </div>
  );
}

{/*usig reacts router library to navigate between student pages*/}
function AppWithRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/student/:name" element={<StudentDetails />} />
      </Routes>
    </Router>
  );
}

{/*gets the student name to use in the route*/}
function StudentDetails() {
  const { name } = useParams();
  return <StudentPage name={name || "Unknown"} />;
}

export default AppWithRoutes;

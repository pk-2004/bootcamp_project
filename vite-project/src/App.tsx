import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import './App.css'

{/*i was thinking we could store students in the backend where each student has a name, corresponding attendance which could be
  stored as a list of the attendance type, we could also add things like their mentor group just to make it easy access
  and filter students*/}
  
// type Attendance = {date: Date, present: boolean};
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

{/*main dashboard page*/}
function App() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <h1 id="title">AppDev Director Dashboard</h1>
      
      <div id="box">

        <div id="students-container">
          <h3 id="student-title">Students</h3>
          <input type="text" id="search-bar" placeholder="Search for a student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>

          {/* Student List */}

          <ul className="student-list">
            {filteredStudents.map((student, index) => (
              <li key={index}>
                <Student name={student.name}></Student>
              </li>
            ))}
          </ul>

        </div>

        {/*i was thinking we could show the class total homework and participation completion*/}
        <div id="box2">
           <div id="homework-container">
            <h2>overall hw completion</h2>
          </div>

          <div id="participation-container">
          <h2>overall participation</h2>
          </div>
        </div>
          
       
      </div>
    </>
  )
}

{/*student page which should be different for each student by using the data from backend*/}
function StudentPage({ name }: { name: string }) {
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

            <div className="performance-card">
                <h3>Homework Assignments</h3>
                <div className="progress-bar">
                    <div className="progress"></div>
                </div>
                <p>85% completed</p>
            </div>

            {/*not sure how we're meausiring performance*/}
            <div className="performance-card">
                <h3>Participation</h3>
                <div className="progress-bar">
                    <div className="progress"></div>
                </div>
                <p>60% participation rate</p>
            </div>
        </section>

       
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

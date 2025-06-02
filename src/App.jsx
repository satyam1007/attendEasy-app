import "./App.css";
import { useState, useEffect } from "react";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";
import AttendanceHistory from "./components/AttendanceHistory";

function App() {
  // Initialize state directly from localStorage
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("attendEaseStudents");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("attendEaseHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [attendance, setAttendance] = useState(() => {
    try {
      const savedStudents =
        JSON.parse(localStorage.getItem("attendEaseStudents")) || [];
      const initialAttendance = {};
      savedStudents.forEach((student) => {
        initialAttendance[student.rollNumber] = false;
      });
      return initialAttendance;
    } catch {
      return {};
    }
  });

  const [showSave, setShowSave] = useState(false);

  // Save students to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("attendEaseStudents", JSON.stringify(students));

    // Sync attendance state with students
    const updatedAttendance = { ...attendance };
    let needsUpdate = false;

    students.forEach((student) => {
      if (!(student.rollNumber in updatedAttendance)) {
        updatedAttendance[student.rollNumber] = false;
        needsUpdate = true;
      }
    });

    // Remove attendance for deleted students
    Object.keys(updatedAttendance).forEach((rollNumber) => {
      if (!students.some((s) => s.rollNumber === rollNumber)) {
        delete updatedAttendance[rollNumber];
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      setAttendance(updatedAttendance);
    }
  }, [students]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("attendEaseHistory", JSON.stringify(history));
  }, [history]);

  const toggleAttendance = (rollNumber) => {
    setAttendance((prev) => {
      const newAttendance = { ...prev, [rollNumber]: !prev[rollNumber] };
      // Check if any attendance has been marked to show save button
      setShowSave(
        Object.values(newAttendance).some((status) => status !== false)
      );
      return newAttendance;
    });
  };

  const saveAttendance = () => {
    const date = new Date().toLocaleDateString();
    const presentStudents = students.filter(
      (student) => attendance[student.rollNumber]
    );
    const absentStudents = students.filter(
      (student) => !attendance[student.rollNumber]
    );

    const newRecord = {
      date,
      present: presentStudents,
      absent: absentStudents,
    };

    setHistory([...history, newRecord]);

    // Reset attendance for next day
    const resetAttendance = {};
    students.forEach((student) => {
      resetAttendance[student.rollNumber] = false;
    });
    setAttendance(resetAttendance);
    setShowSave(false);
  };

  // Backup data every minute in case of unexpected crashes
  useEffect(() => {
    const backupInterval = setInterval(() => {
      try {
        const backupData = {
          students: JSON.parse(
            localStorage.getItem("attendEaseStudents") || "[]"
          ),
          history: JSON.parse(
            localStorage.getItem("attendEaseHistory") || "[]"
          ),
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem("attendEaseBackup", JSON.stringify(backupData));
      } catch (error) {
        console.error("Backup failed:", error);
      }
    }, 60000);

    return () => clearInterval(backupInterval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AttendEase</h1>

      <AddStudent students={students} setStudents={setStudents} />

      <StudentList
        students={students}
        setStudents={setStudents}
        attendance={attendance}
        toggleAttendance={toggleAttendance}
      />

      {showSave && (
        <div className="my-4">
          <button
            onClick={saveAttendance}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Today's Attendance
          </button>
        </div>
      )}

      <AttendanceHistory history={history} setHistory={setHistory} />
    </div>
  );
}

export default App;

import "./App.css";
import { useState, useEffect } from "react";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";
import AttendanceHistory from "./components/AttendanceHistory";

function App() {
  // Initialize states from localStorage
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem("attendEaseClasses");
    return saved ? JSON.parse(saved) : ["10-A"];
  });

  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("attendEaseStudents");
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("attendEaseHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem("attendEaseAttendance");
    return saved ? JSON.parse(saved) : {};
  });

  const [showSave, setShowSave] = useState(false);

  // Save all data to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem("attendEaseClasses", JSON.stringify(classes));
    localStorage.setItem("attendEaseStudents", JSON.stringify(students));
    localStorage.setItem("attendEaseHistory", JSON.stringify(history));
    localStorage.setItem("attendEaseAttendance", JSON.stringify(attendance));
  }, [classes, students, history, attendance]);

  // Class management functions
  const addNewClass = (className) => {
    if (!classes.includes(className)) {
      setClasses([...classes, className]);
    }
  };

  const deleteClass = (className) => {
    if (className === "10-A") {
      alert("Default class 10-A cannot be deleted!");
      return;
    }

    if (!confirm(`Delete ${className}? All data will be lost!`)) return;

    const updatedClasses = classes.filter((cls) => cls !== className);
    setClasses(updatedClasses);

    if (selectedClass === className) {
      setSelectedClass("10-A");
    }

    setStudents(students.filter((student) => student.class !== className));
    setHistory(history.filter((record) => record.class !== className));

    setAttendance((prev) => {
      const newAttendance = { ...prev };
      delete newAttendance[className];
      return newAttendance;
    });
  };

  // Student management functions
  const addStudent = (newStudent) => {
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);

    // Initialize attendance for new student
    setAttendance((prev) => ({
      ...prev,
      [newStudent.class]: {
        ...prev[newStudent.class],
        [newStudent.rollNumber]: false,
      },
    }));
  };

  // Attendance management functions
  const toggleAttendance = (rollNumber) => {
    setAttendance((prev) => {
      const newAttendance = {
        ...prev,
        [selectedClass]: {
          ...prev[selectedClass],
          [rollNumber]: !prev[selectedClass]?.[rollNumber],
        },
      };
      setShowSave(true);
      return newAttendance;
    });
  };

  const saveAttendance = () => {
    const date = new Date().toLocaleDateString();
    const currentClassStudents = students.filter(
      (s) => s.class === selectedClass
    );

    const presentStudents = currentClassStudents.filter(
      (student) => attendance[selectedClass]?.[student.rollNumber]
    );

    const absentStudents = currentClassStudents.filter(
      (student) => !attendance[selectedClass]?.[student.rollNumber]
    );

    const newRecord = {
      date,
      class: selectedClass,
      present: presentStudents,
      absent: absentStudents,
    };

    setHistory([...history, newRecord]);

    // Reset attendance for current class
    setAttendance((prev) => ({
      ...prev,
      [selectedClass]: currentClassStudents.reduce((acc, student) => {
        acc[student.rollNumber] = false;
        return acc;
      }, {}),
    }));

    setShowSave(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AttendEase</h1>

      {/* Class Selector */}
      <div className="mb-4 flex gap-2 items-center">
        <select
          value={selectedClass}
          onChange={(e) => {
            if (
              showSave &&
              !confirm("You have unsaved attendance. Change class anyway?")
            ) {
              return;
            }
            setSelectedClass(e.target.value);
            setShowSave(false);
          }}
          className="p-2 border rounded flex-1"
        >
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            const newClass = prompt("Enter new class (e.g., 11-B):");
            if (newClass) addNewClass(newClass);
          }}
          className="bg-gray-200 px-3 py-2 rounded"
        >
          + Add Class
        </button>

        {selectedClass !== "10-A" && (
          <button
            onClick={() => deleteClass(selectedClass)}
            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
          >
            Delete Class
          </button>
        )}
      </div>

      <AddStudent
        students={students}
        setStudents={addStudent}
        selectedClass={selectedClass}
      />

      <StudentList
        students={students.filter((s) => s.class === selectedClass)}
        setStudents={setStudents}
        attendance={attendance[selectedClass] || {}}
        toggleAttendance={toggleAttendance}
        selectedClass={selectedClass}
      />

      <AttendanceHistory
        history={history.filter((h) => h.class === selectedClass)}
        setHistory={setHistory}
      />

      {showSave && (
        <button
          onClick={saveAttendance}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg hover:bg-green-600"
        >
          Save Today's Attendance
        </button>
      )}
    </div>
  );
}

export default App;

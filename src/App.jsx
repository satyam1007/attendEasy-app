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

    // Get current checkbox states
    const newlyPresentStudents = currentClassStudents.filter(
      (student) => attendance[selectedClass]?.[student.rollNumber]
    );

    // Check if record for this date already exists
    const existingRecordIndex = history.findIndex(
      (record) => record.date === date && record.class === selectedClass
    );

    if (existingRecordIndex >= 0) {
      // Update existing record - merge with previous data
      const updatedHistory = [...history];
      const existingRecord = updatedHistory[existingRecordIndex];

      // Combine previous present students with newly marked ones
      const combinedPresent = [
        ...new Set([...existingRecord.present, ...newlyPresentStudents]),
      ];

      // Absent students are all class students not in present list
      const combinedAbsent = currentClassStudents.filter(
        (student) =>
          !combinedPresent.some((p) => p.rollNumber === student.rollNumber)
      );

      updatedHistory[existingRecordIndex] = {
        date,
        class: selectedClass,
        present: combinedPresent,
        absent: combinedAbsent,
      };
      setHistory(updatedHistory);
    } else {
      // Add new record (original logic)
      const absentStudents = currentClassStudents.filter(
        (student) => !attendance[selectedClass]?.[student.rollNumber]
      );

      const newRecord = {
        date,
        class: selectedClass,
        present: newlyPresentStudents,
        absent: absentStudents,
      };
      setHistory([...history, newRecord]);
    }

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 sm:h-10 w-8 sm:w-10 text-indigo-600 mr-2 sm:mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AttendEase
            </h1>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 self-end sm:self-auto">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Streamlined classroom attendance management system
        </p>
      </header>

      {/* Class Selector */}
      <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <select
                value={selectedClass}
                onChange={(e) => {
                  if (
                    showSave &&
                    !confirm(
                      "You have unsaved attendance. Change class anyway?"
                    )
                  ) {
                    return;
                  }
                  setSelectedClass(e.target.value);
                  setShowSave(false);
                }}
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  const newClass = prompt("Enter new class (e.g., 11-B):");
                  if (newClass) addNewClass(newClass);
                }}
                className="flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Class
              </button>

              {selectedClass !== "10-A" && (
                <button
                  onClick={() => deleteClass(selectedClass)}
                  className="flex items-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddStudent
            students={students}
            setStudents={addStudent}
            selectedClass={selectedClass}
          />
        </div>

        <div className="lg:col-span-2 space-y-8">
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
        </div>
      </div>

      {/* Save Button */}
      {showSave && (
        <button
          onClick={saveAttendance}
          className="fixed bottom-6 right-6 flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save Today's Attendance
        </button>
      )}
    </div>
  );
}

export default App;

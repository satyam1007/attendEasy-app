import "./App.css";
import { useState, useEffect } from "react";
import ClassSelector from "./components/ClassSelector";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";
import AttendanceHistory from "./components/AttendanceHistory";
import { formatDate } from "./utils";

function App() {
  // State initialization with localStorage data
  const [classes, setClasses] = useState(() => {
    const savedClasses = JSON.parse(localStorage.getItem("attendEaseClasses"));
    return savedClasses && savedClasses.length > 0 ? savedClasses : ["10-A"];
  });

  const [students, setStudents] = useState(() => {
    const savedStudents = JSON.parse(
      localStorage.getItem("attendEaseStudents")
    );
    return savedStudents || [];
  });

  const [attendance, setAttendance] = useState(() => {
    const savedAttendance = JSON.parse(
      localStorage.getItem("attendEaseAttendance")
    );
    return savedAttendance || {};
  });

  const [history, setHistory] = useState(() => {
    const savedHistory = JSON.parse(localStorage.getItem("attendEaseHistory"));
    // Migrate legacy data with classSection to class
    if (savedHistory) {
      return savedHistory.map((record) => ({
        ...record,
        class: record.class || record.classSection,
        present:
          record.present?.map((student) => ({
            ...student,
            class: student.class || student.classSection,
            image: student.image || null,
          })) || [],
        absent:
          record.absent?.map((student) => ({
            ...student,
            class: student.class || student.classSection,
            image: student.image || null,
          })) || [],
      }));
    }
    return [];
  });

  const [selectedClass, setSelectedClass] = useState("10-A");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("attendEaseClasses", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("attendEaseStudents", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("attendEaseAttendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem("attendEaseHistory", JSON.stringify(history));
  }, [history]);

  // Handle class selection change with unsaved changes warning
  const handleClassChange = (newClass) => {
    if (
      hasUnsavedChanges &&
      !window.confirm(
        "You have unsaved attendance changes. Are you sure you want to switch classes?"
      )
    ) {
      return;
    }
    setSelectedClass(newClass);
    setHasUnsavedChanges(false);
  };

  // Add a new class
  const addClass = (className) => {
    if (!className || classes.includes(className)) return;
    setClasses([...classes, className]);
    setSelectedClass(className);
  };

  // Delete a class (except default class)
  const deleteClass = (className) => {
    if (className === "10-A") return;

    if (
      window.confirm(
        `Are you sure you want to delete class ${className}? This will remove all associated students and attendance records.`
      )
    ) {
      // Remove the class
      setClasses(classes.filter((c) => c !== className));

      // Remove students of this class
      setStudents(students.filter((student) => student.class !== className));

      // Remove attendance data for this class
      const newAttendance = { ...attendance };
      delete newAttendance[className];
      setAttendance(newAttendance);

      // Remove history records for this class
      setHistory(history.filter((record) => record.class !== className));

      // Select default class if current selection is being deleted
      if (selectedClass === className) {
        setSelectedClass("10-A");
      }
    }
  };

  // Add a new student
  const addStudent = (student) => {
    // Check for duplicate roll number in the same class
    const duplicate = students.some(
      (s) => s.rollNumber === student.rollNumber && s.class === student.class
    );

    if (duplicate) {
      alert("A student with this roll number already exists in this class.");
      return false;
    }

    setStudents([...students, student]);

    // Initialize attendance status as absent
    setAttendance((prev) => ({
      ...prev,
      [student.class]: {
        ...(prev[student.class] || {}),
        [student.rollNumber]: false,
      },
    }));

    return true;
  };

  // Delete a student
  const deleteStudent = (rollNumber, className) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      // Remove the student
      setStudents(
        students.filter(
          (student) =>
            !(student.rollNumber === rollNumber && student.class === className)
        )
      );

      // Remove from attendance data
      const newAttendance = { ...attendance };
      if (newAttendance[className]) {
        delete newAttendance[className][rollNumber];
        setAttendance(newAttendance);
      }

      // Remove from history records
      setHistory(
        history.map((record) => {
          if (record.class !== className) return record;

          return {
            ...record,
            present: record.present.filter((s) => s.rollNumber !== rollNumber),
            absent: record.absent.filter((s) => s.rollNumber !== rollNumber),
          };
        })
      );
    }
  };

  // Update attendance status for a student
  const updateAttendanceStatus = (rollNumber, isPresent) => {
    setAttendance((prev) => ({
      ...prev,
      [selectedClass]: {
        ...(prev[selectedClass] || {}),
        [rollNumber]: isPresent,
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Save today's attendance to history
  const saveAttendance = () => {
    const today = formatDate(new Date());
    const classStudents = students.filter(
      (student) => student.class === selectedClass
    );

    const presentRollNumbers = Object.entries(attendance[selectedClass] || {})
      .filter(([_, isPresent]) => isPresent)
      .map(([rollNumber]) => rollNumber);

    const presentStudents = classStudents.filter((student) =>
      presentRollNumbers.includes(student.rollNumber)
    );

    const absentStudents = classStudents.filter(
      (student) => !presentRollNumbers.includes(student.rollNumber)
    );

    // Check if record for today already exists
    const existingRecordIndex = history.findIndex(
      (record) => record.date === today && record.class === selectedClass
    );

    if (existingRecordIndex >= 0) {
      // Update existing record
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory[existingRecordIndex] = {
          date: today,
          class: selectedClass,
          present: presentStudents,
          absent: absentStudents,
        };
        return newHistory;
      });
    } else {
      // Add new record
      setHistory((prev) => [
        ...prev,
        {
          date: today,
          class: selectedClass,
          present: presentStudents,
          absent: absentStudents,
        },
      ]);
    }

    // Reset attendance checkboxes
    const resetAttendance = {};
    classStudents.forEach((student) => {
      resetAttendance[student.rollNumber] = false;
    });
    setAttendance((prev) => ({
      ...prev,
      [selectedClass]: resetAttendance,
    }));

    setHasUnsavedChanges(false);
  };

  // Delete an attendance record
  const deleteAttendanceRecord = (date, className) => {
    if (
      window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      setHistory(
        history.filter(
          (record) => !(record.date === date && record.class === className)
        )
      );
    }
  };

  // Delete a student from a record
  const deleteStudentFromRecord = (date, className, rollNumber, isPresent) => {
    if (
      window.confirm(
        "Are you sure you want to remove this student from the record?"
      )
    ) {
      setHistory(
        history.map((record) => {
          if (record.date !== date || record.class !== className) return record;

          return {
            ...record,
            present: isPresent
              ? record.present.filter((s) => s.rollNumber !== rollNumber)
              : record.present,
            absent: !isPresent
              ? record.absent.filter((s) => s.rollNumber !== rollNumber)
              : record.absent,
          };
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AttendEase</h1>
          <div className="text-lg">{formatDate(new Date(), true)}</div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <ClassSelector
          classes={classes}
          selectedClass={selectedClass}
          onSelectClass={handleClassChange}
          onAddClass={addClass}
          onDeleteClass={deleteClass}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <AddStudent
              selectedClass={selectedClass}
              onAddStudent={addStudent}
            />
          </div>

          <div className="lg:col-span-2">
            <StudentList
              students={students.filter((s) => s.class === selectedClass)}
              attendance={attendance[selectedClass] || {}}
              onUpdateAttendance={updateAttendanceStatus}
              onDeleteStudent={deleteStudent}
            />
          </div>
        </div>

        <div className="mt-8">
          <AttendanceHistory
            history={history.filter((record) => record.class === selectedClass)}
            onDeleteRecord={deleteAttendanceRecord}
            onDeleteStudentFromRecord={deleteStudentFromRecord}
          />
        </div>

        {hasUnsavedChanges && (
          <button
            onClick={saveAttendance}
            className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors"
          >
            Save Today's Attendance
          </button>
        )}
      </main>
    </div>
  );
}

export default App;

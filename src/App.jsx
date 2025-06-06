import "./App.css";
import { useState, useEffect } from "react";
import ClassSelector from "./components/ClassSelector";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";
import AttendanceHistory from "./components/AttendanceHistory";
import SaveButton from "./components/SaveButton";
import { format } from "date-fns";

function App() {
  // Initialize state with localStorage data or defaults
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
    const savedHistory =
      JSON.parse(localStorage.getItem("attendEaseHistory")) || [];
    // Migrate legacy data (classSection to class)
    return savedHistory.map((record) => {
      if (record.classSection && !record.class) {
        return {
          ...record,
          class: record.classSection,
          present: record.present.map((student) => ({
            ...student,
            class: student.classSection || record.classSection,
          })),
          absent: record.absent.map((student) => ({
            ...student,
            class: student.classSection || record.classSection,
          })),
        };
      }
      return record;
    });
  });

  const [selectedClass, setSelectedClass] = useState(classes[0] || "10-A");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("attendEaseClasses", JSON.stringify(classes));
    localStorage.setItem("attendEaseStudents", JSON.stringify(students));
    localStorage.setItem("attendEaseAttendance", JSON.stringify(attendance));
    localStorage.setItem("attendEaseHistory", JSON.stringify(history));
  }, [classes, students, attendance, history]);

  // Handle class selection change
  const handleClassChange = (newClass) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm(
        "You have unsaved attendance changes. Are you sure you want to switch classes?"
      );
      if (!confirmChange) return;
    }
    setSelectedClass(newClass);
    setHasUnsavedChanges(false);
  };

  // Add a new class
  const addClass = (className) => {
    if (className && !classes.includes(className)) {
      setClasses([...classes, className]);
      setSelectedClass(className);
    }
  };

  // Delete a class (except default '10-A')
  const deleteClass = (className) => {
    if (className === "10-A") return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete class ${className}? This will remove all associated students and attendance records.`
    );
    if (!confirmDelete) return;

    setClasses(classes.filter((c) => c !== className));
    setStudents(students.filter((s) => s.class !== className));

    const newAttendance = { ...attendance };
    delete newAttendance[className];
    setAttendance(newAttendance);

    setHistory(history.filter((record) => record.class !== className));

    if (selectedClass === className) {
      setSelectedClass(
        classes[0] === className ? classes[1] || "10-A" : classes[0]
      );
    }
  };

  // Add a new student
  const addStudent = (student) => {
    const isDuplicate = students.some(
      (s) => s.rollNumber === student.rollNumber && s.class === student.class
    );
    if (isDuplicate) {
      alert("A student with this roll number already exists in this class.");
      return false;
    }

    setStudents([...students, student]);

    // Initialize attendance status for the new student
    setAttendance((prev) => ({
      ...prev,
      [student.class]: {
        ...prev[student.class],
        [student.rollNumber]: false,
      },
    }));

    return true;
  };

  // Delete a student
  const deleteStudent = (rollNumber) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    setStudents(
      students.filter(
        (s) => !(s.rollNumber === rollNumber && s.class === selectedClass)
      )
    );

    // Remove from attendance
    const newAttendance = { ...attendance };
    if (newAttendance[selectedClass]) {
      delete newAttendance[selectedClass][rollNumber];
    }
    setAttendance(newAttendance);

    // Remove from history records
    setHistory(
      history.map((record) => {
        if (record.class === selectedClass) {
          return {
            ...record,
            present: record.present.filter((s) => s.rollNumber !== rollNumber),
            absent: record.absent.filter((s) => s.rollNumber !== rollNumber),
          };
        }
        return record;
      })
    );
  };

  // Toggle attendance status
  const toggleAttendance = (rollNumber) => {
    setAttendance((prev) => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        [rollNumber]: !prev[selectedClass]?.[rollNumber],
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Save today's attendance
  const saveAttendance = () => {
    const today = format(new Date(), "MM/dd/yyyy");
    const currentStudents = students.filter((s) => s.class === selectedClass);

    const presentRollNumbers = Object.entries(attendance[selectedClass] || {})
      .filter(([_, isPresent]) => isPresent)
      .map(([rollNumber]) => rollNumber);

    const presentStudents = currentStudents.filter((s) =>
      presentRollNumbers.includes(s.rollNumber)
    );

    const absentStudents = currentStudents.filter(
      (s) => !presentRollNumbers.includes(s.rollNumber)
    );

    // Check if record for today already exists
    const existingRecordIndex = history.findIndex(
      (record) => record.date === today && record.class === selectedClass
    );

    if (existingRecordIndex >= 0) {
      // Update existing record
      setHistory((prev) => {
        const updated = [...prev];
        updated[existingRecordIndex] = {
          date: today,
          class: selectedClass,
          present: presentStudents,
          absent: absentStudents,
        };
        return updated;
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
    setAttendance((prev) => ({
      ...prev,
      [selectedClass]: currentStudents.reduce((acc, student) => {
        acc[student.rollNumber] = false;
        return acc;
      }, {}),
    }));

    setHasUnsavedChanges(false);
  };

  // Delete a history record
  const deleteHistoryRecord = (date) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );
    if (!confirmDelete) return;

    setHistory(
      history.filter(
        (record) => !(record.date === date && record.class === selectedClass)
      )
    );
  };

  // Delete a student from history record
  const deleteStudentFromHistory = (date, rollNumber, wasPresent) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this student from the record?"
    );
    if (!confirmDelete) return;

    setHistory(
      history.map((record) => {
        if (record.date === date && record.class === selectedClass) {
          return {
            ...record,
            present: wasPresent
              ? record.present.filter((s) => s.rollNumber !== rollNumber)
              : record.present,
            absent: !wasPresent
              ? record.absent.filter((s) => s.rollNumber !== rollNumber)
              : record.absent,
          };
        }
        return record;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AttendEase</h1>
          <div className="text-lg">
            {format(new Date(), "EEEE, MMMM dd, yyyy")}
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div>
            <AddStudent
              selectedClass={selectedClass}
              onAddStudent={addStudent}
            />
            <StudentList
              students={students.filter((s) => s.class === selectedClass)}
              attendance={attendance[selectedClass] || {}}
              onToggleAttendance={toggleAttendance}
              onDeleteStudent={deleteStudent}
            />
          </div>

          <div>
            <AttendanceHistory
              records={history.filter(
                (record) => record.class === selectedClass
              )}
              onDeleteRecord={deleteHistoryRecord}
              onDeleteStudent={deleteStudentFromHistory}
            />
          </div>
        </div>
      </main>

      {hasUnsavedChanges && <SaveButton onSave={saveAttendance} />}
    </div>
  );
}

export default App;

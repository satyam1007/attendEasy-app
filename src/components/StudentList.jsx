import "../App.css";

function StudentList({
  students,
  setStudents,
  attendance,
  toggleAttendance,
  selectedClass,
}) {
  const deleteStudent = (rollNumber) => {
    if (!confirm("Delete this student?")) return;

    setStudents((prev) =>
      prev.filter(
        (student) =>
          !(
            student.rollNumber === rollNumber && student.class === selectedClass
          )
      )
    );
  };

  if (students.length === 0) {
    return (
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Student List</h2>
        <p>No students in {selectedClass} yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">
        Student List - {selectedClass}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Photo</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Roll Number</th>
              <th className="py-2 px-4 border">Attendance</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={`${student.class}-${student.rollNumber}`}>
                <td className="py-2 px-4 border">
                  {student.photo ? (
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="h-10 rounded"
                    />
                  ) : (
                    "No Photo"
                  )}
                </td>
                <td className="py-2 px-4 border">{student.name}</td>
                <td className="py-2 px-4 border">{student.rollNumber}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => toggleAttendance(student.rollNumber)}
                    className={`p-1 rounded ${
                      attendance[student.rollNumber]
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {attendance[student.rollNumber]
                      ? "✅ Present"
                      : "❌ Absent"}
                  </button>
                </td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => deleteStudent(student.rollNumber)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;

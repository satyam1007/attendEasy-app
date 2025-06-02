import "../App.css";
// AttendanceHistory.jsx
import PDFGenerator from "./PDFGenerator";

function AttendanceHistory({ history, setHistory }) {
  const deleteRecord = (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
  };

  const deleteStudentFromRecord = (recordIndex, rollNumber, status) => {
    const updatedHistory = [...history];
    const record = updatedHistory[recordIndex];

    if (status === "present") {
      record.present = record.present.filter(
        (student) => student.rollNumber !== rollNumber
      );
    } else {
      record.absent = record.absent.filter(
        (student) => student.rollNumber !== rollNumber
      );
    }

    setHistory(updatedHistory);
  };

  if (history.length === 0) {
    return (
      <div className="p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
        <p>No attendance records yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
      <div className="space-y-6">
        {history.map((record, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">{record.date}</h3>
              <div className="flex space-x-2">
                <PDFGenerator record={record} />
                <button
                  onClick={() => deleteRecord(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete Entire Day
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium text-green-700 mb-3">
                  Present Students ({record.present.length})
                </h4>
                <div className="space-y-2">
                  {record.present.map((student) => (
                    <div
                      key={student.rollNumber}
                      className="bg-white p-2 rounded shadow"
                    >
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="col-span-2">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">
                            Roll No: {student.rollNumber}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            deleteStudentFromRecord(
                              index,
                              student.rollNumber,
                              "present"
                            )
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm justify-self-end"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded">
                <h4 className="font-medium text-red-700 mb-3">
                  Absent Students ({record.absent.length})
                </h4>
                <div className="space-y-2">
                  {record.absent.map((student) => (
                    <div
                      key={student.rollNumber}
                      className="bg-white p-2 rounded shadow"
                    >
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="col-span-2">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">
                            Roll No: {student.rollNumber}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            deleteStudentFromRecord(
                              index,
                              student.rollNumber,
                              "absent"
                            )
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm justify-self-end"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendanceHistory;

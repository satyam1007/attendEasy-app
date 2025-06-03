import "../App.css";
// AttendanceHistory.jsx
import PDFGenerator from "./PDFGenerator";

function AttendanceHistory({ history, setHistory }) {
  const deleteRecord = (index) => {
    if (
      window.confirm(
        "Are you sure you want to delete this entire day's record?"
      )
    ) {
      const newHistory = [...history];
      newHistory.splice(index, 1);
      setHistory(newHistory);
    }
  };

  const deleteStudentFromRecord = (recordIndex, rollNumber, status) => {
    if (
      window.confirm(
        "Are you sure you want to delete this student from the record?"
      )
    ) {
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
    }
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
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Attendance History
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base">
              Track and manage past attendance records
            </p>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium text-white">
            {history.length} {history.length === 1 ? "Record" : "Records"}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {history.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-3 sm:mt-4 text-lg font-medium text-gray-900">
              No attendance records found
            </h3>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500">
              Attendance records will appear here once created
            </p>
          </div>
        ) : (
          history.map((record, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    {record.date}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 self-end sm:self-auto">
                  <PDFGenerator
                    record={record}
                    className="flex items-center text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  />
                  <button
                    onClick={() => deleteRecord(index)}
                    className="flex items-center px-2 sm:px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs sm:text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 sm:h-4 w-3 sm:w-4 mr-1"
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
                    Delete Day
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 p-4 sm:p-6">
                <div className="border border-green-100 rounded-lg overflow-hidden">
                  <div className="bg-green-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-green-100 flex justify-between items-center">
                    <h4 className="font-medium text-green-800 flex items-center text-sm sm:text-base">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Present Students ({record.present.length})
                    </h4>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {Math.round(
                        (record.present.length /
                          (record.present.length + record.absent.length)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="divide-y divide-green-50">
                    {record.present.length > 0 ? (
                      record.present.map((student) => (
                        <div
                          key={student.rollNumber}
                          className="p-3 sm:p-4 hover:bg-green-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900 text-sm sm:text-base">
                                {student.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1">
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
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                              title="Remove student"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 sm:h-5 w-4 sm:w-5"
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
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-500">
                        No students were present this day
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-red-100 rounded-lg overflow-hidden">
                  <div className="bg-red-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-red-100 flex justify-between items-center">
                    <h4 className="font-medium text-red-800 flex items-center text-sm sm:text-base">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Absent Students ({record.absent.length})
                    </h4>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {Math.round(
                        (record.absent.length /
                          (record.present.length + record.absent.length)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="divide-y divide-red-50">
                    {record.absent.length > 0 ? (
                      record.absent.map((student) => (
                        <div
                          key={student.rollNumber}
                          className="p-3 sm:p-4 hover:bg-red-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900 text-sm sm:text-base">
                                {student.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1">
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
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                              title="Remove student"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 sm:h-5 w-4 sm:w-5"
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
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-500">
                        All students were present this day
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AttendanceHistory;

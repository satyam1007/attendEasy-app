import "../App.css";
import { useState } from "react";
import PDFGenerator from "./PDFGenerator";

function AttendanceHistory({
  history,
  onDeleteRecord,
  onDeleteStudentFromRecord,
}) {
  const [expandedRecord, setExpandedRecord] = useState(null);

  const toggleRecord = (date) => {
    setExpandedRecord(expandedRecord === date ? null : date);
  };

  if (history.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
        <p className="text-gray-500">No attendance records yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Attendance History</h2>

      <div className="space-y-4">
        {history.map((record) => (
          <div
            key={record.date}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleRecord(record.date)}
            >
              <div>
                <h3 className="font-medium">{record.date}</h3>
                <p className="text-sm text-gray-500">
                  {record.present.length} present, {record.absent.length} absent
                  {record.present.length + record.absent.length > 0 && (
                    <span>
                      {" ("}
                      {Math.round(
                        (record.present.length /
                          (record.present.length + record.absent.length)) *
                          100
                      )}
                      {"% present)"}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <PDFGenerator record={record} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRecord(record.date, record.class);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete Record
                </button>
              </div>
            </div>

            {expandedRecord === record.date && (
              <div className="p-4 border-t border-gray-200">
                <div className="mb-6">
                  <h4 className="font-medium text-green-600 mb-2">
                    Present Students
                  </h4>
                  {record.present.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No students were present
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {record.present.map((student) => (
                        <StudentCard
                          key={student.rollNumber}
                          student={student}
                          isPresent={true}
                          onDelete={() =>
                            onDeleteStudentFromRecord(
                              record.date,
                              record.class,
                              student.rollNumber,
                              true
                            )
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-red-600 mb-2">
                    Absent Students
                  </h4>
                  {record.absent.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No students were absent
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {record.absent.map((student) => (
                        <StudentCard
                          key={student.rollNumber}
                          student={student}
                          isPresent={false}
                          onDelete={() =>
                            onDeleteStudentFromRecord(
                              record.date,
                              record.class,
                              student.rollNumber,
                              false
                            )
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentCard({ student, isPresent, onDelete }) {
  return (
    <div
      className={`p-3 rounded-md border ${
        isPresent ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        {student.image ? (
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={student.image}
            alt={student.name}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-sm">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {student.name}
          </p>
          <p className="text-sm text-gray-500 truncate">
            Roll: {student.rollNumber}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-gray-600"
          title="Remove from record"
        >
          <svg
            className="h-5 w-5"
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
        </button>
      </div>
    </div>
  );
}

export default AttendanceHistory;

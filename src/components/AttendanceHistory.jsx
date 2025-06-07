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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">
          Attendance History
        </h2>
        <div className="flex flex-col items-center justify-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 mb-2 font-medium">
            No attendance records yet
          </p>
          <p className="text-gray-400 text-sm max-w-xs">
            Start taking attendance to see records appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm border border-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        Attendance History
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {history.map((record) => (
          <div
            key={record.date}
            className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-xs transition-shadow"
          >
            <div
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors gap-2 sm:gap-0"
              onClick={() => toggleRecord(record.date)}
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                  {record.date}
                </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {record.present.length} Present
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {record.absent.length} Absent
                  </span>
                  {record.present.length + record.absent.length > 0 && (
                    <span className="text-xs sm:text-sm text-gray-500">
                      {Math.round(
                        (record.present.length /
                          (record.present.length + record.absent.length)) *
                          100
                      )}
                      % attendance
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between sm:justify-normal sm:gap-3 items-center">
                <div className="hidden sm:block">
                  <PDFGenerator record={record} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRecord(record.date, record.class);
                  }}
                  className="text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-200 text-xs sm:text-sm font-medium flex items-center cursor-pointer px-2 py-1 rounded-md border border-red-200 hover:border-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5"
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
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transform transition-transform ${
                    expandedRecord === record.date ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {expandedRecord === record.date && (
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
                {/* Mobile-only PDF button */}
                <div className="sm:hidden mb-3">
                  <PDFGenerator record={record} mobile />
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center mb-2 sm:mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                    <h4 className="font-semibold text-gray-700 text-sm sm:text-base">
                      Present Students
                    </h4>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      {record.present.length}
                    </span>
                  </div>
                  {record.present.length === 0 ? (
                    <p className="text-gray-400 text-xs sm:text-sm pl-3.5">
                      No students were present
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
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
                  <div className="flex items-center mb-2 sm:mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                    <h4 className="font-semibold text-gray-700 text-sm sm:text-base">
                      Absent Students
                    </h4>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                      {record.absent.length}
                    </span>
                  </div>
                  {record.absent.length === 0 ? (
                    <p className="text-gray-400 text-xs sm:text-sm pl-3.5">
                      No students were absent
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
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
      className={`p-4 rounded-lg border-2 ${
        isPresent
          ? "border-green-100 bg-green-50 hover:bg-green-100"
          : "border-red-100 bg-red-50 hover:bg-red-100"
      } transition-colors duration-200`}
    >
      <div className="flex items-center gap-4">
        {student.image ? (
          <img
            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
            src={student.image}
            alt={student.name}
          />
        ) : (
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              isPresent ? "bg-green-200" : "bg-red-200"
            } border-2 border-white shadow-sm`}
          >
            <span
              className={`text-lg font-medium ${
                isPresent ? "text-green-800" : "text-red-800"
              }`}
            >
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-base font-semibold text-gray-900 truncate">
            {student.name}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white border border-gray-200 text-gray-700">
              Roll: {student.rollNumber}
            </span>
            {isPresent ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Present
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                Absent
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onDelete}
          className={`p-1.5 rounded-full ${
            isPresent
              ? "hover:bg-green-200 text-green-600"
              : "hover:bg-red-200 text-red-600"
          } transition-colors`}
          title="Remove from record"
          aria-label="Remove student"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AttendanceHistory;

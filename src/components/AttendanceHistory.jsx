import "../App.css";
import { useState } from "react";
import PDFGenerator from "./PDFGenerator";

const AttendanceHistory = ({ records, onDeleteRecord, onDeleteStudent }) => {
  const [expandedRecord, setExpandedRecord] = useState(null);

  const toggleExpand = (date) => {
    setExpandedRecord(expandedRecord === date ? null : date);
  };

  const calculatePercentage = (present, total) => {
    return total > 0 ? Math.round((present / total) * 100) : 0;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Attendance History</h2>

      {records.length === 0 ? (
        <p className="text-gray-500">No attendance records yet.</p>
      ) : (
        <div className="space-y-4">
          {records.map((record) => {
            const totalStudents = record.present.length + record.absent.length;
            const presentPercentage = calculatePercentage(
              record.present.length,
              totalStudents
            );
            const absentPercentage = calculatePercentage(
              record.absent.length,
              totalStudents
            );

            return (
              <div
                key={record.date}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(record.date)}
                >
                  <div>
                    <h3 className="font-medium">{record.date}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-green-600 mr-4">
                        Present: {record.present.length} ({presentPercentage}%)
                      </span>
                      <span className="text-red-600">
                        Absent: {record.absent.length} ({absentPercentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <PDFGenerator record={record} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecord(record.date);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {expandedRecord === record.date && (
                  <div className="p-4 border-t">
                    <div className="mb-4">
                      <h4 className="font-medium text-green-600 mb-2">
                        Present Students
                      </h4>
                      {record.present.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {record.present.map((student) => (
                            <StudentItem
                              key={student.rollNumber}
                              student={student}
                              onDelete={() =>
                                onDeleteStudent(
                                  record.date,
                                  student.rollNumber,
                                  true
                                )
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          No students were present
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-red-600 mb-2">
                        Absent Students
                      </h4>
                      {record.absent.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {record.absent.map((student) => (
                            <StudentItem
                              key={student.rollNumber}
                              student={student}
                              onDelete={() =>
                                onDeleteStudent(
                                  record.date,
                                  student.rollNumber,
                                  false
                                )
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No students were absent</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StudentItem = ({ student, onDelete }) => {
  return (
    <div className="flex items-center p-2 bg-gray-50 rounded">
      <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
        {student.image ? (
          <img
            src={student.image}
            alt={student.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <div className="text-sm font-medium">{student.name}</div>
        <div className="text-xs text-gray-500">
          Roll No: {student.rollNumber}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Remove
      </button>
    </div>
  );
};

export default AttendanceHistory;

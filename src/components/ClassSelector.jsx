import "../App.css";
import { useState } from "react";

function ClassSelector({
  classes,
  selectedClass,
  onSelectClass,
  onAddClass,
  onDeleteClass,
}) {
  const [newClassName, setNewClassName] = useState("");

  const handleAddClass = () => {
    if (newClassName.trim()) {
      onAddClass(newClassName.trim());
      setNewClassName("");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <select
          value={selectedClass}
          onChange={(e) => onSelectClass(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {classes.map((className) => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="New class name"
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddClass}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add
          </button>
        </div>

        {selectedClass !== "10-A" && (
          <button
            onClick={() => onDeleteClass(selectedClass)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Delete Class
          </button>
        )}
      </div>
    </div>
  );
}

export default ClassSelector;

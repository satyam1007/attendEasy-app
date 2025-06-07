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
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        {/* Class Selector */}
        <div className="flex-grow min-w-0">
          <select
            value={selectedClass}
            onChange={(e) => onSelectClass(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
          >
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {/* Add Class Input Group */}
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="New class name"
            className="flex-grow p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
          <button
            onClick={handleAddClass}
            disabled={!newClassName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
          >
            Add Class
          </button>
        </div>

        {/* Delete Button (conditionally rendered) */}
        {selectedClass !== "10-A" && (
          <button
            onClick={() => onDeleteClass(selectedClass)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap w-full xs:w-auto sm:w-auto"
          >
            Delete Class
          </button>
        )}
      </div>
    </div>
  );
}

export default ClassSelector;

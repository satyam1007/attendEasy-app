import "../App.css";
import { useState } from "react";

const ClassSelector = ({
  classes,
  selectedClass,
  onSelectClass,
  onAddClass,
  onDeleteClass,
}) => {
  const [newClassName, setNewClassName] = useState("");

  const handleAddClass = () => {
    if (newClassName.trim()) {
      onAddClass(newClassName.trim());
      setNewClassName("");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={selectedClass}
          onChange={(e) => onSelectClass(e.target.value)}
          className="flex-grow p-2 border rounded-md"
        >
          {classes.map((className) => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="New class name"
            className="p-2 border rounded-md"
          />
          <button
            onClick={handleAddClass}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add
          </button>
        </div>

        {selectedClass !== "10-A" && (
          <button
            onClick={() => onDeleteClass(selectedClass)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Delete Class
          </button>
        )}
      </div>
    </div>
  );
};

export default ClassSelector;

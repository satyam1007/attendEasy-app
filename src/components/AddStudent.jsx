import "../App.css";
import { useState } from "react";

function AddStudent({ students, setStudents }) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");

  const validateName = (input) => /^[A-Za-z\s]+$/.test(input);
  const validateRollNumber = (input) => /^\d+$/.test(input);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !rollNumber.trim()) {
      setError("Both fields are required");
      return;
    }

    if (!validateName(name)) {
      setError("Name should contain only alphabets");
      return;
    }

    if (!validateRollNumber(rollNumber)) {
      setError("Roll number should contain only digits");
      return;
    }

    if (students.some((student) => student.rollNumber === rollNumber)) {
      setError("Roll number already exists");
      return;
    }

    setStudents([...students, { name, rollNumber }]);
    setName("");
    setRollNumber("");
    setError("");
  };

  return (
    <div className="mb-8 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Student Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter student name"
          />
        </div>
        <div>
          <label className="block mb-1">Roll Number</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => {
              setRollNumber(e.target.value);
              setError("");
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter roll number"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}

export default AddStudent;

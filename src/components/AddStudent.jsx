import "../App.css";
import { useState } from "react";

function AddStudent({ students, setStudents, selectedClass }) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validation
    if (!name.trim() || !rollNumber.trim()) {
      setError("Name and Roll Number are required!");
      setIsSubmitting(false);
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      setError("Name should only contain letters!");
      setIsSubmitting(false);
      return;
    }

    if (!/^\d+$/.test(rollNumber)) {
      setError("Roll Number should only contain digits!");
      setIsSubmitting(false);
      return;
    }

    // Check for duplicate roll number in current class
    const isDuplicate = students.some(
      (student) =>
        student.rollNumber === rollNumber && student.class === selectedClass
    );

    if (isDuplicate) {
      setError(`Roll No. ${rollNumber} already exists in ${selectedClass}!`);
      setIsSubmitting(false);
      return;
    }

    // Create new student object
    const newStudent = {
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      class: selectedClass,
      photo: photo || null,
    };

    // Add student
    setStudents(newStudent);

    // Reset form
    setName("");
    setRollNumber("");
    setPhoto(null);
    setIsSubmitting(false);
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
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter student name"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Roll Number</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter roll number"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Student Photo (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="w-full p-2 border rounded"
          />
          {photo && (
            <img src={photo} alt="Preview" className="mt-2 h-20 rounded" />
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
}

export default AddStudent;

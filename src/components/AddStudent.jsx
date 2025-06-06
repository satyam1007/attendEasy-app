import "../App.css";
import { useState } from "react";

const AddStudent = ({ selectedClass, onAddStudent }) => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
      setError("Only JPG/PNG images are allowed");
      return;
    }
    if (file.size > 1024 * 1024) {
      // 1MB
      setError("Image size must be less than 1MB");
      return;
    }

    setError("");

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Convert to base64 for storage
    const base64Reader = new FileReader();
    base64Reader.onload = (e) => {
      setImage(e.target.result);
    };
    base64Reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim()) {
      setError("Name and Roll Number are required");
      return;
    }

    const student = {
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      class: selectedClass,
      image: image || null,
    };

    const success = onAddStudent(student);
    if (success) {
      setName("");
      setRollNumber("");
      setImage(null);
      setImagePreview(null);
      setError("");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Student</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roll Number
          </label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image (optional)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-full"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;

import "../App.css";
import { useState } from "react";

function AddStudent({ selectedClass, onAddStudent }) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError("");

    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Only JPG/PNG images are allowed.");
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      setError("Image size must be less than 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !rollNumber.trim()) {
      setError("Name and Roll Number are required.");
      return;
    }

    const student = {
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      class: selectedClass,
      image: image,
    };

    if (onAddStudent(student)) {
      // Reset form on success
      setName("");
      setRollNumber("");
      setImage(null);
      setImagePreview(null);
      setError("");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Student</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="rollNumber">
            Roll Number
          </label>
          <input
            id="rollNumber"
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="image">
            Profile Image (optional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-full border border-gray-300"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}

export default AddStudent;

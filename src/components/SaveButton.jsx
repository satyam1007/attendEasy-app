import "../App.css";

const SaveButton = ({ onSave }) => {
  return (
    <div className="fixed bottom-6 right-6">
      <button
        onClick={onSave}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        Save Today's Attendance
      </button>
    </div>
  );
};

export default SaveButton;

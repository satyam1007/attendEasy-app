import "../App.css";
import { jsPDF } from "jspdf";

function PDFGenerator({ record }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Attendance Report", 105, 15, { align: "center" });

    // Date
    doc.setFontSize(12);
    doc.text(`Date: ${record.date}`, 14, 25);

    // Present Students
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0); // Green
    doc.text("Present Students:", 14, 35);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black

    let yPos = 45;
    record.present.forEach((student, index) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`✅ ${student.name} (${student.rollNumber})`, 20, yPos);
      yPos += 10;
    });

    // Absent Students
    doc.setFontSize(14);
    doc.setTextColor(128, 0, 0); // Red
    doc.text("Absent Students:", 14, yPos + 10);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    yPos += 20;

    record.absent.forEach((student, index) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`❌ ${student.name} (${student.rollNumber})`, 20, yPos);
      yPos += 10;
    });

    // Save the PDF
    doc.save(`Attendance_${record.date.replace(/\//g, "-")}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    >
      Download PDF
    </button>
  );
}

export default PDFGenerator;

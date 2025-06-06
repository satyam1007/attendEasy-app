import { jsPDF } from "jspdf";
import "jspdf-autotable";

const PDFGenerator = ({ record }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(`Attendance Report - ${record.class}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${record.date}`, 14, 30);

    // Add present students table
    doc.setFontSize(14);
    doc.text("Present Students", 14, 40);

    const presentData = record.present.map((student) => [
      student.rollNumber,
      student.name,
      student.image ? "Yes" : "No",
    ]);

    doc.autoTable({
      startY: 45,
      head: [["Roll No.", "Name", "Image"]],
      body: presentData,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] }, // green
    });

    // Add absent students table
    doc.setFontSize(14);
    doc.text("Absent Students", 14, doc.lastAutoTable.finalY + 15);

    const absentData = record.absent.map((student) => [
      student.rollNumber,
      student.name,
      student.image ? "Yes" : "No",
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Roll No.", "Name", "Image"]],
      body: absentData,
      theme: "grid",
      headStyles: { fillColor: [239, 68, 68] }, // red
    });

    // Add summary
    const total = record.present.length + record.absent.length;
    const presentPercentage =
      total > 0 ? Math.round((record.present.length / total) * 100) : 0;

    doc.setFontSize(12);
    doc.text(
      `Summary: ${record.present.length} Present (${presentPercentage}%), ${record.absent.length} Absent`,
      14,
      doc.lastAutoTable.finalY + 15
    );

    doc.save(
      `Attendance_${record.class}_${record.date.replace(/\//g, "-")}.pdf`
    );
  };

  return (
    <button onClick={generatePDF} className="text-blue-500 hover:text-blue-700">
      Generate PDF
    </button>
  );
};

export default PDFGenerator;

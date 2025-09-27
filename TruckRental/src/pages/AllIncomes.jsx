import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiSearch, FiDownload } from "react-icons/fi";

const apiBase = "http://localhost:5000/api";

export default function AllIncomes() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // search by month (YYYY-MM)
  
  // Fetch all payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${apiBase}/payments`);
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Filter payments by search (month)
  const filteredPayments = payments.filter((p) => {
    if (!p.bookingId?.date) return false;
    const paymentMonth = new Date(p.bookingId.date).toISOString().slice(0, 7);
    return paymentMonth.includes(search);
  });

  // Calculate total amount for filtered payments
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  // PDF export
  const generatePDF = () => {
    if (filteredPayments.length === 0) {
      alert("No payment data available for PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Income Report", 14, 15);

    const tableColumn = ["Pickup", "Drop-off", "Date", "Amount"];
    const tableRows = filteredPayments.map((p) => [
      p.bookingId?.pickupLocation || "-",
      p.bookingId?.dropLocation || "-",
      p.bookingId?.date ? new Date(p.bookingId.date).toLocaleDateString() : "-",
      p.amount,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.setFontSize(14);
    doc.text(`Total Amount: ${totalAmount}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save("income_report.pdf");
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl shadow-lg p-5 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            💰 All Incomes
          </h2>
          <p className="mt-1 text-blue-100 text-sm">
            View all received payments and monthly totals
          </p>
        </div>
        <div>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <FiDownload /> Download PDF
          </button>
        </div>
      </div>

      {/* Monthly Total */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex justify-between items-center">
        <span className="text-lg font-semibold">
          Total Amount: <span className="text-blue-600">{totalAmount}</span>
        </span>
        <div>
          <label className="mr-2 font-medium">Filter by Month:</label>
          <input
            type="month"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>
      </div>

      {/* Table */}
      {filteredPayments.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow text-center text-gray-600">
          No payments found for selected month.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-[800px] w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Pickup Location</th>
                <th className="p-4 text-left">Drop Location</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p, idx) => (
                <tr
                  key={p._id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="p-4">{p.bookingId?.pickupLocation || "-"}</td>
                  <td className="p-4">{p.bookingId?.dropLocation || "-"}</td>
                  <td className="p-4">
                    {p.bookingId?.date
                      ? new Date(p.bookingId.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4">{p.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

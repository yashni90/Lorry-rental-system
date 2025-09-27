import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiSearch, FiDownload } from "react-icons/fi";

const apiBase = "http://localhost:5000/api";

export default function AllExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    amount: 0,
    category: "",
    date: "",
    notes: "",
  });

  // Fetch all expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${apiBase}/expenses`);
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`${apiBase}/expenses/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
  const startEdit = (expense) => {
    setEditingId(expense._id);
    setEditData({ ...expense });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: "", amount: 0, category: "", date: "", notes: "" });
  };

  // Update expense
  const handleUpdate = async (id) => {
    try {
      await axios.put(`${apiBase}/expenses/${id}`, editData);
      setExpenses(expenses.map((e) => (e._id === id ? editData : e)));
      cancelEdit();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || err.message));
    }
  };

  // Filtered list
  const filteredExpenses = expenses.filter((expense) =>
    [expense.title, expense.category, expense.notes]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // PDF export
  const generatePDF = () => {
    if (expenses.length === 0) {
      alert("No expense data available to generate PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 15);

    const tableColumn = ["Title", "Amount", "Category", "Date", "Notes"];
    const tableRows = filteredExpenses.map((exp) => [
      exp.title,
      exp.amount,
      exp.category,
      new Date(exp.date).toLocaleDateString(),
      exp.notes || "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save("expenses_report.pdf");
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl shadow-lg p-5 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            💰 Expense Management
          </h2>
          <p className="mt-1 text-blue-100 text-sm">
            View, manage, edit, and export all expenses.
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <FiDownload /> Download PDF
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <div className="relative w-80">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      {filteredExpenses.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow text-center text-gray-600">
          No expenses found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-[1000px] w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Notes</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp, idx) => (
                <tr
                  key={exp._id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="p-4">
                    {editingId === exp._id ? (
                      <input
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      exp.title
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === exp._id ? (
                      <input
                        type="number"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      exp.amount
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === exp._id ? (
                      <input
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      exp.category
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === exp._id ? (
                      <input
                        type="date"
                        value={editData.date.split("T")[0]}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      new Date(exp.date).toLocaleDateString()
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === exp._id ? (
                      <input
                        value={editData.notes}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      exp.notes || "-"
                    )}
                  </td>
                  <td className="p-4 space-x-2">
                    {editingId === exp._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(exp._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(exp)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiSearch, FiDownload } from "react-icons/fi";

const apiBase = "http://localhost:5000/api";

export default function AllDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    vehicleNumber: "",
    availableDays: [],
  });

  const [search, setSearch] = useState("");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Fetch all drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(`${apiBase}/drivers`);
        setDrivers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  // Edit functions
  const startEdit = (driver) => {
    setEditingId(driver._id);
    setEditData({
      name: driver.name,
      age: driver.age,
      email: driver.email,
      phone: driver.phone,
      vehicleNumber: driver.vehicleNumber,
      availableDays: driver.availableDays,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      name: "",
      age: "",
      email: "",
      phone: "",
      vehicleNumber: "",
      availableDays: [],
    });
  };

  const handleCheckbox = (day) => {
    setEditData((prev) => {
      const updatedDays = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: updatedDays };
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${apiBase}/drivers/${id}`, {
        ...editData,
        age: Number(editData.age),
      });
      setDrivers(
        drivers.map((d) => (d._id === id ? { ...d, ...editData } : d))
      );
      cancelEdit();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      await axios.delete(`${apiBase}/drivers/${id}`);
      setDrivers(drivers.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter drivers by day search
  const filteredDrivers = drivers.filter((driver) =>
    driver.availableDays.some((day) =>
      day.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Generate PDF
  const generatePDF = () => {
    if (drivers.length === 0) {
      alert("No driver data available to generate PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Driver Details Report", 14, 15);

    const tableColumn = [
      "Name",
      "Age",
      "Email",
      "Phone",
      "Vehicle",
      "Available Days",
    ];
    const tableRows = [];

    drivers.forEach((driver) => {
      tableRows.push([
        driver.name,
        driver.age,
        driver.email,
        driver.phone,
        driver.vehicleNumber,
        driver.availableDays.join(", "),
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save("drivers_report.pdf");
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl shadow-lg p-5 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🚚 Driver Management
          </h2>
          <p className="mt-1 text-blue-100 text-sm">
            Manage, update, and view all drivers in one place.
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <FiDownload /> Download PDF
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end mb-4">
        <div className="relative w-80">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by day"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      {filteredDrivers.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow text-center text-gray-600">
          No drivers found for "{search}".
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-[1200px] w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Age</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Vehicle</th>
                <th className="p-4 text-left">Days</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver, idx) => (
                <tr
                  key={driver._id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  {/* Name */}
                  <td className="p-4">
                    {editingId === driver._id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      driver.name
                    )}
                  </td>

                  {/* Age */}
                  <td className="p-4">
                    {editingId === driver._id ? (
                      <input
                        type="number"
                        value={editData.age}
                        onChange={(e) =>
                          setEditData({ ...editData, age: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      driver.age
                    )}
                  </td>

                  {/* Email */}
                  <td className="p-4">
                    {editingId === driver._id ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      driver.email
                    )}
                  </td>

                  {/* Phone */}
                  <td className="p-4">
                    {editingId === driver._id ? (
                      <input
                        type="text"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      driver.phone
                    )}
                  </td>

                  {/* Vehicle */}
                  <td className="p-4">
                    {editingId === driver._id ? (
                      <input
                        type="text"
                        value={editData.vehicleNumber}
                        onChange={(e) =>
                          setEditData({ ...editData, vehicleNumber: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      driver.vehicleNumber
                    )}
                  </td>

                  {/* Days */}
                  <td className="p-4">
                    {editingId === driver._id ? (
                      <div className="grid grid-cols-2 gap-1">
                        {daysOfWeek.map((day) => (
                          <label key={day} className="flex items-center space-x-1">
                            <input
                              type="checkbox"
                              checked={editData.availableDays.includes(day)}
                              onChange={() => handleCheckbox(day)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm">{day}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      driver.availableDays.join(", ")
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 space-x-2">
                    {editingId === driver._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(driver._id)}
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
                      <>
                        <button
                          onClick={() => startEdit(driver)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(driver._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const apiBase = 'http://localhost:5000/api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all'); // pending, accepted, rejected, all
  const [searchDate, setSearchDate] = useState('');

  // Fetch bookings
  async function fetchBookings() {
    try {
      const res = await axios.get(`${apiBase}/bookings`);
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  }

  // Accept booking
  async function accept(id) {
    try {
      await axios.patch(`${apiBase}/bookings/${id}/accept`);
      fetchBookings();
    } catch (err) {
      console.error('Error accepting booking:', err);
    }
  }

  // Reject booking
  async function reject(id) {
    if (!window.confirm('Reject this booking?')) return;
    try {
      await axios.patch(`${apiBase}/bookings/${id}/reject`);
      fetchBookings();
    } catch (err) {
      console.error('Error rejecting booking:', err);
    }
  }

  useEffect(() => {
    if (activeTab === 'bookings') fetchBookings();
  }, [activeTab]);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const statusMatch = filter === 'all' ? true : b.status === filter;
    const dateMatch = searchDate
      ? new Date(b.date).toLocaleDateString() ===
        new Date(searchDate).toLocaleDateString()
      : true;
    return statusMatch && dateMatch;
  });

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Booking Details Report', 14, 15);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

    const tableColumn = ['Pickup', 'Drop-off', 'Date', 'Status'];
    const tableRows = filteredBookings.map((b) => [
      b.pickupLocation,
      b.dropLocation,
      new Date(b.date).toLocaleDateString(),
      b.status.charAt(0).toUpperCase() + b.status.slice(1),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
    });

    doc.save('booking_report.pdf');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 text-xl font-bold border-b">Admin Dashboard</div>
        <ul className="mt-6">
          <li
            onClick={() => setActiveTab('bookings')}
            className={`cursor-pointer flex items-center px-6 py-3 rounded hover:bg-gray-200 transition ${
              activeTab === 'bookings' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            📋 <span className="ml-2">Bookings</span>
          </li>

          <Link to="/alldriver">
            <li
              onClick={() => setActiveTab('drivers')}
              className={`cursor-pointer flex items-center px-6 py-3 rounded hover:bg-gray-200 transition ${
                activeTab === 'drivers' ? 'bg-gray-200 font-semibold' : ''
              }`}
            >
              🚗 <span className="ml-2">Drivers</span>
            </li>
          </Link>

          <Link to="/alltruck">
            <li
              onClick={() => setActiveTab('trucks')}
              className={`cursor-pointer flex items-center px-6 py-3 rounded hover:bg-gray-200 transition ${
                activeTab === 'trucks' ? 'bg-gray-200 font-semibold' : ''
              }`}
            >
              🚛 <span className="ml-2">Trucks</span>
            </li>
          </Link>

          <Link to="/alluser">
            <li
              onClick={() => setActiveTab('users')}
              className={`cursor-pointer flex items-center px-6 py-3 rounded hover:bg-gray-200 transition ${
                activeTab === 'users' ? 'bg-gray-200 font-semibold' : ''
              }`}
            >
              👥 <span className="ml-2">Users</span>
            </li>
          </Link>

          <br />
          <hr />

          <Link to="/">
            <li className="cursor-pointer flex items-center px-6 py-3 rounded hover:bg-red-100 transition text-red-600 font-semibold">
              🔴 <span className="ml-2">Logout</span>
              <span className="ml-auto">➡️</span>
            </li>
          </Link>
          <hr />
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Buttons & Filters */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="flex space-x-4">
              <Link to="/adddriver">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  ➕ Add Driver
                </button>
              </Link>
              <Link to="/managedispatch">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                  🚚 Manage Dispatch
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Bookings</h2>

            {/* Filters */}
            <div className="flex justify-end items-center space-x-2 mb-4">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="border px-3 py-2 rounded-lg"
                placeholder="Search by date"
              />
              <select
                className="border px-3 py-2 rounded-lg"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
              >
                📄 Download PDF
              </button>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="p-6 bg-white rounded shadow text-center text-gray-600">
                No bookings available.
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="min-w-full border-collapse">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-3 text-left">Pickup</th>
                      <th className="p-3 text-left">Drop-off</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b, idx) => (
                      <tr
                        key={b._id}
                        className={`${
                          idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        } hover:bg-gray-100`}
                      >
                        <td className="p-3">{b.pickupLocation}</td>
                        <td className="p-3">{b.dropLocation}</td>
                        <td className="p-3">
                          {new Date(b.date).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-medium ${
                              b.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : b.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-3 space-x-2">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => accept(b._id)}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => reject(b._id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {b.status === 'accepted' && (
                            <span className="text-green-600 font-semibold">
                              ✔ Accepted
                            </span>
                          )}
                          {b.status === 'rejected' && (
                            <span className="text-red-600 font-semibold">
                              ✖ Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Placeholder Tabs */}
        {activeTab === 'drivers' && (
          <div className="p-6 bg-white rounded shadow">
            Driver management content goes here...
          </div>
        )}
        {activeTab === 'trucks' && (
          <div className="p-6 bg-white rounded shadow">
            Truck management content goes here...
          </div>
        )}
        {activeTab === 'users' && (
          <div className="p-6 bg-white rounded shadow">
            User management content goes here...
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;

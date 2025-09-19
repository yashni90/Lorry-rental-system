import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

const apiBase = 'http://localhost:5000/api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ pickupLocation: '', dropLocation: '', date: '' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    try {
      const res = await axios.get(`${apiBase}/bookings`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteBooking(id) {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await axios.delete(`${apiBase}/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  }

  function startEdit(b) {
    setEditingId(b._id);
    setEditData({
      pickupLocation: b.pickupLocation,
      dropLocation: b.dropLocation,
      date: new Date(b.date).toISOString().split('T')[0],
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({ pickupLocation: '', dropLocation: '', date: '' });
  }

  async function saveEdit(id) {
    try {
      await axios.put(`${apiBase}/bookings/${id}`, editData);
      cancelEdit();
      fetchBookings();
    } catch (err) {
      alert('Error updating booking: ' + (err.response?.data?.error || err.message));
    }
  }

  useEffect(() => { fetchBookings(); }, []);

  const filteredBookings = bookings.filter(
    (b) =>
      b.pickupLocation.toLowerCase().includes(search.toLowerCase()) ||
      b.dropLocation.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-2">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-5 shadow-lg flex justify-between items-center rounded-xl">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">📦 My Bookings</h2>
          <p className="mt-1 text-blue-100 text-sm">
            View, update, and manage your bookings in one place.
          </p>
        </div>
        <div className="relative w-80">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by pickup/drop location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {filteredBookings.length === 0 ? (
          <div className="p-6 bg-white rounded-lg shadow text-center text-gray-600">
            No bookings found.
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
                    className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                  >
                    {/* Pickup */}
                    <td className="p-3">
                      {editingId === b._id ? (
                        <input
                          type="text"
                          value={editData.pickupLocation}
                          onChange={(e) => setEditData({ ...editData, pickupLocation: e.target.value })}
                          className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      ) : (
                        b.pickupLocation
                      )}
                    </td>

                    {/* Drop */}
                    <td className="p-3">
                      {editingId === b._id ? (
                        <input
                          type="text"
                          value={editData.dropLocation}
                          onChange={(e) => setEditData({ ...editData, dropLocation: e.target.value })}
                          className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      ) : (
                        b.dropLocation
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-3">
                      {editingId === b._id ? (
                        <input
                          type="date"
                          value={editData.date}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                          className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      ) : (
                        new Date(b.date).toLocaleDateString()
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          b.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 space-x-2">
                      {b.status === 'pending' && (
                        <>
                          {editingId === b._id ? (
                            <>
                              <button
                                onClick={() => saveEdit(b._id)}
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
                                onClick={() => startEdit(b)}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => deleteBooking(b._id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </>
                      )}
                      {b.status === 'accepted' && (
                        <span className="text-green-600 font-semibold">✔ Accepted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyBookings;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiBase = 'http://localhost:5000/api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ pickupLocation: '', dropLocation: '', date: '' });

  async function fetchBookings() {
    const res = await axios.get(`${apiBase}/bookings`);
    setBookings(res.data);
  }

  async function deleteBooking(id) {
    if (!window.confirm('Delete this booking?')) return;
    await axios.delete(`${apiBase}/bookings/${id}`);
    fetchBookings();
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
      alert('Error updating booking: ' + err.response?.data?.error || err.message);
    }
  }

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow text-center text-gray-600">
          You have no bookings yet.
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
              {bookings.map((b, idx) => (
                <tr
                  key={b._id}
                  className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                >
                  <td className="p-3">
                    {editingId === b._id ? (
                      <input
                        type="text"
                        value={editData.pickupLocation}
                        onChange={e => setEditData({ ...editData, pickupLocation: e.target.value })}
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      b.pickupLocation
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === b._id ? (
                      <input
                        type="text"
                        value={editData.dropLocation}
                        onChange={e => setEditData({ ...editData, dropLocation: e.target.value })}
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      b.dropLocation
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === b._id ? (
                      <input
                        type="date"
                        value={editData.date}
                        onChange={e => setEditData({ ...editData, date: e.target.value })}
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      new Date(b.date).toLocaleDateString()
                    )}
                  </td>
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
    </div>
  );
}

export default MyBookings;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const apiBase = 'http://localhost:5000/api';

export default function ManageDispatch() {
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, bookingsRes] = await Promise.all([
          axios.get(`${apiBase}/drivers`),
          axios.get(`${apiBase}/bookings/with-driver/all`),
        ]);
        setDrivers(driversRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignDriver = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !selectedDriver)
      return alert('Select both booking and driver!');
    try {
      const res = await axios.put(
        `${apiBase}/bookings/${selectedBooking}/assign-driver`,
        { driverId: selectedDriver }
      );
      setBookings(
        bookings.map((b) => (b._id === selectedBooking ? res.data : b))
      );
      setSelectedBooking('');
      setSelectedDriver('');
      alert('Driver assigned successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to assign driver');
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Professional Header Centered */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl shadow-lg p-6 mb-8 text-center">
        <h1 className="text-3xl font-bold flex justify-center items-center gap-3 mx-auto">
          🚛 Manage Dispatch
        </h1>
        <p className="mt-2 text-blue-100 text-sm">
          Assign drivers to bookings and track driver availability at a glance.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar: Drivers */}
        <div className="w-1/4 flex flex-col gap-6 sticky top-6 h-fit">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">
              Drivers Summary
            </h3>
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-gray-200 rounded-t-lg">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Days</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr
                    key={driver._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-2 font-medium">{driver.name}</td>
                    <td className="p-2">{driver.availableDays.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calendar Smaller */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">
              Driver Availability
            </h3>
            <div className="overflow-x-auto">
              <Calendar
                onChange={setDate}
                value={date}
                className="w-full text-sm"
                tileClassName="text-xs"
                tileContent={({ date, view }) => {
                  if (view === 'month') {
                    const dayName = date.toLocaleDateString('en-US', {
                      weekday: 'long',
                    });
                    const availableDrivers = drivers.filter((d) =>
                      d.availableDays.includes(dayName)
                    );
                    if (availableDrivers.length > 0) {
                      return (
                        <ul className="text-xs mt-1 space-y-1">
                          {availableDrivers.map((d) => (
                            <li key={d._id} className="text-green-600">
                              {d.name}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="w-3/4 flex flex-col gap-6">
          {/* Assign Driver Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">
              Assign Driver to Booking
            </h3>
            <form
              className="flex flex-wrap items-center gap-4"
              onSubmit={handleAssignDriver}
            >
              <select
                className="border px-3 py-2 rounded-lg flex-1"
                value={selectedBooking}
                onChange={(e) => setSelectedBooking(e.target.value)}
              >
                <option value="">Select Booking</option>
                {bookings
                  .filter((b) => b.status === 'accepted')
                  .map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.pickupLocation} → {b.dropLocation} (
                      {new Date(b.date).toLocaleDateString()})
                    </option>
                  ))}
              </select>

              <select
                className="border px-3 py-2 rounded-lg flex-1"
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
              >
                <option value="">Select Driver</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Assign
              </button>
            </form>
          </div>

          {/* Bookings Table */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">
              Accepted Bookings
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Pickup</th>
                    <th className="p-3 text-left">Drop-off</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Assigned Driver</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter((b) => b.status === 'accepted')
                    .map((b) => (
                      <tr
                        key={b._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="p-3">{b.pickupLocation}</td>
                        <td className="p-3">{b.dropLocation}</td>
                        <td className="p-3">
                          {new Date(b.date).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {b.assignedDriver ? b.assignedDriver.name : '-'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

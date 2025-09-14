import React, { useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets'

const apiBase = 'http://localhost:5000/api';

function Booking() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        pickupLocation,
        dropLocation: dropoffLocation,
        date: pickupDate
      };
      await axios.post(`${apiBase}/bookings`, payload);
      setMessage('Booking created successfully!');
      setPickupLocation('');
      setDropoffLocation('');
      setPickupDate('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center p-6">
        <img src={assets.truckMain2} alt="car" className='h-46 w-auto'/>
      {/* Header */}
      <header className="w-full max-w-5xl mb-10">
        <h1 className="text-5xl font-extrabold text-blue-700 text-center mb-2">Book Your Truck</h1>
        <p className="text-center text-gray-600 text-lg">
          Fill in your pickup and drop-off details to reserve your truck instantly
        </p>
      </header>

      {/* Form Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            required
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="Pickup Location"
            className="p-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          />
          <input
            type="text"
            required
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            placeholder="Drop-off Location"
            className="p-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          />
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="p-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Confirm Booking'}
          </button>
        </form>
        {message && (
          <p className="mt-6 text-center text-green-600 font-medium text-lg">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Booking;

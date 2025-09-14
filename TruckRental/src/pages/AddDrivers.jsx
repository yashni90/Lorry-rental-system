import React, { useState } from 'react';
import axios from 'axios';

const apiBase = 'http://localhost:5000/api';

export default function AddDrivers() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    availableDays: [],
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const daysOfWeek = [
    'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (day) => {
    setFormData((prev) => {
      const updatedDays = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: updatedDays };
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || Number(formData.age) <= 0) newErrors.age = 'Valid age required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Valid email required';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    if (formData.availableDays.length === 0) newErrors.availableDays = 'Select at least one available day';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = { ...formData, age: Number(formData.age) };
      await axios.post(`${apiBase}/drivers`, payload);

      setMessage('✅ Driver added successfully!');
      setFormData({
        name: '',
        age: '',
        address: '',
        email: '',
        phone: '',
        vehicleNumber: '',
        availableDays: [],
      });
      setErrors({});
    } catch (err) {
      console.error(err.response || err);
      setMessage('❌ Failed to add driver');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-lg p-8 mb-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold flex items-center gap-2">🚚 Add New Driver</h1>
        <p className="mt-2 text-blue-100 text-sm">
          Fill in the details below to register a new driver into the system.
        </p>
      </div>
        <br></br>
      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl">
        {message && (
          <div className="mb-6 text-center text-lg font-medium text-green-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Vehicle Number</label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
              />
              {errors.vehicleNumber && <p className="text-red-500 text-sm">{errors.vehicleNumber}</p>}
            </div>
          </div>

          {/* Available Days */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">Available Days</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {daysOfWeek.map((day, index) => (
                <label key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.availableDays.includes(day)}
                    onChange={() => handleCheckbox(day)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">{day}</span>
                </label>
              ))}
            </div>
            {errors.availableDays && <p className="text-red-500 text-sm">{errors.availableDays}</p>}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
            >
              ➕ Add Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

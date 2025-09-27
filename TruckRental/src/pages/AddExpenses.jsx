import React, { useState } from 'react';
import axios from 'axios';

const apiBase = 'http://localhost:5000/api';

export default function AddExpenses() {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const categories = ['Fuel', 'Maintenance', 'Salary', 'Toll', 'Insurance', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Amount must be positive';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = { ...formData, amount: Number(formData.amount) };
      await axios.post(`${apiBase}/expenses`, payload);
      setMessage('✅ Expense added successfully!');
      setFormData({ title: '', amount: '', category: '', date: '', notes: '' });
      setErrors({});
    } catch (err) {
      console.error(err.response || err);
      setMessage('❌ Failed to add expense');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-lg p-8 mb-8 w-full max-w-3xl mt-25">
        <h1 className="text-3xl font-bold flex items-center gap-2">💰 Add New Expense</h1>
        <p className="mt-2 text-blue-100 text-sm">
          Fill in the details below to record a new expense in the system.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl mt-3">
        {message && (
          <div className="mb-6 text-center text-lg font-medium text-green-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
                placeholder="Optional notes..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
            >
              ➕ Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

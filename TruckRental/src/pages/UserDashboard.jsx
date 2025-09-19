import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate  } from 'react-router-dom';
import { UserCircleIcon, TruckIcon, CalendarIcon } from '@heroicons/react/24/solid';

const apiBase = 'http://localhost:5000/api';

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', phone: '' });
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({ bookings: 0, completed: 0 });

  const token = localStorage.getItem('token'); 
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${apiBase}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setForm({ username: res.data.username, email: res.data.email, phone: res.data.phone });

    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.error || 'Failed to fetch user');
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const errs = {};
    if (!form.username || form.username.trim().length < 3) errs.username = 'Username must be at least 3 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phone || !/^\d{10,}$/.test(form.phone)) errs.phone = 'Phone must be at least 10 digits';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const res = await axios.put(`${apiBase}/users/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setEditMode(false);
      setMsg('Profile updated successfully');
      setErrors({});
    } catch (err) {
      setMsg(err.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await axios.delete(`${apiBase}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      navigate('/signin');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 text-xl font-bold border-b">User Dashboard</div>
        <ul className="mt-6">
          <li
            onClick={() => setActiveTab('profile')}
            className={`cursor-pointer flex items-center px-6 py-3 rounded hover:bg-gray-200 transition ${
              activeTab === 'profile' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            📋 <span className="ml-2">Profile</span>
          </li>
          <Link to="/my-bookings">
            <li className="cursor-pointer flex items-center px-6 py-3 rounded hover:bg-gray-200 transition">
              🚛 <span className="ml-2">My Bookings</span>
            </li>
          </Link>
          <Link to="/alltruck">
            <li className="cursor-pointer flex items-center px-6 py-3 rounded hover:bg-gray-200 transition">
              ⚙️ <span className="ml-2">Settings</span>
            </li>
          </Link>
          <Link to="/alluser">
            <li className="cursor-pointer flex items-center px-6 py-3 rounded hover:bg-gray-200 transition">
              ❓ <span className="ml-2">Helps</span>
            </li>
          </Link>
          <br />
          <hr />
          <li
            onClick={handleLogout}
            className="cursor-pointer flex items-center px-6 py-3 rounded hover:bg-red-100 transition text-red-600 font-semibold"
          >
            🔴 <span className="ml-2">Logout</span>
            <span className="ml-auto">➡️</span>
          </li>
          <hr />
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 overflow-auto flex flex-col items-center bg-gray-100">
        {/* Welcome Banner */}
        <div className="w-full mb-6 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-2xl shadow-lg p-10 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex-1">
            <h1 className="text-4xl font-bold flex items-center gap-2">👋 Welcome, {user.username}!</h1>
            <p className="mt-2 text-blue-100 text-lg">
            You have {stats.bookings} total bookings, {stats.completed} completed.
            </p>
        </div>
        <div className="mt-4 sm:mt-0">
            <Link
            to="/my-bookings"
            className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg shadow hover:bg-blue-50 transition"
            >
            View My Bookings
            </Link>
        </div>
        </div>
        {/* Dashboard Stats */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-200 flex items-center">
            <TruckIcon className="w-12 h-12 text-blue-500 mr-4" />
            <div>
              <p className="text-gray-500 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bookings}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-200 flex items-center">
            <CalendarIcon className="w-12 h-12 text-green-500 mr-4" />
            <div>
              <p className="text-gray-500 font-medium">Completed Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg border border-gray-200">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
              />
            ) : (
              <UserCircleIcon className="w-24 h-24 text-blue-500" />
            )}
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center tracking-wide">My Profile</h2>

          {msg && <p className="text-center text-green-500 mb-6">{msg}</p>}

          {editMode ? (
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {errors.username && <p className="text-red-500">{errors.username}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {errors.phone && <p className="text-red-500">{errors.phone}</p>}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-700 font-medium">Username</span>
                <span className="text-gray-900">{user.username}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-700 font-medium">Email</span>
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-700 font-medium">Phone</span>
                <span className="text-gray-900">{user.phone}</span>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;

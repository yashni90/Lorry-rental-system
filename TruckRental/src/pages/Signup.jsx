import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Footer from "../components/Footer";
import { assets } from '../assets/assets'

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.username || form.username.length < 3) newErrors.username = "Username must be at least 3 characters";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email address";
    if (!form.phone || !/^\d{10,15}$/.test(form.phone)) newErrors.phone = "Phone must be 10-15 digits";
    if (!form.password || form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.post("/users/signup", form);
      setMsg("✅ Signup successful. Please login.");
      setForm({ username: "", email: "", phone: "", password: "" });
      setErrors({});
    } catch (err) {
      setMsg(err.response?.data?.error || "❌ Signup failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex-grow flex justify-center items-center bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md mt-25 mb-35">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </button>
          </form>

          {/* Already have account link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>

          {msg && <p className="mt-4 text-center font-medium">{msg}</p>}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Signup;

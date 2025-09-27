import React, { useEffect, useState } from "react";
import axios from "axios";

const apiBase = "http://localhost:5000/api";

function CustomerPayment() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    bookingId: "",
    method: "cash",
    amount: "",
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch accepted bookings
  async function fetchBookings() {
    try {
      const res = await axios.get(`${apiBase}/bookings`);
      const accepted = res.data.filter((b) => b.status === "accepted");
      setBookings(accepted);
    } catch (err) {
      console.error(err);
    }
  }

  // Open form
  function openPaymentForm(booking) {
    setSelectedBooking(booking);
    setFormData({
      bookingId: booking._id,
      method: "cash",
      amount: "",
      cardNumber: "",
      cardHolder: "",
      expiry: "",
      cvv: "",
    });
    setFormErrors({});
  }

  // Validate fields
  function validate() {
    const errors = {};
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }
    if (formData.method === "online") {
      if (!/^\d{16}$/.test(formData.cardNumber)) {
        errors.cardNumber = "Enter a valid 16-digit card number";
      }
      if (!formData.cardHolder.trim()) {
        errors.cardHolder = "Card holder name is required";
      }
      if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        errors.expiry = "Expiry must be in MM/YY format";
      }
      if (!/^\d{3}$/.test(formData.cvv)) {
        errors.cvv = "CVV must be 3 digits";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Handle form submit
  async function handlePaymentSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post(`${apiBase}/payments`, formData);
      fetchBookings();
      setSelectedBooking(null);
      alert("Payment successful!");
    } catch (err) {
      alert("Payment failed: " + (err.response?.data?.error || err.message));
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 shadow-lg flex justify-between items-center rounded-xl mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1">💳 Customer Payments</h2>
          <p className="text-blue-200">Pay for your accepted bookings securely</p>
        </div>
        <div>
          <span className="bg-white text-blue-600 font-semibold px-4 py-2 rounded shadow-lg">
            {bookings.filter((b) => !b.paid).length} Pending Payments
          </span>
        </div>
      </header>

      {/* Main Table */}
      <main className="flex-1 overflow-auto">
        {bookings.length === 0 ? (
          <div className="p-6 bg-white rounded-lg shadow text-center text-gray-600">
            No accepted bookings available for payment.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg mb-6">
            <table className="min-w-full table-auto border-collapse text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 w-1/4">Pickup</th>
                  <th className="p-3 w-1/4">Drop-off</th>
                  <th className="p-3 w-1/4">Date</th>
                  <th className="p-3 w-1/4 text-center">Payment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, idx) => (
                  <tr
                    key={b._id}
                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                  >
                    <td className="p-3">{b.pickupLocation}</td>
                    <td className="p-3">{b.dropLocation}</td>
                    <td className="p-3">{new Date(b.date).toLocaleDateString()}</td>
                    <td className="p-3 text-center">
                      {b.paid ? (
                        <span className="px-3 py-1 bg-green-500 text-white rounded">
                          Payment Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => openPaymentForm(b)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payment Form */}
        {selectedBooking && (
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Make Payment</h3>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {/* Pickup & Drop */}
                <div>
                  <label className="block font-medium">Pickup Location</label>
                  <input
                    type="text"
                    value={selectedBooking.pickupLocation}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-medium">Drop Location</label>
                  <input
                    type="text"
                    value={selectedBooking.dropLocation}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block font-medium">Payment Method</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block font-medium">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {formErrors.amount && <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>}
                </div>

                {/* Card Details if Online */}
                {formData.method === "online" && (
                  <>
                    <div>
                      <label className="block font-medium">Card Number</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={formData.cardNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, "") })
                        }
                        className="w-full border rounded px-3 py-2"
                        placeholder="1234 5678 9012 3456"
                      />
                      {formErrors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium">Card Holder</label>
                      <input
                        type="text"
                        value={formData.cardHolder}
                        onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="John Doe"
                      />
                      {formErrors.cardHolder && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.cardHolder}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium">Expiry</label>
                        <input
                          type="text"
                          value={formData.expiry}
                          onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                          maxLength={5}
                          className="w-full border rounded px-3 py-2"
                          placeholder="MM/YY"
                        />
                        {formErrors.expiry && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.expiry}</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-medium">CVV</label>
                        <input
                          type="password"
                          value={formData.cvv}
                          onChange={(e) =>
                            setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })
                          }
                          maxLength={3}
                          className="w-full border rounded px-3 py-2"
                          placeholder="123"
                        />
                        {formErrors.cvv && <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>}
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Pay Now
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerPayment;

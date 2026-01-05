// src/pages/User/MyBookings.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import '../../styles/MyBookings.css'

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/bookings/my-bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const res = await axiosInstance.put(`/bookings/cancel/${bookingId}`);
      setMessage(res.data.message);
      fetchBookings();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Cancel failed");
    }
  };

  const canCancel = (checkInISO, status) => {
    if (status !== 'confirmed') return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const cutoff = new Date(checkInISO);
    cutoff.setHours(0,0,0,0);
    cutoff.setDate(cutoff.getDate() - 1);
    return today < cutoff;
  };

  return (
    <div className="my-bookings-container">
      <h2>My Bookings</h2>
      {message && <p className={`message ${message.includes("success") ? "success" : "error"}`}>
        {message}
        </p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Hotel</th>
              <th>Room</th>
              <th>Room Number</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.hotel?.name || 'N/A'}</td>
                <td>{b.room?.type || 'N/A'}</td>
                <td>{b.room?.roomNumber || 'N/A'}</td>
                <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                <td>${b.totalPrice}</td>
                <td>{b.status}</td>
                <td>
                  {canCancel(b.checkIn, b.status) ? (
                    <button onClick={() => handleCancel(b._id)}>Cancel</button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

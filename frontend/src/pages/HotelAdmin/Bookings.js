// src/pages/HotelAdmin/Bookings.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function HotelBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/bookings/hotel/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const canCancel = (checkInISO, status) => {
    if (status !== 'confirmed') return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const cutoff = new Date(checkInISO);
    cutoff.setHours(0,0,0,0);
    cutoff.setDate(cutoff.getDate() - 1);
    return today < cutoff;
  };

  const handleAdminCancel = async (bookingId) => {
    try {
      const res = await axiosInstance.put(`/bookings/admin/cancel/${bookingId}`);
      setMessage(res.data.message);
      fetchBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cancel failed');
    }
  };

  return (
    <div>
      <h2>Bookings for My Hotels</h2>
      {message && <p>{message}</p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
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
                <td>{b.user.name}</td>
                <td>{b.hotel.name}</td>
                <td>{b.room.type}</td>
                <td>{b.room.roomNumber}</td>
                <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                <td>${b.totalPrice}</td>
                <td>{b.status}</td>
                <td>
                  {canCancel(b.checkIn, b.status) ? (
                    <button onClick={() => handleAdminCancel(b._id)}>Cancel</button>
                  ) : (
                    '-'
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

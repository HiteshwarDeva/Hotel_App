// src/pages/User/HotelDetails.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import '../../styles/HotelDetails.css'

export default function HotelDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [message, setMessage] = useState("");
  const [availability, setAvailability] = useState({}); // { roomId: remaining }
  const [loadingAvail, setLoadingAvail] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axiosInstance.get(`/user/hotels/${id}`);
        setHotel(res.data.hotel);
        setRooms(res.data.rooms);
      } catch (err) {
        console.error(err);
        setMessage("Error loading hotel details");
      }
    };
    fetchHotel();
  }, [id]);

  // Fetch availability whenever both dates are selected
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!checkIn || !checkOut) return;
      setLoadingAvail(true);
      try {
        const res = await axiosInstance.get(`/user/hotels/${id}/availability`, {
          params: { checkIn, checkOut }
        });
        const map = {};
        (res.data.availability || []).forEach(a => { map[a.roomId] = a.remaining; });
        setAvailability(map);
      } catch (e) {
        setAvailability({});
      } finally {
        setLoadingAvail(false);
      }
    };
    fetchAvailability();
  }, [id, checkIn, checkOut]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !checkIn || !checkOut) {
      setMessage("Please select room and dates");
      return;
    }
    if ((availability[selectedRoom] ?? 0) <= 0) {
      setMessage("Selected room is not available for the chosen dates");
      return;
    }

    try {
      const res = await axiosInstance.post("/bookings/book-room", {
        hotelId: hotel._id,
        roomId: selectedRoom,
        checkIn,
        checkOut
      });
      setMessage(`Booking confirmed! Reference: ${res.data.bookingRef}`);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  if (!hotel) return <p>Loading hotel details...</p>;

  return (
    <div className="container">
      <h2>{hotel.name}</h2>
      <p>{hotel.city}</p>
      <h3>Rooms:</h3>
      <form onSubmit={handleBooking}>
        <label>Check-In:</label>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        <br />
        <label>Check-Out:</label>
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        <br />
        {loadingAvail && <span style={{ marginRight: 8 }}>Checking availability...</span>}
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.type} - {room.roomNumber} - ${room.pricePerNight} - Remaining: {availability[room._id] ?? "-"}
            </option>
          ))}
        </select>
        <br />
        <button className="button" type="submit" disabled={!checkIn || !checkOut || !selectedRoom || (availability[selectedRoom] ?? 0) <= 0}>Book Room</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

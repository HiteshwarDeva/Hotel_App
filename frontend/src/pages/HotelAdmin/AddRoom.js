import React, { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";

export default function AddRoom() {
  const [hotels, setHotels] = useState([]);
  const [hotelId, setHotelId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/hoteladmin/my-hotels").then(res => setHotels(res.data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("/hoteladmin/add-room", {
        hotelId,
        roomNumber,
        type,
        pricePerNight
      });
      setMessage("✅ Room added successfully!");
      setRoomNumber("");
      setType("");
      setPricePerNight("");
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Failed to add room");
    }
  };

  return (
    <div>
      <h2>Add Room</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <select value={hotelId} onChange={e => setHotelId(e.target.value)} required>
          <option value="">Select Hotel</option>
          {hotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
        </select>
        <label htmlFor="roomNumber">Room Number</label>
        <input id="roomNumber" type="text" placeholder="Room Number" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} required />
        <label htmlFor="Room Type (e.g Deluxe, AC, Suite)">Room Type (e.g Deluxe, AC, Suite)</label>
        <input id="Room Type (e.g Deluxe, AC, Suite)" type="text" placeholder="Room Type (e.g Deluxe, AC, Suite)" value={type} onChange={e => setType(e.target.value)} required />
        <label htmlFor="Price Per Night">Price Per Night</label>
        <input id="Price Per Night" type="number" placeholder="Price Per Night" value={pricePerNight} onChange={e => setPricePerNight(e.target.value)} required />

        <button type="submit">Add Room</button>
      </form>
    </div>
  );
}

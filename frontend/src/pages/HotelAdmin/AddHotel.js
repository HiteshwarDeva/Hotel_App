import React, { useState } from "react";
import axios from "../../api/axiosInstance";

export default function AddHotel() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/hoteladmin/add-hotel", { name, city });
      setMessage("Hotel added successfully");
      setName("");
      setCity("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to add hotel");
    }
  };

  return (
    <div>
      <h2>Add Hotel</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
  <label htmlFor="name">Hotel Name</label>  
  <input
    id="name"
    type="text"
    placeholder="Hotel Name"
    value={name}
    onChange={e => setName(e.target.value)}
    required
  />

  <label htmlFor="city">City</label>
  <input
    id="city"
    type="text"
    placeholder="City"
    value={city}
    onChange={e => setCity(e.target.value)}
    required
  />

  <button type="submit">Add Hotel</button>
</form>

    </div>
  );
}

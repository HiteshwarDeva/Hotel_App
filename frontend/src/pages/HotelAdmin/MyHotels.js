import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

export default function MyHotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    axios.get("/hoteladmin/my-hotels").then(res => setHotels(res.data));
  }, []);

  return (
    <div>
      <h2>My Hotels</h2>
      {hotels.map(h => (
        <div key={h._id}>
          <span>{h.name} - {h.city}</span>
        </div>
      ))}
    </div>
  );
}

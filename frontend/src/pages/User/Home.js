import React from "react";
import { Link } from "react-router-dom";
import '../../styles/Home.css'

export default function Home() {
  return (
    <div className="container">
      <h2>Welcome to Hotel Booking</h2>
      <p>Browse hotels and book your stay.</p><br/>
      <Link className="button" to="/hotels">View Hotels</Link>
    </div>
  );
}

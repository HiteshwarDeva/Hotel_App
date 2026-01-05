import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">HotelBooking</Link>
      </div>
      <div className="nav-right">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user?.role === "superadmin" && (
          <>
            <Link to="/superadmin/dashboard">Dashboard</Link>
            <Link to="/superadmin/pending-admins">Pending Admins</Link>
            <Link to="/superadmin/manage-users">Manage Users</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {user?.role === "hoteladmin" && user?.status === 'approved' && (
          <>
            <Link to="/hoteladmin/dashboard">Dashboard</Link>
            <Link to="/hoteladmin/my-hotels">My Hotels</Link>
            <Link to="/hoteladmin/add-hotel">Add Hotel</Link>
            <Link to="/hoteladmin/add-room">Add Room</Link>
            <Link to="/hoteladmin/bookings">Bookings</Link>
            <Link to="/hoteladmin/revenue">Revenue</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {user?.role === "hoteladmin" && user?.status !== 'approved' && (
          <>
            <span style={{ color: '#b36b00', marginRight: 12 }}>Your hotel admin request is pending approval.</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {user?.role === "user" && (
          <>
            <Link to="/">Home</Link>
            <Link to="/hotels">Hotels</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

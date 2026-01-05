import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css'


// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// SuperAdmin Pages
import SADashboard from "./pages/SuperAdmin/Dashboard";
import PendingAdmins from "./pages/SuperAdmin/PendingAdmins";
import ManageUsers from "./pages/SuperAdmin/ManageUsers";

// HotelAdmin Pages
import HADashboard from "./pages/HotelAdmin/Dashboard";
import MyHotels from "./pages/HotelAdmin/MyHotels";
import AddHotel from "./pages/HotelAdmin/AddHotel";
import AddRoom from "./pages/HotelAdmin/AddRoom";
import HotelBookings from "./pages/HotelAdmin/Bookings";
import Revenue from "./pages/HotelAdmin/Revenue";
import PendingApproval from "./pages/HotelAdmin/PendingApproval";

// User Pages
import Home from "./pages/User/Home";
import HotelList from "./pages/User/HotelList";
import HotelDetails from "./pages/User/HotelDetails";
import MyBookings from "./pages/User/MyBookings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Hotel Admin Pending (unprotected so pending admins can view) */}
          <Route path="/hoteladmin/pending" element={<PendingApproval />} />

          {/* SuperAdmin */}
          <Route path="/superadmin/dashboard" element={
            <ProtectedRoute requiredRole="superadmin"><SADashboard /></ProtectedRoute>
          } />
          <Route path="/superadmin/pending-admins" element={
            <ProtectedRoute requiredRole="superadmin"><PendingAdmins /></ProtectedRoute>
          } />
          <Route path="/superadmin/manage-users" element={
            <ProtectedRoute requiredRole="superadmin"><ManageUsers /></ProtectedRoute>
          } />

          {/* HotelAdmin */}
          <Route path="/hoteladmin/dashboard" element={
            <ProtectedRoute requiredRole="hoteladmin"><HADashboard /></ProtectedRoute>
          } />
          <Route path="/hoteladmin/my-hotels" element={
            <ProtectedRoute requiredRole="hoteladmin"><MyHotels /></ProtectedRoute>
          } />
          <Route path="/hoteladmin/add-hotel" element={
            <ProtectedRoute requiredRole="hoteladmin"><AddHotel /></ProtectedRoute>
          } />
          <Route path="/hoteladmin/add-room" element={
            <ProtectedRoute requiredRole="hoteladmin"><AddRoom /></ProtectedRoute>
          } />
          <Route path="/hoteladmin/bookings" element={
            <ProtectedRoute requiredRole="hoteladmin"><HotelBookings /></ProtectedRoute>
          } />
          <Route path="/hoteladmin/revenue" element={
            <ProtectedRoute requiredRole="hoteladmin"><Revenue /></ProtectedRoute>
          } />

          {/* User */}
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/my-bookings" element={
            <ProtectedRoute requiredRole="user"><MyBookings /></ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/hoteladmin/dashboard/stats");
      setStats(res.data);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h2>Hotel Admin Dashboard</h2>
      {loading && <p>Loading stats...</p>}
      {error && (
        <div>
          <p className="error">{error}</p>
          <button className="button" onClick={load}>Retry</button>
        </div>
      )}

      {stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, margin: '16px 0' }}>
            <div className="card">
              <h4>Total Hotels</h4>
              <p>{stats.totals.totalHotels}</p>
            </div>
            <div className="card">
              <h4>Total Rooms</h4>
              <p>{stats.totals.totalRooms}</p>
            </div>
            <div className="card">
              <h4>Occupied Today</h4>
              <p>{stats.totals.occupiedRoomsToday}</p>
            </div>
            <div className="card">
              <h4>Upcoming Check-ins (7d)</h4>
              <p>{stats.totals.upcomingCheckins}</p>
            </div>
            <div className="card">
              <h4>Total Revenue</h4>
              <p>${stats.totals.totalRevenue}</p>
            </div>
            <div className="card">
              <h4>Revenue (Last 30d)</h4>
              <p>${stats.totals.revenueLast30}</p>
            </div>
          </div>

          <div style={{ margin: '16px 0' }}>
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link className="button" to="/hoteladmin/add-hotel">Add Hotel</Link>
              <Link className="button" to="/hoteladmin/add-room">Add Room</Link>
              <Link className="button" to="/hoteladmin/bookings">View Bookings</Link>
              <Link className="button" to="/hoteladmin/revenue">View Revenue</Link>
            </div>
          </div>

          <div>
            <h3>Recent Bookings</h3>
            {stats.recentBookings.length === 0 ? (
              <p>No recent bookings.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Hotel</th>
                    <th>Room</th>
                    <th>Room No</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map(b => (
                    <tr key={b._id}>
                      <td>{b.user?.name || 'N/A'}</td>
                      <td>{b.hotel?.name || 'N/A'}</td>
                      <td>{b.room?.type || 'N/A'}</td>
                      <td>{b.room?.roomNumber || 'N/A'}</td>
                      <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                      <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                      <td>${b.totalPrice}</td>
                      <td>{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

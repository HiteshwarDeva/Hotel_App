import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import '../../styles/SuperAdminDashboard.css';


export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [bookingsPerHotel, setBookingsPerHotel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch system-wide stats
        const res = await axiosInstance.get("/superadmin/stats");
        setStats(res.data);

        // Fetch bookings per hotel for chart
        const bookingsRes = await axiosInstance.get("/superadmin/bookings-per-hotel");
        setBookingsPerHotel(bookingsRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  const pieData = [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Hotel Admins', value: stats.totalHotelAdmins },
    { name: 'Pending Admins', value: stats.pendingHotelAdmins }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="dashboard-container">
      <h2>Super Admin Dashboard</h2>

      <div  className="dashboard-grid" style={{ display: 'flex', gap: '50px', marginBottom: '50px' }}>
        <div className="stats-card">
          <h3>System Stats</h3>
          <ul>
            <li>Total Users: {stats.totalUsers}</li>
            <li>Total Hotel Admins: {stats.totalHotelAdmins}</li>
            <li>Pending Hotel Admins: {stats.pendingHotelAdmins}</li>
            <li>Total Hotels: {stats.totalHotels}</li>
            <li>Total Bookings: {stats.totalBookings}</li>
            <li>Total Revenue: ${stats.totalRevenue}</li>
          </ul>
        </div>

        <div className="chart-card">
          <h3>User/Admin Distribution</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <div className="bar-chart-container">
        <h3>Bookings Per Hotel</h3>
        <BarChart width={800} height={400} data={bookingsPerHotel}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hotelName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
  );
}

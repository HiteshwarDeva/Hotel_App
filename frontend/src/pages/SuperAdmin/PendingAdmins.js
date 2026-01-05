import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import '../../styles/PedingAdmins.css'

export default function PendingAdmins() {
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState("");

  const fetchPending = async () => {
    const res = await axiosInstance.get("/superadmin/pending-admins");
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/superadmin/pending-admins/${id}/approve`);
      setMessage("Admin approved successfully");
      fetchPending();
    } catch (err) {
      setMessage("Failed to approve admin");
    } finally {
      setTimeout(() => setMessage(""), 3000); // Clear after 3 seconds
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/superadmin/pending-admins/${id}/reject`);
      setMessage("Admin rejected successfully");
      fetchPending();
    } catch (err) {
      setMessage("Failed to reject admin");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div>
      <h2>Pending Hotel Admins</h2>
      {message && <p role="alert">{message}</p>}

      {admins.length === 0 ? (
        <p>No pending admins</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a._id}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>
                  <button className="approve-btn" onClick={() => handleApprove(a._id)}>
                    Approve
                  </button>
                  <button className="reject-btn" onClick={() => handleReject(a._id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function PendingApproval() {
  return (
    <div className="container">
      <h2>Hotel Admin Pending Approval</h2>
      <p>Your hotel admin request is pending approval by a Super Admin.</p>
      <p>You will gain access to hotel management features once approved.</p>
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link className="button" to="/">Go to Home</Link>
        <Link className="button" to="/hotels">Browse Hotels</Link>
      </div>
    </div>
  );
}

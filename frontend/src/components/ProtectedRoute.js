import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  // If hotel admin but pending approval, redirect to pending info page
  if (requiredRole === 'hoteladmin' && user?.status !== 'approved') {
    return <Navigate to="/hoteladmin/pending" replace />;
  }
  return children;
}

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  console.log(`[Guard] Checking access... Role: ${userRole}, Token exists: ${!!token}`);

  // 1. Check if user is logged in
  if (!token) {
    console.warn("[Guard] No token found. Redirecting to login.");
    return <Navigate to="/" replace />;
  }

  // 2. Check if user's role is allowed for this route
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.error(`[Guard] Unauthorized role: ${userRole}. Required: ${allowedRoles}. Redirecting.`);
    return <Navigate to="/" replace />;
  }

  // 3. Authorized access - render the child routes
  return <Outlet />;
};

export default ProtectedRoute;

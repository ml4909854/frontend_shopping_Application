// src/Components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    if (roleRequired && userRole !== roleRequired) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid or expired token:", error.message);
    localStorage.removeItem("token"); // 🔒 Clean up corrupted token
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;

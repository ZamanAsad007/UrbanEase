import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const roleId = Number(localStorage.getItem('role_id'));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(roleId)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

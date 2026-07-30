import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { auth } = useSelector((store) => store);
  const location = useLocation();
  const jwt = localStorage.getItem("jwt");

  if (!jwt && !auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to in the state so we can potentially route them back later.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

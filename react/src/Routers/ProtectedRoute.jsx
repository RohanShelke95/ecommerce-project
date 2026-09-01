import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { auth } = useSelector((store) => store);
  const location = useLocation();
  const jwt = localStorage.getItem("jwt");

  // Still fetching user from backend — show spinner, don't redirect yet
  if (jwt && auth.fetchingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress sx={{ color: "#4f46e5" }} size={40} />
      </div>
    );
  }

  if (!jwt && !auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to in the state so we can potentially route them back later.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;


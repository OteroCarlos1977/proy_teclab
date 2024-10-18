// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export function PrivateRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" />;
}
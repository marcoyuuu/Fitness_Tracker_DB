import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { access } = useAuth();
  if (!access) return <Navigate to="/" replace />;
  return children;
}

import type React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Example: auth token stored in localStorage
  const token = localStorage.getItem("auth_token");

  if (!token) {
    // Not logged in → redirect to /login
    return <Navigate to="/login" replace />;
  }

  // Logged in → render the protected component
  return children;
}

import { SUB_ROUTES } from "@/constants";
import useAuthStore from "@/context/authStore";
import type React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const {token} = useAuthStore()
  if (!token) {
    return <Navigate to={SUB_ROUTES.login} replace />;
  }
  return children;
}

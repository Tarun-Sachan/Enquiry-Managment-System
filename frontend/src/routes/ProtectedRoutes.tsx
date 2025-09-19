import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = getToken();
  const user = getUser(); // store user info in localStorage on login

  if (!token) return <Navigate to="/login" replace />;

  // Use a default role if user or role is undefined
  const role = user?.role || "user";

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />; // fallback if role not allowed
  }

  return children;
}

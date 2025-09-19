import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // optional: roles allowed for this route
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = getToken();
  const user = getUser(); // store user info in localStorage on login

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />; // fallback if role not allowed
  }

  return children;
}

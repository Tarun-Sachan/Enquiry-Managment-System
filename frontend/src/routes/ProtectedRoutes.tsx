import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

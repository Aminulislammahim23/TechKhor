import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/products" replace />;
  }

  return children;
}

import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken, isAuthenticated } from "../hooks/useAuth";
import { getCurrentRoleFromToken } from "../utils/jwt";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getAuthToken();
  const role = getCurrentRoleFromToken(token);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role === "admin" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin" replace />;
  }

  if (role === "seller" && !location.pathname.startsWith("/seller")) {
    return <Navigate to="/seller" replace />;
  }

  return children;
}

export function PublicRoute({ children }) {
  const token = getAuthToken();
  const role = getCurrentRoleFromToken(token);

  if (token) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "seller") return <Navigate to="/seller" replace />;
    return <Navigate to="/products" replace />;
  }

  return children;
}

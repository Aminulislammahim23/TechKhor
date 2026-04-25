import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthToken } from "../hooks/useAuth";
import { getCurrentRoleFromToken } from "../utils/jwt";

export default function SellerRoute() {
  const location = useLocation();
  const token = getAuthToken();
  const role = getCurrentRoleFromToken(token);

  if (!token || role !== "seller") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

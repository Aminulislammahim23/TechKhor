import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute, { PublicRoute } from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import SellerRoute from "./components/SellerRoute";
import AdminLayout from "./components/AdminLayout";
import SellerLayout from "./components/SellerLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import StoreProducts from "./pages/StoreProducts";
import ProductDetails from "./pages/ProductDetails";
import MyOrders from "./pages/MyOrders";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import AdminProducts from "./pages/Products";
import AdminCategories from "./pages/Categories";
import AdminOrders from "./pages/Orders";
import AdminPayments from "./pages/Payments";
import AdminSellerEarnings from "./pages/AdminSellerEarnings";
import CreateSeller from "./pages/CreateSeller";
import Sellers from "./pages/Sellers";
import Settings from "./pages/Settings";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerEarnings from "./pages/SellerEarnings";
import AddProduct from "./pages/AddProduct";
import SellerPOS from "./pages/SellerPOS";
import { getMaintenanceAccess, getPublicMaintenanceStatus } from "./api";
import { useAuth } from "./hooks/useAuth";
import { getCurrentRoleFromToken, getCurrentUserIdFromToken } from "./utils/jwt";
import { useEffect, useState } from "react";

function MaintenanceBlockedScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-amber-400/20 bg-amber-500/10 p-8 text-center shadow-xl">
        <h1 className="text-3xl font-bold text-white">This website is under maintenance</h1>
        <p className="mt-4 text-base text-amber-100">
          Please come back later. Access is temporarily unavailable at this time.
        </p>
      </div>
    </div>
  );
}

function MaintenanceGate({ children }) {
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();
  const role = getCurrentRoleFromToken(token);
  const userId = getCurrentUserIdFromToken(token);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      if (location.pathname === "/login") {
        if (active) {
          setBlocked(false);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const statusResponse = await getPublicMaintenanceStatus();
        const maintenanceMode = Boolean(statusResponse?.data?.maintenanceMode);

        if (!maintenanceMode) {
          if (active) setBlocked(false);
          return;
        }

        if (role === "admin") {
          if (active) setBlocked(false);
          return;
        }

        if (isAuthenticated && role === "seller" && userId) {
          try {
            const accessResponse = await getMaintenanceAccess();
            const allowed = Boolean(accessResponse?.data?.allowed);
            if (active) setBlocked(!allowed);
            return;
          } catch {
            if (active) setBlocked(true);
            return;
          }
        }

        if (active) setBlocked(true);
      } catch {
        if (active) {
          setBlocked(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, [isAuthenticated, role, userId, location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        Loading...
      </div>
    );
  }

  if (blocked) {
    return <MaintenanceBlockedScreen />;
  }

  return children;
}

function AdminPathGate({ children }) {
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();
  const role = getCurrentRoleFromToken(token);

  if (isAuthenticated && role === "admin" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin" replace />;
  }

  if (isAuthenticated && role === "seller" && !location.pathname.startsWith("/seller")) {
    return <Navigate to="/seller" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <MaintenanceGate>
        <AdminPathGate>
          <div className="min-h-screen bg-slate-950">
            <Navbar />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/products"
              element={<StoreProducts />}
            />
            <Route path="/best-deals" element={<Navigate to="/products" replace />} />
            <Route path="/pc-builder" element={<Navigate to="/products" replace />} />
            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="create-seller" element={<CreateSeller />} />
                <Route path="sellers" element={<Sellers />} />
                <Route path="users" element={<Users />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="seller-earnings" element={<AdminSellerEarnings />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
            <Route element={<SellerRoute />}>
              <Route path="/seller" element={<SellerLayout />}>
                <Route index element={<SellerDashboard />} />
                <Route path="products" element={<SellerProducts />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="bulk-upload" element={<Navigate to="/seller/add-product" replace />} />
                <Route path="pos" element={<SellerPOS />} />
                <Route path="earnings" element={<SellerEarnings />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AdminPathGate>
      </MaintenanceGate>
    </BrowserRouter>
  );
}

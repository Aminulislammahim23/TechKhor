import { Route, Routes } from "react-router-dom";
import AdminRoute from "../components/AdminRoute";
import AdminLayout from "../components/AdminLayout";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import ShopProducts from "../pages/ShopProducts";
import AdminProducts from "../pages/Products";
import CreateSeller from "../pages/CreateSeller";
import Sellers from "../pages/Sellers";
import Orders from "../pages/Orders";
import Payments from "../pages/Payments";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ShopProducts />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/store" element={<Home />} />
      <Route path="/shop" element={<ShopProducts />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="create-seller" element={<CreateSeller />} />
          <Route path="sellers" element={<Sellers />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<Payments />} />
        </Route>
      </Route>
    </Routes>
  );
}

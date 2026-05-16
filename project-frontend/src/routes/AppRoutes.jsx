import { Navigate, Route, Routes } from "react-router-dom";
import AboutUs from "../pages/AboutUs";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PcBuilder from "../pages/PcBuilder";
import Product from "../pages/Product";
import Registration from "../pages/Registration";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/products" element={<Product />} />
      <Route path="/products/:category" element={<Product />} />
      <Route path="/pc-builder" element={<PcBuilder />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import {
  Bell,
  ShoppingCart,
  Menu,
  UserCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ role = "customer" }) {
  return (
    <div className="navbar z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300/70 shadow-sm px-4">

      {/* Left */}
      <div className="navbar-start">

        {/* Mobile Menu */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
          >
            <Menu size={24} />
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-50 w-52 rounded-box border border-base-300/70 bg-base-100/90 p-2 shadow-xl backdrop-blur-xl"
          >
            <li><Link to="/">Home</Link></li>

            {role === "admin" && (
              <>
                <li><a>Dashboard</a></li>
                <li><a>Users</a></li>
                <li><a>Reports</a></li>
              </>
            )}

            {role === "seller" && (
              <>
                <li><a>My Products</a></li>
                <li><a>Orders</a></li>
              </>
            )}

            {role === "customer" && (
              <>
                <li><Link to="/products">Shop</Link></li>
                <li><a>My Orders</a></li>
                <li><Link to="/pc-builder">PC Builder</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Techkhor
        </Link>
      </div>

      {/* Center Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">

          <li><Link to="/">Home</Link></li>

          {role === "admin" && (
            <>
              <li><a>Dashboard</a></li>
              <li><a>Users</a></li>
              <li><a>Reports</a></li>
            </>
          )}

          {role === "seller" && (
            <>
              <li><a>My Products</a></li>
              <li><a>Orders</a></li>
            </>
          )}

          {role === "customer" && (
            <>
              <li><Link to="/products">Shop</Link></li>
              <li><a>My Orders</a></li>
              <li><Link to="/pc-builder">PC Builder</Link></li>
            </>
          )}
        </ul>
      </div>

      {/* Right */}
      <div className="navbar-end gap-2">

        {/* Customer Cart */}
        {role === "customer" && (
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <ShoppingCart size={22} />
              <span className="badge badge-sm badge-primary indicator-item">
                2
              </span>
            </div>
          </button>
        )}

        {/* Notification */}
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <Bell size={22} />
            <span className="badge badge-sm badge-error indicator-item">
              5
            </span>
          </div>
        </button>

        {/* Profile */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <UserCircle2 size={34} />
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-50 w-52 rounded-box border border-base-300/70 bg-base-100/90 p-2 shadow-xl backdrop-blur-xl"
          >
            <li>
              <a>Profile</a>
            </li>

            <li>
              <a>Settings</a>
            </li>

            <li>
              <a className="text-error">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// CommonNavbar.jsx

import {
  Bell,
  ShoppingCart,
  Menu,
  UserCircle2,
} from "lucide-react";

export default function Navbar({ role = "customer" }) {
  return (
    <div className="navbar bg-base-100 shadow-md px-4">

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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><a>Home</a></li>

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
                <li><a>Shop</a></li>
                <li><a>My Orders</a></li>
              </>
            )}
          </ul>
        </div>

        {/* Logo */}
        <a className="text-2xl font-bold text-primary">
          Techkhor
        </a>
      </div>

      {/* Center Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">

          <li><a>Home</a></li>

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
              <li><a>Shop</a></li>
              <li><a>My Orders</a></li>
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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
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
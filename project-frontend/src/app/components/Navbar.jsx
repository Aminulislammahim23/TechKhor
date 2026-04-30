import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { setAuthToken, useAuth } from "../hooks/useAuth";
import { getCurrentRoleFromToken } from "../utils/jwt";

const publicLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Best Deals", to: "/best-deals" },
  { label: "PC Builder", to: "/pc-builder" },
];

const authenticatedLinks = [
  { label: "Orders", to: "/orders" },
  { label: "Cart", to: "/cart" },
];

function navClass({ isActive }) {
  return `text-sm font-medium transition ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`;
}

function customerHubClass({ isActive }) {
  return `rounded-full border px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "border-cyan-300 bg-cyan-300 text-slate-950"
      : "border-cyan-400/40 bg-cyan-400/10 text-cyan-100 hover:border-cyan-300/70 hover:bg-cyan-400/20"
  }`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const role = getCurrentRoleFromToken(token);
  const isAdmin = role === "admin";
  const isSeller = role === "seller";

  const handleLogout = () => {
    setAuthToken(null);
    setOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <img
            src="/main-logo.jpeg"
            alt="TechKhor logo"
            className="h-11 w-auto rounded-xl object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {!isAdmin && !isSeller
            ? publicLinks.map((item) => (
                <NavLink key={item.label} to={item.to} className={navClass}>
                  {item.label}
                </NavLink>
              ))
            : null}
          {!isAdmin && !isSeller && isAuthenticated
            ? authenticatedLinks.map((item) => (
                <NavLink key={item.label} to={item.to} className={navClass}>
                  {item.label}
                </NavLink>
              ))
            : null}
          {!isAdmin && !isSeller && isAuthenticated ? (
            <NavLink to="/dashboard" className={customerHubClass}>
              Customer Hub
            </NavLink>
          ) : null}
          {isAdmin ? (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                {role || "customer"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {!isAdmin && !isSeller
              ? publicLinks.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))
              : null}
            {!isAdmin && !isSeller && isAuthenticated
              ? authenticatedLinks.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))
              : null}
            {!isAdmin && !isSeller && isAuthenticated ? (
              <div className="border-t border-white/10 pt-4">
                <NavLink
                  to="/dashboard"
                  className="block rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/70 hover:bg-cyan-400/20"
                  onClick={() => setOpen(false)}
                >
                  Customer Hub
                </NavLink>
              </div>
            ) : null}
            {isAdmin ? (
              <NavLink
                to="/admin"
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Admin
              </NavLink>
            ) : null}
            <div className="flex gap-3 pt-2">
              {isAuthenticated ? (
                <>
                  <span className="flex-1 rounded-full border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-300">
                    {role || "customer"}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex-1 rounded-full border border-white/10 px-4 py-3 text-center text-sm font-medium text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

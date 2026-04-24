import { NavLink, useNavigate } from "react-router-dom";
import { setAuthToken } from "../hooks/useAuth";

const navItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Create Seller", to: "/admin/create-seller" },
  { label: "Sellers", to: "/admin/sellers" },
  { label: "Users", to: "/admin/users" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Payments", to: "/admin/payments" },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken(null);
    navigate("/login", { replace: true });
    onClose?.();
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950/95 px-5 py-6 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">TechKhor</p>
              <h1 className="mt-2 text-2xl font-semibold text-white">Admin Panel</h1>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white lg:hidden"
            >
              Close
            </button>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-cyan-400/15 text-white ring-1 ring-cyan-400/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
                onClick={onClose}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/80 shadow-[0_0_18px_rgba(34,211,238,0.45)] transition group-hover:scale-110" />
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
              Logout
            </button>
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 p-5">
            <p className="text-sm font-medium text-white">Marketplace health</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Monitor users, products, orders, and payments from one polished command center.
            </p>
          </div>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          onClick={onClose}
        />
      ) : null}
    </>
  );
}

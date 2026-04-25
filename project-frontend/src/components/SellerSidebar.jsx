import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { setAuthToken, useAuth } from "../hooks/useAuth";
import { getCurrentUserIdFromToken } from "../utils/jwt";
import { getUserById } from "../api/users.api";

const navItems = [
  { label: "Dashboard", to: "/seller" },
  { label: "My Products", to: "/seller/products" },
  { label: "Add Product", to: "/seller/add-product" },
  { label: "POS Billing", to: "/seller/pos" },
];

export default function SellerSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [sellerName, setSellerName] = useState("Seller");
  const sellerId = getCurrentUserIdFromToken(token);

  useEffect(() => {
    let active = true;

    async function loadSeller() {
      if (!sellerId) return;
      try {
        const response = await getUserById(sellerId);
        if (active) {
          setSellerName(response?.data?.fullName || "Seller");
        }
      } catch {
        if (active) {
          setSellerName("Seller");
        }
      }
    }

    loadSeller();

    return () => {
      active = false;
    };
  }, [sellerId]);

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
              <img src="/main-logo.jpeg" alt="TechKhor logo" className="h-12 w-auto rounded-xl object-contain" />
              <h1 className="mt-3 text-2xl font-semibold text-white">Seller Panel</h1>
              <p className="mt-1 text-sm text-cyan-300">{sellerName}</p>
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
                end={item.to === "/seller"}
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

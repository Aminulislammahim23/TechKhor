import { useLocation } from "react-router-dom";

const titles = {
  "/admin": { title: "Dashboard", subtitle: "Overview of TechKhor platform performance" },
  "/admin/create-seller": { title: "Create Seller", subtitle: "Onboard a new seller account securely" },
  "/admin/sellers": { title: "Sellers", subtitle: "Manage created seller accounts" },
  "/admin/users": { title: "Users", subtitle: "Track registered customers and activity" },
  "/admin/products": { title: "Products", subtitle: "Review listings and approve product submissions" },
  "/admin/categories": { title: "Categories", subtitle: "Create and manage product categories" },
  "/admin/orders": { title: "Orders", subtitle: "Monitor customer purchases and fulfillment status" },
  "/admin/payments": { title: "Payments", subtitle: "Follow payment flow across every transaction" },
  "/admin/settings": { title: "Settings", subtitle: "Manage admin profile and server maintenance mode" },
};

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const current = titles[pathname] || titles["/admin"];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white lg:hidden"
        >
          Menu
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-400">TechKhor Admin</p>
          <h2 className="mt-1 truncate text-2xl font-semibold text-white">{current.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{current.subtitle}</p>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <label className="relative">
            <span className="sr-only">Search</span>
            <input
              type="search"
              placeholder="Search..."
              className="w-72 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
            />
          </label>
          <button type="button" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10">
            Notifications
          </button>
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg shadow-cyan-500/20">
            <img
              src="/main-logo.jpeg"
              alt="TechKhor logo"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

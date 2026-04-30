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
  "/admin/seller-earnings": { title: "Seller Earnings", subtitle: "Review seller sales, commissions, and payouts" },
  "/admin/settings": { title: "Settings", subtitle: "Manage admin profile and server maintenance mode" },
  "/dashboard": { title: "Dashboard", subtitle: "Your orders, payments, and account activity in one place" },
  "/orders": { title: "My Orders", subtitle: "Track recent purchases and fulfillment status" },
  "/payments": { title: "My Payments", subtitle: "Review transactions and payment methods" },
  "/profile": { title: "Profile", subtitle: "Manage your customer information and password" },
};

export default function Topbar({ onMenuClick, variant = "admin" }) {
  const { pathname } = useLocation();
  const isCustomer = variant === "customer";
  const current = titles[pathname] || (isCustomer ? titles["/dashboard"] : titles["/admin"]);

  return (
    <header
      className={`sticky top-0 z-20 border-b backdrop-blur-xl ${
        isCustomer ? "border-slate-200 bg-white/90" : "border-white/10 bg-slate-950/80"
      }`}
    >
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className={`rounded-2xl border px-4 py-3 text-sm transition lg:hidden ${
            isCustomer
              ? "border-slate-200 text-slate-700 hover:border-cyan-300 hover:text-slate-950"
              : "border-white/10 text-slate-300 hover:border-cyan-400/30 hover:text-white"
          }`}
        >
          Menu
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-500">
            {isCustomer ? "TechKhor Customer" : "TechKhor Admin"}
          </p>
          <h2 className={`mt-1 truncate text-2xl font-semibold ${isCustomer ? "text-slate-950" : "text-white"}`}>
            {current.title}
          </h2>
          <p className={`mt-1 text-sm ${isCustomer ? "text-slate-500" : "text-slate-400"}`}>{current.subtitle}</p>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <label className="relative">
            <span className="sr-only">Search</span>
            <input
              type="search"
              placeholder="Search..."
              className={`w-72 rounded-2xl border px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-cyan-400/40 ${
                isCustomer
                  ? "border-slate-200 bg-slate-50 text-slate-900"
                  : "border-white/10 bg-white/5 text-white"
              }`}
            />
          </label>
          <button
            type="button"
            className={`rounded-2xl border px-4 py-3 text-sm transition hover:border-cyan-400/30 hover:bg-cyan-400/10 ${
              isCustomer ? "border-slate-200 bg-white text-slate-700" : "border-white/10 bg-white/5 text-slate-200"
            }`}
          >
            Notifications
          </button>
          <div
            className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border shadow-lg shadow-cyan-500/20 ${
              isCustomer ? "border-slate-200 bg-white" : "border-white/10 bg-slate-900/80"
            }`}
          >
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

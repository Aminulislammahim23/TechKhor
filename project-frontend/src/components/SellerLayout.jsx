import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";

const titles = {
  "/seller": { title: "Dashboard", subtitle: "Track your products and order activity" },
  "/seller/products": { title: "My Products", subtitle: "Review submitted products and approval status" },
  "/seller/add-product": { title: "Add Product", subtitle: "Create products manually or import them from Excel" },
  "/seller/pos": { title: "Seller POS", subtitle: "Create bills, process payments, and print receipt" },
  "/seller/earnings": { title: "Earnings", subtitle: "Track sales, commission, and payout status" },
};

export default function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const current = titles[pathname] || titles["/seller"];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#07111f_45%,_#020617_100%)] text-white">
      <SellerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white lg:hidden"
            >
              Menu
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-400">TechKhor Seller</p>
              <h2 className="mt-1 truncate text-2xl font-semibold text-white">{current.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{current.subtitle}</p>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

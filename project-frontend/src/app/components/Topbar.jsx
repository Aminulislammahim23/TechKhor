import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProducts } from "../api";
import NotificationBell from "./NotificationBell";

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

function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

function getCategory(product) {
  const category = product?.category || {};
  return {
    id: category.id ?? product?.categoryId ?? "",
    name: category.name ?? product?.categoryName ?? "",
  };
}

export default function Topbar({ onMenuClick, variant = "admin" }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isCustomer = variant === "customer";
  const current = titles[pathname] || (isCustomer ? titles["/dashboard"] : titles["/admin"]);

  useEffect(() => {
    if (!isCustomer) return undefined;

    const query = searchTerm.trim();
    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await getProducts({
          search: query,
          limit: 8,
          approvedOnly: true,
        });

        if (active) {
          setSearchResults(unwrapProducts(response.data));
          setSearchOpen(true);
        }
      } catch {
        if (active) {
          setSearchResults([]);
          setSearchOpen(true);
        }
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [isCustomer, searchTerm]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const handleClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

  const categoryResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const categories = new Map();

    searchResults.forEach((product) => {
      const category = getCategory(product);
      const name = String(category.name || "").trim();
      if (!name || !name.toLowerCase().includes(query)) return;
      categories.set(`${category.id || name}-${name}`, category);
    });

    return Array.from(categories.values()).slice(0, 4);
  }, [searchResults, searchTerm]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    setSearchOpen(false);
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleProductSelect = (product) => {
    setSearchOpen(false);
    setSearchTerm("");
    navigate(`/products/${product.id}`);
  };

  const handleCategorySelect = (category) => {
    const params = new URLSearchParams();
    if (category.name) params.set("category", category.name);
    if (category.id) params.set("categoryId", category.id);

    setSearchOpen(false);
    setSearchTerm("");
    navigate(`/products?${params.toString()}`);
  };

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
          <form ref={searchRef} onSubmit={handleSearchSubmit} className="relative">
            <label>
              <span className="sr-only">Search products and categories</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(Boolean(searchTerm.trim()))}
                placeholder="Search..."
                className={`w-72 rounded-2xl border px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-cyan-400/40 ${
                  isCustomer
                    ? "border-slate-200 bg-slate-50 text-slate-900"
                    : "border-white/10 bg-white/5 text-white"
                }`}
              />
            </label>

            {isCustomer && searchOpen && searchTerm.trim() ? (
              <div className="absolute right-0 top-14 z-50 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
                {searchLoading ? (
                  <div className="px-4 py-5 text-sm text-slate-500">Searching...</div>
                ) : null}

                {!searchLoading && searchResults.length === 0 && categoryResults.length === 0 ? (
                  <div className="px-4 py-5 text-sm text-slate-500">No products or categories found.</div>
                ) : null}

                {categoryResults.length > 0 ? (
                  <div className="border-b border-slate-100 p-2">
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Categories
                    </p>
                    {categoryResults.map((category) => (
                      <button
                        key={`${category.id || category.name}-${category.name}`}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                ) : null}

                {searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto p-2">
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Products
                    </p>
                    {searchResults.map((product) => {
                      const category = getCategory(product);
                      const price = Number(product.offerPrice || product.price || 0);
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleProductSelect(product)}
                          className="grid w-full grid-cols-[44px_1fr] gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-cyan-50"
                        >
                          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                            {product.image ? (
                              <img src={product.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs font-semibold text-slate-400">TK</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{product.name}</p>
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {category.name || "Product"} · BDT {price.toLocaleString("en-BD")}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}
          </form>
          {isCustomer ? (
            <NotificationBell variant="light" label="Notifications" />
          ) : (
            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
            >
              Notifications
            </button>
          )}
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

import { useMemo, useState } from "react";
import Table, { StatusPill } from "../components/Table";
import { useAuth } from "../hooks/useAuth";
import { useSellerProducts } from "../hooks/useProducts";
import { getCurrentUserIdFromToken } from "../utils/jwt";

export default function SellerProducts() {
  const { token } = useAuth();
  const sellerId = getCurrentUserIdFromToken(token);
  const { rows, loading, error } = useSellerProducts(sellerId);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      [row.productId, row.name, row.category].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [rows, searchTerm]);

  const columns = [
    { key: "productId", label: "Product ID" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
        <label className="block max-w-2xl">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by product ID, name, or category..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Loading products...
        </div>
      ) : null}

      {!loading && filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          {searchTerm.trim() ? "No matching products found." : "No products found. Add your first product."}
        </div>
      ) : null}

      <Table
        columns={columns}
        data={filteredRows}
        rowKey="id"
        emptyTitle={searchTerm.trim() ? "No matching products found" : "No products found"}
        emptyDescription={
          searchTerm.trim()
            ? "Try another product ID, name, or category."
            : "Add your first product to see it here."
        }
      />
    </section>
  );
}

import Table, { StatusPill } from "../components/Table";
import { useAuth } from "../hooks/useAuth";
import { useSellerProducts } from "../hooks/useProducts";
import { getCurrentUserIdFromToken } from "../utils/jwt";

export default function SellerProducts() {
  const { token } = useAuth();
  const sellerId = getCurrentUserIdFromToken(token);
  const { rows, loading, error } = useSellerProducts(sellerId);

  const columns = [
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <section className="space-y-6">
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

      {!loading && rows.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          No products found. Add your first product.
        </div>
      ) : null}

      <Table columns={columns} data={rows} rowKey="id" />
    </section>
  );
}

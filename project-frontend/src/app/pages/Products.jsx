import { useMemo, useState } from "react";
import Table, { StatusPill } from "../components/Table";
import { useAdminProducts } from "../hooks/useProducts";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const params = useMemo(
    () => ({
      limit: 200,
      search: searchTerm.trim(),
    }),
    [searchTerm]
  );
  const { rows, pendingCount, loading, error, approvingId, approveProduct } = useAdminProducts({
    params,
  });

  const columns = [
    { key: "productId", label: "Product ID" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "seller", label: "Seller" },
    {
      key: "status",
          label: "Status",
      render: (row) => (
        <div className="flex flex-col gap-3">
          <StatusPill status={row.status} />
          {row.status === "Pending" ? (
            <button
              type="button"
              onClick={() => approveProduct(row.id)}
              disabled={approvingId === row.id}
              className="w-fit rounded-xl bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {approvingId === row.id ? "Approving..." : "Approve Product"}
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Product Review</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Approve product submissions quickly</h3>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-300 ring-1 ring-white/10">
            {pendingCount} pending
          </span>
        </div>
        <label className="mt-6 block max-w-2xl">
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

      <Table
        columns={columns}
        data={rows}
        rowKey="id"
        emptyTitle={searchTerm.trim() ? "No matching products found" : "No products found"}
        emptyDescription={
          searchTerm.trim()
            ? "Try another product ID, name, or category."
            : "There are no product submissions to show yet."
        }
      />
    </section>
  );
}

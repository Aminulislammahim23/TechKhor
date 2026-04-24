import { useState } from "react";
import Table, { StatusPill } from "../components/Table";
import { products as initialProducts } from "../data/adminData";

export default function Products() {
  const [products, setProducts] = useState(initialProducts);

  const approveProduct = (productId) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, status: "Approved" } : product
      )
    );
  };

  const columns = [
    { key: "name", label: "Name" },
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
              className="w-fit rounded-xl bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Approve Product
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
            {products.filter((product) => product.status === "Pending").length} pending
          </span>
        </div>
      </div>

      <Table columns={columns} data={products} rowKey="id" />
    </section>
  );
}

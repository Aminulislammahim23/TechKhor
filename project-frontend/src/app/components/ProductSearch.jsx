export default function ProductSearch({
  query,
  onQueryChange,
  products,
  loading,
  onAddProduct,
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
      <h3 className="text-lg font-semibold text-white">Product Search</h3>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search product by name..."
        className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
      />

      <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
        {loading ? <p className="text-sm text-slate-400">Searching products...</p> : null}
        {!loading && products.length === 0 ? (
          <p className="text-sm text-slate-400">No products found.</p>
        ) : null}

        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{product.name}</p>
                <p className="mt-1 text-sm text-slate-400">Stock: {product.stock}</p>
                <p className="mt-1 text-sm text-cyan-300">
                  BDT {Number(product.price).toLocaleString("en-BD")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAddProduct(product)}
                className="rounded-xl bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

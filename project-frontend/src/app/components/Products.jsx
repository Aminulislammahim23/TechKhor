import ProductCard from "./ProductCard";

export default function Products({ products = [], title = "Featured Products", subtitle }) {
  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Handpicked</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            {subtitle || "Explore the most popular gadgets and accessories designed to elevate your day."}
          </p>
        </div>
      </div>

      <div className="-mx-4 flex snap-x gap-6 overflow-x-auto px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id || product._id || product.slug || product.name} className="min-w-[290px] snap-start sm:min-w-[360px] xl:min-w-[390px]">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
            No featured products are available right now.
          </div>
        )}
      </div>
    </section>
  );
}

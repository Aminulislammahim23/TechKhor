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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id || product._id || product.slug || product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

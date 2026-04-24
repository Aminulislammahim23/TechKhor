import { Link } from "react-router-dom";
import TechVisual from "./TechVisual";

function formatPrice(value) {
  if (typeof value === "string") return value;
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductCard({ product }) {
  const href = product?.slug ? `/products/${product.slug}` : product?._id ? `/products/${product._id}` : "/products";

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-slate-950/30 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/[0.07]">
      <div className="p-4">
        {product?.image ? (
          <div className="overflow-hidden rounded-2xl bg-slate-900">
            <img
              src={product.image}
              alt={product.name}
              className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <TechVisual variant={product?.variant || "hero"} className="h-56" />
        )}
      </div>

      <div className="space-y-4 px-5 pb-5">
        {product?.tag ? (
          <span className="inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-400/20">
            {product.tag}
          </span>
        ) : null}

        <div>
          <h3 className="text-lg font-semibold text-white">{product?.name}</h3>
          <p className="mt-1 text-sm text-slate-400">Premium gadget built for modern routines.</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Price</p>
            <p className="text-xl font-bold text-white">BDT {formatPrice(product?.price)}</p>
          </div>

          <Link
            to={href}
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

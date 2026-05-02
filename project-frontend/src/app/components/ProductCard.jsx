import { Link } from "react-router-dom";
import TechVisual from "./TechVisual";

function formatPrice(value) {
  if (typeof value === "string") return value;
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductCard({ product, onAddToCart }) {
  const productId = product?.id ?? product?._id;
  const href = productId ? `/products/${productId}` : "/products";
  const categoryName = product?.category?.name || product?.categoryName || "Uncategorized";
  const inStock = Number(product?.stock ?? 0) > 0;
  const regularPrice = Number(product?.price);
  const offerPrice = Number(product?.offerPrice);
  const hasOffer = Boolean(product?.isOffer) && Number.isFinite(offerPrice) && offerPrice > 0 && offerPrice < regularPrice;

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
        {product?.tags ? (
          <span className="inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-400/20">
            {product.tags}
          </span>
        ) : null}
        {hasOffer ? (
          <span className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/20">
            Best deal
          </span>
        ) : null}

        <div>
          <h3 className="text-lg font-semibold text-white">{product?.name}</h3>
          <p className="mt-1 line-clamp-3 text-sm text-slate-400">
            {product?.description || "Premium gadget built for modern routines."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span>Category: {categoryName}</span>
          <span>Stock: {product?.stock ?? 0}</span>
          <span className={inStock ? "text-emerald-300" : "text-rose-300"}>{inStock ? "In stock" : "Out of stock"}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Price</p>
            {hasOffer ? (
              <div>
                <p className="text-xl font-bold text-white">BDT {formatPrice(offerPrice)}</p>
                <p className="text-sm text-slate-500 line-through">BDT {formatPrice(regularPrice)}</p>
              </div>
            ) : (
              <p className="text-xl font-bold text-white">BDT {formatPrice(product?.price)}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onAddToCart ? (
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                disabled={!inStock}
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-300"
              >
                Add to Cart
              </button>
            ) : null}
            <Link
              to={href}
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

import { Link, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";

export default function ProductDetails() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Product details</p>
        <h1 className="mt-3 text-3xl font-bold text-white">{product?.name || "Product page"}</h1>
        {loading ? <p className="mt-3 text-slate-400">Loading product...</p> : null}
        {error ? <p className="mt-3 text-rose-300">{error}</p> : null}
        {!loading && !error ? (
          <p className="mt-3 text-slate-400">
            {product?.description || (
              <>
                Route active for <span className="text-white">{id || "selected product"}</span>.
              </>
            )}
          </p>
        ) : null}
        <Link to="/products" className="mt-8 inline-flex rounded-full bg-white px-5 py-3 font-semibold text-slate-950">
          Back to Products
        </Link>
      </div>
    </div>
  );
}

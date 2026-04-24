import { Link, useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Product details</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Product page</h1>
        <p className="mt-3 text-slate-400">
          Route active for <span className="text-white">{id || "selected product"}</span>.
        </p>
        <Link to="/products" className="mt-8 inline-flex rounded-full bg-white px-5 py-3 font-semibold text-slate-950">
          Back to Products
        </Link>
      </div>
    </div>
  );
}

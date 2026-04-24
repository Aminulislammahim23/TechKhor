import { Link } from "react-router-dom";

export default function Cart() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Your cart</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Shopping cart</h1>
        <p className="mt-3 text-slate-400">Your cart UI can be wired here when checkout is added.</p>
        <Link to="/products" className="mt-8 inline-flex rounded-full bg-white px-5 py-3 font-semibold text-slate-950">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

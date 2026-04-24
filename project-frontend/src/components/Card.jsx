export default function Card({ title, value, change, accent }) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-glow">
      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} ring-1 ring-white/10`}>
        <div className="h-4 w-4 rounded-full bg-white/80 shadow-[0_0_24px_rgba(255,255,255,0.45)]" />
      </div>
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h3 className="text-3xl font-semibold tracking-tight text-white">{value}</h3>
      </div>
      <p className="mt-4 text-sm text-slate-400">{change}</p>
    </article>
  );
}

export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={`animate-fade-in-up rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:shadow-glow ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Analytics</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
          {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

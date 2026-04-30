export default function Card({ title, value, change, accent, icon, tone = "dark" }) {
  const isLight = tone === "light";

  return (
    <article
      className={`group rounded-2xl p-6 shadow-xl transition duration-300 hover:-translate-y-1 ${
        isLight
          ? "border border-slate-200 bg-white shadow-slate-200/70 hover:border-cyan-200 hover:shadow-cyan-100/70"
          : "border border-white/10 bg-slate-900/70 shadow-slate-950/30 backdrop-blur hover:border-cyan-400/30 hover:shadow-glow"
      }`}
    >
      <div
        className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${
          accent || "from-cyan-400 to-blue-500"
        } ring-1 ${isLight ? "ring-slate-200" : "ring-white/10"}`}
      >
        {icon ? (
          <span className="text-xl font-bold text-white">{icon}</span>
        ) : (
          <div className="h-4 w-4 rounded-full bg-white/80 shadow-[0_0_24px_rgba(255,255,255,0.45)]" />
        )}
      </div>
      <p
        className={`text-sm font-medium uppercase tracking-[0.2em] ${
          isLight ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {title}
      </p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h3 className={`text-3xl font-semibold tracking-tight ${isLight ? "text-slate-950" : "text-white"}`}>
          {value}
        </h3>
      </div>
      {change ? <p className={`mt-4 text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>{change}</p> : null}
    </article>
  );
}

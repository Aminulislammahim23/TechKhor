export default function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-slate-950 px-6 py-10 shadow-glow sm:px-10 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Stay updated</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join the TechKhor newsletter
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Get product drops, special offers, and accessory recommendations delivered straight to your inbox.
            </p>
          </div>

          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/40 focus:bg-white/10"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

import { benefits } from "../data/landingData";

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Why TechKhor</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Why Choose Us</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
          >
            <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600" />
            <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
            <p className="mt-3 leading-7 text-slate-400">{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

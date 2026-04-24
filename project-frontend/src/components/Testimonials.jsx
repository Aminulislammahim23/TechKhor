import { testimonials } from "../data/landingData";

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${index < rating ? "fill-current" : "fill-white/15"}`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.27 5.82.84-4.21 4.1.99 5.8L10 14.8 4.8 17.5l.99-5.8-4.2-4.1 5.81-.84L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Customer voices</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Testimonials</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
          >
            <Stars rating={item.rating} />
            <p className="mt-5 leading-7 text-slate-300">"{item.comment}"</p>
            <div className="mt-6">
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-sm text-slate-500">Verified buyer</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

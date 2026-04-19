import { Star } from "lucide-react";

const reviews = [
  {
    name: "Maya K.",
    role: "Designer",
    text: "The Aurora headphones are unreal. Shipping took 2 days and packaging felt premium.",
    color: "from-primary/30",
  },
  {
    name: "Devon R.",
    role: "Streamer",
    text: "Best gadget shop I have used. Support actually helped me pick the right keyboard for my setup.",
    color: "from-secondary/30",
  },
  {
    name: "Aisha P.",
    role: "Engineer",
    text: "Prices beat every site I checked. The smartwatch arrived perfect and I am already on my second order.",
    color: "from-accent/30",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-medium text-accent">Loved by 50k+ buyers</p>
          <h2 className="text-3xl font-bold sm:text-5xl">
            Real reviews. <span className="text-gradient-brand">No filters.</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="relative overflow-hidden rounded-3xl border border-border bg-gradient-card p-7"
            >
              <div className={`absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${r.color} to-transparent blur-2xl`} />
              <div className="relative">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-foreground/90">&quot;{r.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand font-bold text-primary-foreground">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import { Headphones, Truck, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  { icon: Sparkles, title: "Curated quality", desc: "Every product hand-tested by our team before it hits the shelf." },
  { icon: Truck, title: "Lightning shipping", desc: "Same-day dispatch on orders before 4pm. Free over $49." },
  { icon: ShieldCheck, title: "2-year warranty", desc: "If it breaks, we replace it. No questions, no fine print." },
  { icon: Headphones, title: "Real human support", desc: "Chat with our gadget nerds 7 days a week." },
];

export function WhyUs() {
  return (
    <section id="why" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-accent">Why TECHKHOR</p>
            <h2 className="text-3xl font-bold leading-tight sm:text-5xl">
              Built for <span className="text-gradient-brand">obsessive</span> tech lovers.
            </h2>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              We are not a marketplace dumping ground. Every gadget here earned its spot, and we back it with proper service.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((it) => (
              <div
                key={it.title}
                className="rounded-2xl border border-border bg-gradient-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand shadow-glow-magenta">
                  <it.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mb-1 font-display font-bold">{it.title}</h3>
                <p className="text-sm text-muted-foreground">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

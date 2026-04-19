import { Truck, Zap, RotateCcw, ShieldCheck } from "lucide-react";

const items = [
  { icon: Truck, text: "Free shipping over $49" },
  { icon: Zap, text: "24h dispatch" },
  { icon: RotateCcw, text: "30-day returns" },
  { icon: ShieldCheck, text: "2-year warranty" },
];

export function PromoStrip() {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <section className="relative py-4 border-y border-border bg-gradient-brand-soft overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {loop.map((it, i) => (
          <div key={i} className="flex items-center gap-2 mx-8 text-sm font-medium">
            <it.icon className="h-4 w-4 text-accent" />
            {it.text}
          </div>
        ))}
      </div>
    </section>
  );
}

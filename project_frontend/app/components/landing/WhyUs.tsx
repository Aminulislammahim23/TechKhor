import { motion } from "framer-motion";
import { Headphones, Truck, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  { icon: Sparkles, title: "Curated quality", desc: "Every product hand-tested by our team before it hits the shelf." },
  { icon: Truck, title: "Lightning shipping", desc: "Same-day dispatch on orders before 4pm. Free over $49." },
  { icon: ShieldCheck, title: "2-year warranty", desc: "If it breaks, we replace it. No questions, no fine print." },
  { icon: Headphones, title: "Real human support", desc: "Chat with our gadget nerds 7 days a week." },
];

export function WhyUs() {
  return (
    <section id="why" className="py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-medium text-accent mb-2">Why Voltix</p>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
              Built for <span className="text-gradient-brand">obsessive</span> tech lovers.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg max-w-md">
              We're not a marketplace dumping ground. Every gadget here earned its spot — and we back it with proper service.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((it, i) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl bg-gradient-card border border-border p-6 hover:border-primary/50 transition-colors"
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-magenta mb-4">
                  <it.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold mb-1">{it.title}</h3>
                <p className="text-sm text-muted-foreground">{it.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

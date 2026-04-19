import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Maya K.", role: "Designer", text: "The Aurora headphones are unreal. Shipping took 2 days and packaging felt premium.", color: "from-primary/30" },
  { name: "Devon R.", role: "Streamer", text: "Best gadget shop I've used. Support actually helped me pick the right keyboard for my setup.", color: "from-secondary/30" },
  { name: "Aisha P.", role: "Engineer", text: "Prices beat every site I checked. The smartwatch arrived perfect — already on my second order.", color: "from-accent/30" },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-accent mb-2">Loved by 50k+ buyers</p>
          <h2 className="text-3xl sm:text-5xl font-bold">Real reviews. <span className="text-gradient-brand">No filters.</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-3xl p-7 border border-border bg-gradient-card overflow-hidden`}
            >
              <div className={`absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br ${r.color} to-transparent blur-2xl`} />
              <div className="relative">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-6">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

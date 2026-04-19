import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import audio from "@/assets/cat-audio.jpg";
import wear from "@/assets/cat-wearables.jpg";
import charge from "@/assets/cat-charging.jpg";
import gaming from "@/assets/cat-gaming.jpg";

const cats = [
  { title: "Audio", count: "120+ items", img: audio, accent: "from-primary/40 to-transparent" },
  { title: "Wearables", count: "60+ items", img: wear, accent: "from-accent/40 to-transparent" },
  { title: "Charging", count: "85+ items", img: charge, accent: "from-secondary/40 to-transparent" },
  { title: "Gaming", count: "150+ items", img: gaming, accent: "from-primary/40 to-transparent" },
];

export function Categories() {
  return (
    <section id="categories" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium text-accent mb-2">Browse</p>
            <h2 className="text-3xl sm:text-5xl font-bold">Shop by <span className="text-gradient-brand">category</span></h2>
          </div>
          <p className="text-muted-foreground max-w-md">Find exactly what you need across our curated collections.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cats.map((c, i) => (
            <motion.a
              key={c.title}
              href="#featured"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-border bg-surface"
            >
              <img src={c.img} alt={c.title} loading="lazy" width={768} height={768} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.accent}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.count}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow-magenta group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

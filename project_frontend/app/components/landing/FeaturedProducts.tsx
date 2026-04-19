import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";
import h from "@/assets/prod-headphones.jpg";
import e from "@/assets/prod-earbuds.jpg";
import w from "@/assets/prod-watch.jpg";
import p from "@/assets/prod-powerbank.jpg";

const products = [
  { name: "Aurora Pro Headphones", price: 149, old: 199, img: h, tag: "Bestseller", rating: 4.9 },
  { name: "Pulse Wireless Earbuds", price: 79, old: 109, img: e, tag: "New", rating: 4.8 },
  { name: "Nova Smartwatch X2", price: 199, old: 249, img: w, tag: "-20%", rating: 4.7 },
  { name: "Volt 20K Power Bank", price: 49, old: 69, img: p, tag: "Hot", rating: 4.9 },
];

export function FeaturedProducts() {
  return (
    <section id="featured" className="py-20 lg:py-28 relative">
      <div className="absolute top-1/2 left-0 h-[400px] w-[400px] rounded-full bg-secondary/15 blur-3xl -translate-y-1/2" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-accent mb-2">Featured</p>
          <h2 className="text-3xl sm:text-5xl font-bold">This week's <span className="text-gradient-brand">hot drops</span></h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Limited stock. Free shipping. Zero hassle.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod, i) => (
            <motion.div
              key={prod.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative rounded-3xl overflow-hidden bg-gradient-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-glow-magenta"
            >
              <div className="absolute top-3 left-3 z-10 rounded-full bg-gradient-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-glow-magenta">
                {prod.tag}
              </div>
              <div className="aspect-square overflow-hidden bg-surface">
                <img src={prod.img} alt={prod.name} loading="lazy" width={896} height={896} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  {prod.rating}
                </div>
                <h3 className="font-display font-semibold mb-3 leading-tight">{prod.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-display font-bold text-gradient-brand">${prod.price}</span>
                    <span className="text-xs text-muted-foreground line-through">${prod.old}</span>
                  </div>
                  <button className="h-9 w-9 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow-magenta hover:scale-110 transition-transform">
                    <ShoppingBag className="h-4 w-4 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

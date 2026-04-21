import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import h from "@/assests/prod-headphones.jpg";
import e from "@/assests/prod-earbuds.jpg";
import w from "@/assests/prod-watch.jpg";
import p from "@/assests/prod-powerbank.jpg";

const products = [
  { name: "Aurora Pro Headphones", price: 149, old: 199, img: h, tag: "Bestseller", rating: 4.9 },
  { name: "Pulse Wireless Earbuds", price: 79, old: 109, img: e, tag: "New", rating: 4.8 },
  { name: "Nova Smartwatch X2", price: 199, old: 249, img: w, tag: "-20%", rating: 4.7 },
  { name: "Volt 20K Power Bank", price: 49, old: 69, img: p, tag: "Hot", rating: 4.9 },
];

export function FeaturedProducts() {
  return (
    <section id="featured" className="relative py-20 lg:py-28">
      <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-secondary/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-medium text-accent">Featured</p>
          <h2 className="text-3xl font-bold sm:text-5xl">
            This week <span className="text-gradient-brand">hot drops</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Limited stock. Free shipping. Zero hassle.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((prod) => (
            <div
              key={prod.name}
              className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow-magenta"
            >
              <div className="absolute left-3 top-3 z-10 rounded-full bg-gradient-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-glow-magenta">
                {prod.tag}
              </div>
              <div className="aspect-square overflow-hidden bg-surface">
                <Image
                  src={prod.img}
                  alt={prod.name}
                  width={896}
                  height={896}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  {prod.rating}
                </div>
                <h3 className="mb-3 font-display font-semibold leading-tight">{prod.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-display font-bold text-gradient-brand">${prod.price}</span>
                    <span className="text-xs text-muted-foreground line-through">${prod.old}</span>
                  </div>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand shadow-glow-magenta transition-transform hover:scale-110">
                    <ShoppingBag className="h-4 w-4 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
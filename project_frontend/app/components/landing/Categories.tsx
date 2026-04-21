import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import audio from "@/assests/cat-audio.jpg";
import wear from "@/assests/cat-wearables.jpg";
import charge from "@/assests/cat-charging.jpg";
import gaming from "@/assests/cat-gaming.jpg";

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
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-accent">Browse</p>
            <h2 className="text-3xl font-bold sm:text-5xl">
              Shop by <span className="text-gradient-brand">category</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">Find exactly what you need across our curated collections.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((c) => (
            <a
              key={c.title}
              href="#featured"
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-surface"
            >
              <Image
                src={c.img}
                alt={c.title}
                width={768}
                height={768}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.accent}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <h3 className="text-xl font-display font-bold">{c.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.count}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand shadow-glow-magenta transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assests/hero-gadgets.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-28 lg:pb-32 lg:pt-36">
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/30 blur-3xl animate-pulse-glow" />
      <div
        className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-secondary/30 blur-3xl animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl animate-pulse-glow"
        style={{ animationDelay: "4s" }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            New drops every week
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
            Gadgets that <span className="text-gradient-brand">spark</span> your everyday.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Premium electronics and accessories - handpicked headphones, wearables, chargers, and gaming gear. Fast shipping, unbeatable prices.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#featured"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-magenta transition-transform hover:scale-105"
            >
              Shop now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-surface-elevated"
            >
              Browse categories
            </a>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
            {[
              { k: "50k+", v: "Happy buyers" },
              { k: "4.9*", v: "Avg rating" },
              { k: "24h", v: "Fast shipping" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-2xl font-display font-bold text-gradient-brand">{s.k}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-elevated animate-float-slow">
            <Image
              src={heroImg}
              alt="Premium electronics gadgets with vibrant neon glow"
              width={1536}
              height={1536}
              className="h-auto w-full"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-gradient-card p-4 shadow-elevated backdrop-blur-xl sm:block">
            <div className="text-xs text-muted-foreground">Free shipping over</div>
            <div className="text-xl font-display font-bold text-gradient-brand">$49</div>
          </div>
        </div>
      </div>
    </section>
  );
}
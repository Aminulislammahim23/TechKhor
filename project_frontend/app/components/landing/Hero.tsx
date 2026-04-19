import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-gadgets.jpg";

export function Hero() {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/30 blur-3xl animate-pulse-glow" />
      <div className="absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-secondary/30 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl animate-pulse-glow" style={{ animationDelay: "4s" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            New drops every week
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            Gadgets that <span className="text-gradient-brand">spark</span> your everyday.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Premium electronics & accessories — handpicked headphones, wearables, chargers, and gaming gear. Fast shipping, unbeatable prices.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#featured" className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-magenta hover:scale-105 transition-transform">
              Shop now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#categories" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur px-7 py-3.5 text-sm font-semibold hover:bg-surface-elevated transition-colors">
              Browse categories
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {[
              { k: "50k+", v: "Happy buyers" },
              { k: "4.9★", v: "Avg rating" },
              { k: "24h", v: "Fast shipping" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-2xl font-display font-bold text-gradient-brand">{s.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-border animate-float-slow">
            <img src={heroImg} alt="Premium electronics gadgets with vibrant neon glow" width={1536} height={1536} className="w-full h-auto" />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-gradient-card backdrop-blur-xl border border-border p-4 shadow-elevated hidden sm:block">
            <div className="text-xs text-muted-foreground">Free shipping over</div>
            <div className="text-xl font-display font-bold text-gradient-brand">$49</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

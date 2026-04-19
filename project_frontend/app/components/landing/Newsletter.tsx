import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border p-8 sm:p-14 text-center">
          <div className="absolute inset-0 bg-gradient-brand opacity-20" />
          <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
          <div className="relative">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow-magenta mb-6">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Get <span className="text-gradient-brand">10% off</span> your first order</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Join the Voltix list for early drops, member-only deals, and gadget nerd-outs.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 h-12 rounded-full bg-background/60 backdrop-blur border border-border px-5 text-sm outline-none focus:border-primary transition-colors"
              />
              <button type="submit" className="h-12 px-6 rounded-full bg-gradient-brand text-sm font-semibold text-primary-foreground shadow-glow-magenta hover:scale-105 transition-transform inline-flex items-center justify-center gap-2">
                {done ? (<><Check className="h-4 w-4" /> Subscribed</>) : "Get my code"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

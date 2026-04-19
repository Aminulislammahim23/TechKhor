"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border p-8 text-center sm:p-14">
          <div className="absolute inset-0 bg-gradient-brand opacity-20" />
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
          <div className="relative">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow-magenta">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Get <span className="text-gradient-brand">10% off</span> your first order
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Join the TECHKHOR list for early drops, member-only deals, and gadget nerd-outs.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setDone(true);
              }}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 flex-1 rounded-full border border-border bg-background/60 px-5 text-sm outline-none backdrop-blur transition-colors focus:border-primary"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 text-sm font-semibold text-primary-foreground shadow-glow-magenta transition-transform hover:scale-105"
              >
                {done ? (
                  <>
                    <Check className="h-4 w-4" />
                    Subscribed
                  </>
                ) : (
                  "Get my code"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

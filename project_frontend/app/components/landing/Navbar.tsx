"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-brand shadow-glow-magenta group-hover:scale-110 transition-transform" />
          <span className="font-display font-bold text-lg tracking-tight">TECHKHOR</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#categories" className="hover:text-foreground transition-colors">Shop</a>
          <a href="#featured" className="hover:text-foreground transition-colors">Deals</a>
          <a href="#why" className="hover:text-foreground transition-colors">Why us</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gradient-brand text-[10px] font-bold flex items-center justify-center text-primary-foreground">3</span>
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted">
            <Menu className="h-4 w-4" />
          </button>
          <div className="hidden md:flex items-center gap-2 ml-2">
            <Link
              href="/login"
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-elevated transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow-magenta"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95 px-4 py-4 flex flex-col gap-3 text-sm">
          <a href="#categories" onClick={() => setOpen(false)}>Shop</a>
          <a href="#featured" onClick={() => setOpen(false)}>Deals</a>
          <a href="#why" onClick={() => setOpen(false)}>Why us</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
          <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
          <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
        </div>
      )}
    </header>
  );
}

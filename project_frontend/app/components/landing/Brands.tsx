const brands = ["SONIQ", "VOLTRA", "PIXELON", "NEXAR", "KOROS", "LUMEN", "OMNIX"];

export function Brands() {
  return (
    <section className="py-12 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">Brands we carry</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {brands.map((b) => (
            <span key={b} className="font-display font-bold text-xl tracking-tight text-muted-foreground/70 hover:text-gradient-brand transition-colors cursor-default">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

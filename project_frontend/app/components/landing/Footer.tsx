import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-brand shadow-glow-magenta" />
              <span className="font-display font-bold text-lg">Voltix</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">Premium electronics & accessories, curated for people who care about the details.</p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-gradient-brand hover:border-transparent transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Shop", links: ["Audio", "Wearables", "Charging", "Gaming", "All deals"] },
            { title: "Help", links: ["Shipping", "Returns", "Warranty", "FAQ", "Contact"] },
            { title: "Company", links: ["About", "Reviews", "Careers", "Press", "Affiliates"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="hover:text-foreground transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Voltix. All rights reserved.</p>
          <p>Built with ⚡ for gadget lovers.</p>
        </div>
      </div>
    </footer>
  );
}

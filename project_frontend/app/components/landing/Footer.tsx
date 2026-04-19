import { AtSign, CircleUser, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-brand shadow-glow-magenta" />
              <span className="font-display text-lg font-bold">TECHKHOR</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Premium electronics and accessories, curated for people who care about the details.
            </p>
            <div className="mt-5 flex gap-2">
              {[Globe, AtSign, CircleUser].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:border-transparent hover:bg-gradient-brand"
                >
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
              <h4 className="mb-4 font-display font-semibold">{col.title}</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="transition-colors hover:text-foreground">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>{`(c) ${new Date().getFullYear()} TECHKHOR. All rights reserved.`}</p>
          <p>Built with care for gadget lovers.</p>
        </div>
      </div>
    </footer>
  );
}

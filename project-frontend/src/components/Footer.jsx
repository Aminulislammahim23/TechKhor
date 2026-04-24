import { footerLinks } from "../data/landingData";

const socialLinks = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "X", href: "#", icon: "x" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
];

function SocialIcon({ icon }) {
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="6" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (icon === "x") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M6.5 9.5V18M6.5 6.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10.5 18v-4.7c0-1.8 1.1-3.1 2.8-3.1 1.8 0 2.7 1.2 2.7 3.1V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="6.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M21 6.5c-.6.3-1.3.5-2 .6.7-.4 1.2-1 1.4-1.8-.7.4-1.5.7-2.3.9A3.6 3.6 0 0 0 11.8 9c0 .3 0 .6.1.9A10.2 10.2 0 0 1 4 5.5s-1.5 4 2.2 6.2c-.5 0-1.2-.2-1.7-.4 0 1.8 1.2 3.6 3.3 4-.5.1-1 .1-1.5.1.4 1.5 1.8 2.7 3.6 2.7A7.3 7.3 0 0 1 3 19.4a10.3 10.3 0 0 0 5.6 1.6c6.6 0 10.2-5.6 10.2-10.5v-.5c.7-.5 1.2-1 1.7-1.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-bold text-white">TechKhor</p>
            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
              Premium gadgets and accessories crafted for a cleaner, faster, and smarter digital lifestyle.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/10 hover:text-white"
              >
                <SocialIcon icon={item.icon} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-5">
            {footerLinks.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-slate-300">
                {item.label}
              </a>
            ))}
          </div>
          <p>© {new Date().getFullYear()} TechKhor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

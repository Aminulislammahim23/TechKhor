function VariantFrame({ children, accentClass = "from-cyan-400 via-sky-500 to-blue-600" }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-slate-950 p-4 shadow-glow ring-1 ring-white/10">
      <div className={`absolute inset-0 bg-gradient-to-br ${accentClass} opacity-20`} />
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="relative h-full rounded-[1.6rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}

export default function TechVisual({ variant = "hero", className = "" }) {
  if (variant === "headphones") {
    return (
      <div className={className}>
        <VariantFrame accentClass="from-cyan-400 via-sky-500 to-blue-600">
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 320 220" className="h-full w-full max-w-[280px]" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="hpGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <rect x="40" y="20" width="240" height="180" rx="32" fill="rgba(255,255,255,0.04)" />
              <path d="M86 104c0-43 33-76 74-76s74 33 74 76" stroke="url(#hpGrad)" strokeWidth="18" strokeLinecap="round" />
              <rect x="70" y="100" width="48" height="82" rx="24" fill="url(#hpGrad)" />
              <rect x="202" y="100" width="48" height="82" rx="24" fill="url(#hpGrad)" />
              <rect x="82" y="116" width="24" height="48" rx="12" fill="#08111f" opacity="0.9" />
              <rect x="214" y="116" width="24" height="48" rx="12" fill="#08111f" opacity="0.9" />
              <circle cx="160" cy="128" r="20" fill="white" opacity="0.12" />
              <path d="M128 142c10 10 54 10 64 0" stroke="white" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        </VariantFrame>
      </div>
    );
  }

  if (variant === "watch") {
    return (
      <div className={className}>
        <VariantFrame accentClass="from-violet-500 via-indigo-500 to-sky-500">
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 320 220" className="h-full w-full max-w-[280px]" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="watchGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <rect x="106" y="18" width="108" height="184" rx="40" fill="rgba(255,255,255,0.04)" />
              <rect x="118" y="32" width="84" height="156" rx="28" fill="url(#watchGrad)" />
              <circle cx="160" cy="110" r="28" fill="#08111f" opacity="0.85" />
              <path d="M160 92v20l14 10" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M118 58h84" stroke="white" strokeOpacity="0.2" />
              <path d="M100 66c-22 10-34 25-34 38s12 28 34 38" stroke="url(#watchGrad)" strokeWidth="18" strokeLinecap="round" />
              <path d="M220 66c22 10 34 25 34 38s-12 28-34 38" stroke="url(#watchGrad)" strokeWidth="18" strokeLinecap="round" />
            </svg>
          </div>
        </VariantFrame>
      </div>
    );
  }

  if (variant === "accessories") {
    return (
      <div className={className}>
        <VariantFrame accentClass="from-amber-500 via-orange-500 to-rose-500">
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 320 220" className="h-full w-full max-w-[280px]" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="accGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <rect x="34" y="40" width="96" height="140" rx="26" fill="rgba(255,255,255,0.05)" />
              <rect x="48" y="54" width="68" height="112" rx="18" fill="url(#accGrad)" />
              <rect x="168" y="44" width="116" height="36" rx="18" fill="url(#accGrad)" opacity="0.92" />
              <path d="M182 62h88" stroke="white" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />
              <circle cx="228" cy="136" r="38" fill="rgba(255,255,255,0.05)" />
              <circle cx="228" cy="136" r="20" fill="url(#accGrad)" />
              <path d="M214 136h28" stroke="#08111f" strokeWidth="6" strokeLinecap="round" />
              <path d="M68 182c20-18 40-18 60 0" stroke="white" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
        </VariantFrame>
      </div>
    );
  }

  if (variant === "earbuds") {
    return (
      <div className={className}>
        <VariantFrame accentClass="from-emerald-400 via-cyan-500 to-sky-600">
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 320 220" className="h-full w-full max-w-[280px]" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="budsGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <circle cx="110" cy="100" r="40" fill="rgba(255,255,255,0.05)" />
              <circle cx="110" cy="100" r="22" fill="url(#budsGrad)" />
              <rect x="94" y="116" width="32" height="68" rx="16" fill="url(#budsGrad)" />
              <circle cx="220" cy="100" r="40" fill="rgba(255,255,255,0.05)" />
              <circle cx="220" cy="100" r="22" fill="url(#budsGrad)" />
              <rect x="204" y="116" width="32" height="68" rx="16" fill="url(#budsGrad)" />
              <path d="M110 66c30-30 70-30 100 0" stroke="white" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
        </VariantFrame>
      </div>
    );
  }

  return (
    <div className={className}>
      <VariantFrame accentClass="from-cyan-400 via-sky-500 to-indigo-600">
        <div className="grid h-full grid-cols-2 gap-4">
          <div className="rounded-[1.4rem] border border-white/10 bg-slate-900/80 p-4">
            <div className="mb-3 h-28 rounded-[1rem] bg-gradient-to-br from-cyan-400/90 to-blue-600/90" />
            <div className="space-y-2">
              <div className="h-2 w-20 rounded-full bg-white/35" />
              <div className="h-2 w-14 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4">
              <div className="mb-4 h-20 rounded-[1rem] bg-gradient-to-br from-fuchsia-500/90 to-rose-500/90" />
              <div className="h-2 w-24 rounded-full bg-white/30" />
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 rounded-full bg-emerald-400/80" />
                <div className="h-2 w-16 rounded-full bg-white/20" />
              </div>
              <div className="mt-4 h-2 w-24 rounded-full bg-white/25" />
              <div className="mt-2 h-2 w-16 rounded-full bg-white/15" />
            </div>
          </div>
        </div>
      </VariantFrame>
    </div>
  );
}

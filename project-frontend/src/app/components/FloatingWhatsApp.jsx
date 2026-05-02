const DEFAULT_WHATSAPP_NUMBER = "8801700000000";

function getWhatsAppUrl() {
  const phone = String(process.env.REACT_APP_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER).replace(/[^\d]/g, "");
  const text = encodeURIComponent("Hi TechKhor, I need help with a product.");

  return `https://wa.me/${phone}?text=${text}`;
}

export default function FloatingWhatsApp() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full border border-white/15 bg-slate-950/90 p-2 pr-3 text-white shadow-2xl shadow-slate-950/50 backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-slate-900"
    >
      <span className="relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white">
        <img src="/main-logo.jpeg" alt="" className="h-full w-full object-cover" />
        <span className="absolute right-1 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-rose-500" />
      </span>

      <span className="hidden items-center gap-2 pr-2 text-sm font-semibold text-emerald-200 sm:inline-flex">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2a9.86 9.86 0 0 0-8.53 14.8L2.2 21.6l4.93-1.3A9.86 9.86 0 1 0 12.04 2Zm0 1.8a8.06 8.06 0 0 1 6.88 12.25 8.08 8.08 0 0 1-9.52 3.1l-.34-.14-2.93.77.78-2.84-.16-.36A8.06 8.06 0 0 1 12.04 3.8Zm-3.1 4.2c-.18 0-.47.07-.72.34-.25.28-.95.93-.95 2.26s.98 2.62 1.12 2.8c.14.19 1.9 3.05 4.72 4.15 2.34.92 2.82.74 3.33.7.51-.05 1.64-.67 1.87-1.32.23-.64.23-1.2.16-1.31-.07-.12-.25-.19-.53-.33l-1.58-.78c-.28-.14-.48-.21-.68.07-.2.28-.78.92-.96 1.12-.18.19-.35.21-.63.07-.28-.14-1.2-.44-2.28-1.4-.84-.75-1.4-1.67-1.57-1.95-.16-.28-.02-.44.13-.58.13-.13.28-.35.42-.53.14-.19.18-.32.28-.53.09-.21.04-.39-.03-.53l-.72-1.76c-.19-.44-.38-.46-.55-.47h-.3Z" />
        </svg>
        WhatsApp
      </span>
    </a>
  );
}

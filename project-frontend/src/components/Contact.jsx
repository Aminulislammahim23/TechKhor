import { ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="fab fab-flower fixed bottom-6 right-6 z-50">
      <div tabIndex={0} role="button" className="btn btn-lg btn-circle btn-success">
        <MessageCircle size={24} />
      </div>

      <button className="fab-main-action btn btn-circle btn-lg btn-success" aria-label="Contact us">
        <MessageCircle size={24} />
      </button>

      <a href="tel:+8800000000000" className="btn btn-lg btn-circle" aria-label="Call us">
        <Phone size={22} />
      </a>
      <a href="mailto:support@techkhor.com" className="btn btn-lg btn-circle" aria-label="Email us">
        <Mail size={22} />
      </a>
      <a href="https://facebook.com" className="btn btn-lg btn-circle" aria-label="Facebook">
        <ExternalLink size={22} />
      </a>
    </div>
  );
}

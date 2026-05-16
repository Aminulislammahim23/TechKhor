import { MessageCircle } from "lucide-react";
import facebookIcon from "../assets/icon/facebook.svg";
import instagramIcon from "../assets/icon/instagram.svg";
import whatsappIcon from "../assets/icon/whatsapp.svg";

export default function Contact() {
  return (
    <div className="fab fab-flower fixed bottom-6 right-6 z-50">
      <div tabIndex={0} role="button" className="btn btn-lg btn-circle btn-success">
        <MessageCircle size={24} />
      </div>

      <button className="fab-main-action btn btn-circle btn-lg btn-success" aria-label="Contact us">
        <MessageCircle size={24} />
      </button>

      <a
        href="https://wa.me/8800000000000"
        className="btn btn-lg btn-circle bg-white"
        aria-label="WhatsApp"
        target="_blank"
        rel="noreferrer"
      >
        <img src={whatsappIcon} alt="" className="h-7 w-7" />
      </a>

      <a
        href="https://www.instagram.com/techkhor06"
        className="btn btn-lg btn-circle bg-white"
        aria-label="Instagram"
        target="_blank"
        rel="noreferrer"
      >
        <img src={instagramIcon} alt="" className="h-7 w-7" />
      </a>

      <a
        href="https://www.facebook.com/techkhor06"
        className="btn btn-lg btn-circle bg-white"
        aria-label="Facebook"
        target="_blank"
        rel="noreferrer"
      >
        <img src={facebookIcon} alt="" className="h-7 w-7" />
      </a>
    </div>
  );
}

import React from 'react';
import { MessageCircle, Instagram, Youtube } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappNumber = "919876543210";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi MOJ Jewels! I would like to inquire about your Wholesale & Retail Jewellery collection.')}`;
  const instagramUrl = "https://instagram.com/moj_jewels";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
      {/* Instagram Quick Link */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform border border-white/20"
        title="Follow MOJ Jewels on Instagram"
      >
        <Instagram className="w-5 h-5" />
      </a>

      {/* WhatsApp DM Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs py-3 px-4 rounded-full shadow-2xl hover:scale-105 transition-all border border-emerald-300/40"
      >
        <MessageCircle className="w-5 h-5 animate-pulse shrink-0 mr-2" />
        <span className="hidden sm:inline font-sans">WhatsApp DM to Order</span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full animate-ping" />
      </a>
    </div>
  );
}

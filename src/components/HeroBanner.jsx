import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Copy, Check, ShieldCheck, Tag, MessageCircle, Instagram } from 'lucide-react';

export default function HeroBanner() {
  const { coupons, setCurrentPage } = useStore();
  const [copiedCode, setCopiedCode] = useState('');

  const whatsappNumber = "919876543210";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi MOJ Jewels! I would like to inquire about your Wholesale & Retail Jewellery.')}`;

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  return (
    <section className="relative overflow-hidden bg-[#070a11] py-10 md:py-16 border-b border-gold-500/20">
      <div className="container mx-auto px-4 space-y-10 relative z-10">
        
        {/* User's Banner 1 Image Display */}
        <div className="relative rounded-2xl overflow-hidden gold-border-glow shadow-2xl group">
          <img
            src="/images/moj_banner_1.jpg"
            alt="MOJ Jewels Wholesale & Retail Banner"
            className="w-full h-auto min-h-[180px] md:max-h-[380px] object-cover rounded-2xl transform group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur text-gold-300 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full border border-gold-500/40">
            NEW COLLECTIONS EVERY WEEK
          </div>
        </div>

        {/* Hero Actions & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/30 px-3.5 py-1.5 rounded-full text-gold-300 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Premium Imitation Jewellery • Bridal • Antique • Daily Wear</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
              Elegance in Every Detail <span className="gold-gradient-text">Wholesale & Retail</span>
            </h1>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Discover timeless beauty crafted for you. Order direct via manual UPI QR or connect on WhatsApp & Instagram for custom bridal & antique sets.
            </p>

            {/* Coupons Strip */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gold-400" /> Active Coupon Offers:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {coupons.map((c) => (
                  <div 
                    key={c.code}
                    className="bg-slate-900/90 border border-gold-500/40 rounded-xl px-3 py-1.5 flex items-center space-x-2.5 shadow-md"
                  >
                    <div>
                      <span className="text-xs font-bold text-gold-300 block">{c.code}</span>
                      <span className="text-[10px] text-slate-400">{c.description}</span>
                    </div>
                    <button
                      onClick={() => copyCoupon(c.code)}
                      className="p-1 rounded-md bg-gold-500/20 hover:bg-gold-500/40 text-gold-300 transition-colors"
                      title="Copy Code"
                    >
                      {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setCurrentPage('shop')}
                className="btn-gold-shimmer px-6 py-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xl"
              >
                <span>Browse Wholesale & Retail Items</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp DM to Order</span>
              </a>
            </div>
          </div>

          {/* User's Banner 2 Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden gold-border-glow shadow-2xl group">
              <img
                src="/images/moj_banner_2.jpg"
                alt="Follow MOJ Jewels for Exclusive Updates"
                className="w-full h-auto min-h-[220px] object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

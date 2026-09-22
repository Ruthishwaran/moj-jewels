import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Copy, Check, Tag, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroBanner() {
  const { coupons, banners, setCurrentPage } = useStore();
  const [copiedCode, setCopiedCode] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const whatsappNumber = "918248875865";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi MOJ Jewels! I would like to inquire about your Wholesale & Retail Jewellery.')}`;

  // Default banner images list combining local uploaded banners & store banners
  const slideList = [
    {
      id: 'banner-1',
      imageUrl: '/images/moj_banner_1.jpg',
      title: 'Luxury Wholesale & Retail Collections',
      tagline: 'DIRECT WHOLESALE PRICES • PREMIUM QUALITY',
      badge: 'NEW ARRIVALS 2026'
    },
    {
      id: 'banner-2',
      imageUrl: '/images/moj_banner_2.jpg',
      title: 'Bridal & Royal Antique Masterpieces',
      tagline: 'EXCLUSIVELY DESIGNED FOR BRIDAL ELEGANCE',
      badge: '50% OFF BULK WHOLESALE'
    },
    ...(banners || []).map((b, idx) => ({
      id: b.id || `custom-b-${idx}`,
      imageUrl: b.image || b.imageUrl || '/images/hero_banner.jpg',
      title: b.title || 'MOJ Jewels Premium Jewelry',
      tagline: b.subtitle || '100% Guaranteed Premium Quality',
      badge: 'FEATURED BANNER'
    }))
  ];

  // 5-Second Auto-Slideshow Timer for Banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slideList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideList.length]);

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const nextSlide = () => setCurrentSlideIndex((prev) => (prev + 1) % slideList.length);
  const prevSlide = () => setCurrentSlideIndex((prev) => (prev - 1 + slideList.length) % slideList.length);

  const currentSlide = slideList[currentSlideIndex] || slideList[0];

  return (
    <section className="relative overflow-hidden bg-[#070a11] py-8 md:py-14 border-b border-gold-500/20">
      <div className="container mx-auto px-4 space-y-8 relative z-10">
        
        {/* 5-Second Dynamic Auto-Slideshow Hero Frame */}
        <div className="relative rounded-2xl overflow-hidden gold-border-glow shadow-2xl group bg-slate-950">
          <div className="relative overflow-hidden">
            <img
              key={currentSlide.id}
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className="w-full h-auto min-h-[160px] sm:min-h-[220px] max-h-[300px] sm:max-h-[380px] md:max-h-[440px] object-cover transition-all duration-700 transform group-hover:scale-102"
            />

            {/* Carousel Manual Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-gold-300 p-2 rounded-full backdrop-blur border border-gold-500/30 transition-all opacity-80 hover:opacity-100 z-10"
              title="Previous Banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-gold-300 p-2 rounded-full backdrop-blur border border-gold-500/30 transition-all opacity-80 hover:opacity-100 z-10"
              title="Next Banner (Auto 5-Sec)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slideshow Pagination Dots */}
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
              {slideList.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlideIndex
                      ? 'w-5 bg-gold-400'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── BANNER WORDS PLACED DOWN BELOW THE IMAGE (Unblocking image artwork) ── */}
          <div className="bg-slate-900/95 border-t border-gold-500/30 p-3 sm:p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="inline-block bg-gold-500 text-black text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 shadow-sm">
                {currentSlide.badge}
              </span>
              <h2 className="text-sm sm:text-lg md:text-xl font-serif font-bold text-white leading-tight">
                {currentSlide.title}
              </h2>
              <p className="text-gold-300 text-[10px] sm:text-xs font-medium tracking-wide">
                {currentSlide.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Hero Actions & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/30 px-3.5 py-1.5 rounded-full text-gold-300 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Premium Imitation Jewellery • Wholesale & Retail Direct</span>
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

          {/* Secondary Banner 2 Frame */}
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

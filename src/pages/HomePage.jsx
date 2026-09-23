import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { Sparkles, ShieldCheck, Download, Search, Tag, ArrowRight, Award } from 'lucide-react';

export default function HomePage() {
  const { products, coupons, setCurrentPage, installPwaApp, categories: storeCategories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = storeCategories || ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = selectedCategory === 'All'
    ? safeProducts
    : safeProducts.filter(p => p?.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* PWA 100% Free App Installation Callout */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-gold-900/60 via-slate-900 to-gold-900/60 border border-gold-500/40 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-gold-500 text-black font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                100% FREE OF COST WEB APP
              </span>
              <h3 className="text-2xl font-serif font-bold text-white">
                Install MOJ Jewels directly on your Mobile or Desktop
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Experience instant access, push notification order tracking, and exclusive app-only coupons. No App Store charges!
              </p>
            </div>

            <button
              onClick={installPwaApp}
              className="btn-gold-shimmer px-8 py-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shrink-0 shadow-lg"
            >
              <Download className="w-4 h-4 text-black animate-bounce" />
              <span>Install Free MOJ App</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Jewels Collection */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Exquisite Craftsmanship</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Featured Royal Collections
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold-500 text-black font-semibold shadow-lg'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center pt-6">
          <button
            onClick={() => setCurrentPage('shop')}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-gold-500/30 px-8 py-3.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-2 transition-colors shadow-lg"
          >
            <span>View Full Jewels Catalog ({products.length} Items)</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </button>
        </div>
      </section>

      {/* Offers & Coupons Showcase Section */}
      <section className="bg-slate-950 py-16 border-y border-gold-500/20">
        <div className="container mx-auto px-4 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-gold-400 text-xs font-semibold uppercase tracking-widest">
              Festive Rewards
            </span>
            <h2 className="text-3xl font-serif font-bold text-white">
              Exclusive Coupon Banners
            </h2>
            <p className="text-slate-400 text-xs">
              Apply these coupon promo codes during checkout to unlock instant discounts on your order.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(coupons || []).map((coupon) => (
              <div 
                key={coupon.code}
                className="bg-slate-900/90 border border-gold-500/30 rounded-xl p-3.5 relative overflow-hidden shadow-lg flex flex-col justify-between space-y-2 hover:border-gold-500/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <Tag className="w-3 h-3 text-gold-400" /> {coupon.code}
                  </span>
                  <span className="text-[10px] text-slate-400">Min: ₹{Number(coupon?.minAmount || 0).toLocaleString()}</span>
                </div>

                <div>
                  <h4 className="text-white font-semibold text-xs">{coupon.description}</h4>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(coupon.code);
                    alert(`Coupon code ${coupon.code} copied to clipboard!`);
                  }}
                  className="w-full bg-slate-800 hover:bg-gold-500 hover:text-black text-slate-200 text-[11px] py-1.5 rounded-lg font-semibold transition-colors"
                >
                  Copy Code
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

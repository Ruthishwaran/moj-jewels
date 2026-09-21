import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Heart,
  User,
  Download,
  Menu,
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
  MessageCircle,
  PhoneCall
} from 'lucide-react';

export default function Navbar() {
  const {
    currentPage,
    setCurrentPage,
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthModalOpen,
    user,
    logoutCustomer,
    installPwaApp
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartCount = (cart || []).reduce((acc, i) => acc + (i?.quantity || 0), 0);
  const wishlistCount = (wishlist || []).length;

  const whatsappNumber = "919876543210";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi MOJ Jewels! I would like to order.')}`;

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/95 backdrop-blur-md border-b border-gold-500/20 shadow-2xl">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-amber-900 via-gold-600 to-amber-900 text-[#0b0f19] px-4 py-1.5 text-xs font-semibold tracking-wider">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0b0f19]" />
            <span>WHOLESALE & RETAIL • Use Coupon <strong className="underline">ROYAL10</strong> for 10% OFF</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-[11px]">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline font-bold">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp DM to Order (+91 98765 43210)
            </a>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Premium Imitation & Antique Collections
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Left Side: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Hamburger Toggle on LEFT */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            aria-label="Open Left Menu"
          >
            <Menu className="w-5 h-5 text-gold-400" />
          </button>

          {/* Brand Logo Image & Name */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden gold-border-glow shadow-md group-hover:scale-105 transition-transform bg-white p-0.5 shrink-0">
              <img
                src="/images/moj_logo.jpg"
                alt="MOJ Jewels Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-serif font-bold tracking-widest text-white flex items-center gap-1">
                MOJ <span className="text-gold-400 font-sans text-base sm:text-xl font-light">JEWELS</span>
              </h1>
              <p className="text-[8px] sm:text-[9px] tracking-widest text-gold-300/90 uppercase font-medium">Wholesale & Retail</p>
            </div>
          </div>
        </div>

        {/* Customer Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <button
            onClick={() => setCurrentPage('home')}
            className={`hover:text-gold-400 transition-colors ${currentPage === 'home' ? 'text-gold-400 font-semibold underline underline-offset-8 decoration-gold-400' : 'text-slate-300'}`}
          >
            Home
          </button>

          <button
            onClick={() => setCurrentPage('shop')}
            className={`hover:text-gold-400 transition-colors ${currentPage === 'shop' ? 'text-gold-400 font-semibold underline underline-offset-8 decoration-gold-400' : 'text-slate-300'}`}
          >
            Collections & Items
          </button>

          <button
            onClick={() => setCurrentPage('track')}
            className={`hover:text-gold-400 transition-colors ${currentPage === 'track' ? 'text-gold-400 font-semibold underline underline-offset-8 decoration-gold-400' : 'text-slate-300'}`}
          >
            Track Order
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Order</span>
          </a>
        </nav>

        {/* Customer Action Controls (Right side) */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* PWA App Install Button */}
          <button
            onClick={installPwaApp}
            className="flex items-center space-x-1 bg-gradient-to-r from-gold-500/20 to-gold-400/10 hover:from-gold-500/30 text-gold-300 border border-gold-500/40 px-2.5 py-1.5 rounded-full text-xs font-semibold shadow-inner transition-all"
            title="Install App Free"
          >
            <Download className="w-3.5 h-3.5 text-gold-400 animate-bounce" />
            <span className="hidden sm:inline">Install App</span>
            <span className="bg-gold-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">FREE</span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-slate-300 hover:text-gold-400 transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-300 hover:text-gold-400 transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-gold-500 text-black rounded-full text-[10px] font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Customer Profile / Login */}
          {user ? (
            <button
              onClick={() => setCurrentPage('customer-dashboard')}
              className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 rounded-full text-xs hover:border-gold-400"
            >
              <div className="w-5 h-5 rounded-full bg-gold-500 text-black font-bold flex items-center justify-center text-[10px]">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline text-white font-medium line-clamp-1">{user?.name || 'Customer'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gold-500/10 hover:bg-gold-500 hover:text-black text-gold-300 border border-gold-500/40 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden xs:inline">Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Slide-Out Left Drawer Menu (Mobile) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
          />

          {/* Left Drawer */}
          <div className="relative z-10 w-80 max-w-[85vw] bg-[#0b0f19] border-r border-gold-500/30 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-slide-right">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-gold-500/40">
                    <img src="/images/moj_logo.jpg" alt="" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="font-serif font-bold text-white text-base">MOJ JEWELS</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase text-gold-400 tracking-wider block">Store Menu</span>
                
                <button
                  onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 text-left py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-gold-500/10 text-white font-medium text-xs border border-slate-800"
                >
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Home & Banners</span>
                </button>

                <button
                  onClick={() => { setCurrentPage('shop'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 text-left py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-gold-500/10 text-white font-medium text-xs border border-slate-800"
                >
                  <ShoppingBag className="w-4 h-4 text-gold-400" />
                  <span>Browse All Jewelry Items</span>
                </button>

                <button
                  onClick={() => { setCurrentPage('track'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 text-left py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-gold-500/10 text-white font-medium text-xs border border-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>Track Order Status</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (user) setCurrentPage('customer-dashboard');
                    else setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center space-x-3 text-left py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-gold-500/10 text-white font-medium text-xs border border-slate-800"
                >
                  <User className="w-4 h-4 text-gold-400" />
                  <span>{user ? 'My Profile & Orders' : 'Customer Account / Sign In'}</span>
                </button>
              </div>

              {/* Categories Section */}
              <div className="mt-8 space-y-3">
                <span className="text-[10px] font-bold uppercase text-gold-400 tracking-wider block">Shop Categories</span>
                {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCurrentPage('shop'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-2 text-slate-300 hover:text-gold-300 text-xs pl-3 border-l-2 border-slate-800 hover:border-gold-400 block transition-colors"
                  >
                    {cat} Collection
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Contact */}
            <div className="border-t border-slate-800 pt-4 mt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Direct WhatsApp Order</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

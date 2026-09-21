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
  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

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
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo Image */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden gold-border-glow shadow-md group-hover:scale-105 transition-transform bg-white p-0.5">
            <img
              src="/images/moj_logo.jpg"
              alt="MOJ Jewels Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-widest text-white flex items-center gap-1.5">
              MOJ <span className="text-gold-400 font-sans text-xl font-light">JEWELS</span>
            </h1>
            <p className="text-[9px] tracking-widest text-gold-300/90 uppercase font-medium">Wholesale & Retail • Timeless Beauty</p>
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

        {/* Customer Action Controls */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {/* PWA App Install Button */}
          <button
            onClick={installPwaApp}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-gold-500/20 to-gold-400/10 hover:from-gold-500/30 text-gold-300 border border-gold-500/40 px-3 py-1.5 rounded-full text-xs font-semibold shadow-inner transition-all"
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
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-300 hover:text-gold-400 transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-gold-500 text-black rounded-full text-[10px] font-bold flex items-center justify-center shadow-md">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Customer Profile / Login */}
          {user ? (
            <button
              onClick={() => setCurrentPage('customer-dashboard')}
              className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-full text-xs hover:border-gold-400"
            >
              <div className="w-5 h-5 rounded-full bg-gold-500 text-black font-bold flex items-center justify-center text-[10px]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-white font-medium line-clamp-1">{user.name}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gold-500/10 hover:bg-gold-500 hover:text-black text-gold-300 border border-gold-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Customer Login</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b0f19] border-b border-gold-500/20 px-4 py-4 space-y-3 animate-fade-in text-xs">
          <button
            onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-200 hover:text-gold-400 font-medium"
          >
            Home
          </button>
          <button
            onClick={() => { setCurrentPage('shop'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-200 hover:text-gold-400 font-medium"
          >
            Collections & Items
          </button>
          <button
            onClick={() => { setCurrentPage('track'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-200 hover:text-gold-400 font-medium"
          >
            Track Order Status
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="block py-2 text-emerald-400 font-semibold"
          >
            WhatsApp DM Order
          </a>
        </div>
      )}
    </header>
  );
}

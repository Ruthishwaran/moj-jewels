import React, { useState, useRef, useEffect } from 'react';
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
  PhoneCall,
  Search,
  Tag,
  ArrowRight
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

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
    products,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedProduct
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const totalCartCount = (cart || []).reduce((acc, i) => acc + (i?.quantity || 0), 0);
  const wishlistCount = (wishlist || []).length;

  const whatsappNumber = "918248875865";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi MOJ Jewels! I would like to order.')}`;

  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories.filter(c => c !== 'All') : [];

  // Filter matching categories and products for live search
  const query = (searchQuery || '').trim().toLowerCase();
  
  const matchedCategories = query
    ? safeCategories.filter(cat => cat.toLowerCase().includes(query))
    : safeCategories.slice(0, 5);

  const matchedProducts = query
    ? safeProducts.filter(p => 
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.karat && p.karat.toLowerCase().includes(query))
      ).slice(0, 6)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setCurrentPage('shop');
    setIsSearchFocused(false);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('shop');
    setIsSearchFocused(false);
  };

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
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline font-bold text-white">
              <WhatsAppIcon className="w-3.5 h-3.5" color="#25D366" /> WhatsApp DM (+91 82488 75865)
            </a>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Premium Imitation & Antique Collections
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
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
              <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold tracking-widest text-white flex items-center gap-1">
                MOJ <span className="text-gold-400 font-sans text-base sm:text-lg md:text-xl font-light">JEWELS</span>
              </h1>
              <p className="text-[8px] sm:text-[9px] tracking-widest text-gold-300 uppercase font-medium">
                Timeless Beauty Made For You 🩷
              </p>
            </div>
          </div>
        </div>

        {/* ── CENTER: LIVE SEARCH BAR WITH CATEGORIES & IMAGE SUGGESTIONS DROPDOWN ── */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative">
            <Search className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search rings, necklaces, earrings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setCurrentPage('shop');
                  setIsSearchFocused(false);
                }
              }}
              className="w-full bg-slate-900/90 border border-gold-500/30 text-white text-xs rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:border-gold-400 placeholder-slate-400 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* ── DROPDOWN SEARCH RESULTS & CATEGORIES POPUP ── */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1322] border border-gold-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in max-h-96 overflow-y-auto">
              {/* Category Suggestions */}
              <div className="p-3 border-b border-slate-800">
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Related Categories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchedCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleSelectCategory(cat)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-gold-500 text-black border-gold-400 font-bold'
                          : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-gold-300 hover:border-gold-500/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Suggestions with Images */}
              {query && (
                <div className="p-3 space-y-2">
                  <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
                    Matching Jewels ({matchedProducts.length})
                  </span>
                  {matchedProducts.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2 text-center">No jewelry items found matching "{searchQuery}"</p>
                  ) : (
                    <div className="space-y-1.5">
                      {matchedProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-gold-500/10 border border-slate-800 hover:border-gold-500/40 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-10 h-10 object-cover rounded-lg bg-slate-950 border border-slate-800"
                            />
                            <div>
                              <h4 className="text-xs font-semibold text-white line-clamp-1">{p.title}</h4>
                              <span className="text-[10px] text-slate-400">{p.karat} • {p.category}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gold-400 shrink-0">
                            ₹{(p.price || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setCurrentPage('shop');
                      setIsSearchFocused(false);
                    }}
                    className="w-full mt-2 bg-slate-900 hover:bg-gold-500 hover:text-black border border-gold-500/30 text-gold-300 text-xs py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <span>View all matching results in Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customer Action Controls (Right side: Wishlist Heart THEN Cart Bag) */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Wishlist Heart Icon (FIRST) */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-slate-300 hover:text-gold-400 transition-colors"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Bag Icon (SECOND — Directly after Heart) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-300 hover:text-gold-400 transition-colors"
            aria-label="Cart Bag"
            title="Checkout Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-gold-500 text-black rounded-full text-[10px] font-bold flex items-center justify-center shadow">
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
              <span className="hidden md:inline text-white font-medium line-clamp-1">{user?.name || 'Customer'}</span>
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

          {/* Left Drawer (Full Screen Height & 80vw Width) */}
          <div className="relative z-10 w-72 sm:w-80 max-w-[80vw] bg-[#0b0f19] border-r border-gold-500/30 h-screen top-0 bottom-0 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl animate-slide-right">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
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

              {/* User Profile Card Section in Mobile Menu */}
              <div className="mb-6 p-3.5 bg-slate-900/90 rounded-2xl border border-gold-500/30 space-y-2">
                {user ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-gold-500 text-black font-bold flex items-center justify-center text-xs">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <strong className="text-white text-xs block font-semibold">{user.name}</strong>
                          <span className="text-[10px] text-slate-400 block line-clamp-1">{user.email}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        user.accountType === 'wholesale' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {user.accountType === 'wholesale' ? 'Wholesale' : 'Retail'}
                      </span>
                    </div>

                    <div className="pt-3 flex gap-2 border-t border-slate-800 mt-2">
                      <button
                        onClick={() => {
                          setCurrentPage('customer-dashboard');
                          setMobileMenuOpen(false);
                        }}
                        className="flex-1 bg-gold-500/20 hover:bg-gold-500 hover:text-black text-gold-300 text-xs py-1.5 rounded-lg font-semibold border border-gold-500/30 transition-colors"
                      >
                        My Account & Orders
                      </button>
                      <button
                        onClick={() => {
                          logoutCustomer();
                          setMobileMenuOpen(false);
                        }}
                        className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs px-3 py-1.5 rounded-lg font-medium"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 py-1">
                    <p className="text-xs text-slate-300 font-medium">Access your saved wishlist & live orders</p>
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full btn-gold-shimmer py-2 rounded-xl text-xs font-bold shadow-md"
                    >
                      Sign In / Create Account
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="space-y-3">
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
              </div>

              {/* Dynamic Categories Section */}
              <div className="mt-6 space-y-2">
                <span className="text-[10px] font-bold uppercase text-gold-400 tracking-wider block">Shop Categories</span>
                {(categories || ['Rings', 'Necklaces', 'Earrings', 'Bracelets']).filter(c => c !== 'All').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCurrentPage('shop'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1.5 text-slate-300 hover:text-gold-300 text-xs pl-3 border-l-2 border-slate-800 hover:border-gold-400 block transition-colors"
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
                className="w-full bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs transition-colors shadow-lg"
              >
                <WhatsAppIcon className="w-4 h-4" color="#25D366" />
                <span>Direct WhatsApp Order</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

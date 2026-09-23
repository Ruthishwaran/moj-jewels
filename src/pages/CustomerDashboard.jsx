import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Package, Heart, Tag, Truck, ShieldCheck, ShoppingBag, Clock, Copy, Check, Sparkles } from 'lucide-react';

export default function CustomerDashboard() {
  const { user, orders, wishlist, coupons, setCurrentPage, setIsAuthModalOpen, logoutCustomer } = useStore();
  const [copiedCode, setCopiedCode] = useState(null);

  const currentUser = user || { name: 'Valued Customer', email: 'guest@mojjewels.com', role: 'customer' };
  const safeOrders = Array.isArray(orders) ? orders : [];
  const myOrders = user?.email
    ? safeOrders.filter(o => o.customerEmail?.toLowerCase() === user.email.toLowerCase() || o.email?.toLowerCase() === user.email.toLowerCase())
    : safeOrders;

  const safeCoupons = Array.isArray(coupons) ? coupons.filter(c => c.active !== false) : [];

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
      {/* Profile Header */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gold-600 to-gold-300 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-gold-400 font-bold text-xl">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-serif font-bold text-white">{currentUser.name}</h1>
              <span className="bg-gold-500/20 text-gold-300 border border-gold-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                {user ? 'VIP CUSTOMER' : 'GUEST SHOPPER'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-center text-xs">
          {!user ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-xl font-bold shadow-md"
            >
              Sign In to Save Orders
            </button>
          ) : (
            <button
              onClick={() => { logoutCustomer(); setCurrentPage('home'); }}
              className="bg-slate-900 hover:bg-rose-950 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-rose-300 px-3.5 py-2 rounded-xl font-semibold transition-colors"
            >
              Logout Account
            </button>
          )}
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Total Orders</span>
            <strong className="text-white text-base font-bold">{myOrders.length}</strong>
          </div>
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Saved Wishlist</span>
            <strong className="text-gold-400 text-base font-bold">{wishlist.length}</strong>
          </div>
        </div>
      </div>

      {/* ── COMPACT COUPONS SECTION (Decreased Size) ── */}
      {safeCoupons.length > 0 && (
        <div className="glass-card p-4 rounded-xl border border-gold-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Exclusive Offers & Coupons
            </h3>
            <span className="text-[10px] text-slate-400">1-Tap Copy Code</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {safeCoupons.map((c) => (
              <div
                key={c.code}
                className="bg-slate-900/90 border border-gold-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs hover:border-gold-400 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <div>
                  <span className="font-mono font-bold text-white text-xs mr-1">{c.code}</span>
                  <span className="text-emerald-400 text-[11px] font-semibold">
                    ({c.discountType === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`})
                  </span>
                  <span className="text-slate-400 text-[10px] block">
                    Min order ₹{Number(c?.minAmount || 0).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCoupon(c.code)}
                  className="ml-1 bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 p-1 rounded transition-colors text-[10px] font-bold flex items-center gap-1"
                  title="Copy Coupon Code"
                >
                  {copiedCode === c.code ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-gold-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-gold-400" /> Order History & Payment Verification Status
          </h2>
          <button
            onClick={() => setCurrentPage('shop')}
            className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-semibold"
          >
            Shop New Jewels
          </button>
        </div>

        {myOrders.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-xs">You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((ord) => (
              <div
                key={ord.id}
                className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-gold-500/40 transition-colors space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-2 text-xs">
                  <div>
                    <span className="text-gold-400 font-mono font-bold text-sm mr-3">Order ID: {ord.id}</span>
                    <span className="text-slate-400">Placed on {new Date(ord.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.paymentStatus === 'Verified'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : ord.paymentStatus === 'Rejected'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      Payment: {ord.paymentStatus}
                    </span>

                    <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                      Order: {ord.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* ── 2-ROW / 2-COLUMN IMAGE GRID FOR ORDER ITEMS ── */}
                  <div className="md:col-span-8">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-2">
                      Purchased Items ({ord.items?.length || 0})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {ord.items.map((it) => (
                        <div
                          key={it.id}
                          className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 group hover:border-gold-500/50 transition-all shadow-md"
                        >
                          <div className="aspect-square w-full relative overflow-hidden">
                            <img
                              src={it.image}
                              alt={it.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Quantity Pill Badge */}
                            <span className="absolute top-1.5 right-1.5 bg-gold-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
                              x{it.quantity}
                            </span>
                          </div>

                          {/* Item Details Bottom Overlay */}
                          <div className="p-1.5 bg-slate-900/90 border-t border-slate-800 text-left">
                            <h4 className="text-white font-medium text-[11px] truncate" title={it.title}>
                              {it.title}
                            </h4>
                            <span className="text-gold-400 font-bold text-[10px] block">
                              ₹{((Number(it?.price) || 0) * (Number(it?.quantity) || 1)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 text-right space-y-2 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Amount</span>
                    <strong className="text-white font-bold text-base">₹{(Number(ord?.total) || 0).toLocaleString()}</strong>
                    <div className="text-[11px] text-slate-400 font-mono">UTR: {ord.transactionId}</div>
                    
                    <button
                      onClick={() => setCurrentPage('track')}
                      className="bg-slate-900 hover:bg-slate-800 text-gold-300 border border-gold-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors mt-2"
                    >
                      <Truck className="w-3.5 h-3.5 text-gold-400" />
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


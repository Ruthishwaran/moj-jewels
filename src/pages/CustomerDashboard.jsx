import React from 'react';
import { useStore } from '../context/StoreContext';
import { User, Package, Heart, Tag, Truck, ShieldCheck, ShoppingBag, Clock } from 'lucide-react';

export default function CustomerDashboard() {
  const { user, orders, wishlist, coupons, setCurrentPage, setIsAuthModalOpen } = useStore();

  const currentUser = user || { name: 'Valued Customer', email: 'guest@mojjewels.com', role: 'customer' };
  const myOrders = orders;

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
          {!user && (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-xl font-bold shadow-md"
            >
              Sign In to Save Orders
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
                  <div className="md:col-span-8 space-y-2">
                    {ord.items.map((it) => (
                      <div key={it.id} className="flex items-center space-x-3 text-xs">
                        <img src={it.image} alt="" className="w-12 h-12 object-cover rounded-lg bg-slate-950" />
                        <div>
                          <h4 className="text-white font-semibold">{it.title}</h4>
                          <span className="text-slate-400 text-[10px]">Qty: {it.quantity} x ₹{it.price.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="md:col-span-4 text-right space-y-2 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Amount</span>
                    <strong className="text-white font-bold text-base">₹{ord.total.toLocaleString()}</strong>
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

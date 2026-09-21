import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function OrderTrackPage() {
  const { orders } = useStore();

  const [searchId, setSearchId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(orders[0] || null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearchOrder = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanId = searchId.trim().toUpperCase();
    const found = orders.find(o => o.id.toUpperCase() === cleanId);
    if (found) {
      setTrackedOrder(found);
    } else {
      setErrorMsg(`No order found matching ID "${searchId}". Please check your order reference.`);
      setTrackedOrder(null);
    }
  };

  const steps = [
    { key: 'Placed', label: 'Order Placed' },
    { key: 'Confirmed', label: 'Payment Verified' },
    { key: 'Packing', label: 'Insured Packing' },
    { key: 'Shipped', label: 'In Transit' },
    { key: 'Delivered', label: 'Delivered' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Confirmed': return 1;
      case 'Packing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = trackedOrder ? getStepIndex(trackedOrder.orderStatus) : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-md mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-semibold uppercase tracking-widest">
          <Truck className="w-4 h-4" />
          <span>Real-Time Tracking</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white">
          Track Your Jewels Shipment
        </h1>
        <p className="text-xs text-slate-400">
          Enter your unique MOJ Order ID to inspect live verification and courier status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="glass-card p-4 rounded-2xl border border-gold-500/30 max-w-xl mx-auto">
        <form onSubmit={handleSearchOrder} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. MOJ-98421 or MOJ-98210)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-gold-400 font-mono"
            />
          </div>
          <button
            type="submit"
            className="btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-semibold shrink-0"
          >
            Track Status
          </button>
        </form>

        {errorMsg && (
          <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
          </p>
        )}
      </div>

      {/* Tracked Order Details Card */}
      {trackedOrder && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-800 space-y-8 animate-fade-in shadow-2xl">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
            <div>
              <span className="text-[10px] uppercase text-slate-400 tracking-widest block">Tracking Order Reference</span>
              <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                Order <span className="text-gold-400 font-mono">{trackedOrder.id}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Placed on {new Date(trackedOrder.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                trackedOrder.paymentStatus === 'Verified'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : trackedOrder.paymentStatus === 'Rejected'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                Payment: {trackedOrder.paymentStatus}
              </span>

              <span className="bg-gold-500/20 text-gold-300 border border-gold-500/40 px-3 py-1 rounded-full text-xs font-bold">
                Order Status: {trackedOrder.orderStatus}
              </span>
            </div>
          </div>

          {/* Visual Order Progress Timeline */}
          <div className="py-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">Order Milestone Timeline</h3>
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
              {steps.map((s, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={s.key} className="flex md:flex-col items-center gap-3 md:gap-2 z-10 flex-1 text-left md:text-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                      isPassed
                        ? 'bg-gold-500 text-black shadow-gold-500/30'
                        : 'bg-slate-900 border border-slate-700 text-slate-500'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <span className={`text-xs font-semibold block ${isPassed ? 'text-white' : 'text-slate-500'}`}>
                        {s.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-gold-400 font-medium">In Progress</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Details Banner (If Shipped) */}
          {trackedOrder.orderStatus === 'Shipped' && (
            <div className="bg-gradient-to-r from-gold-900/40 via-slate-900 to-slate-900 p-4 rounded-xl border border-gold-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-gold-300 font-bold flex items-center gap-1">
                  <Truck className="w-4 h-4 text-gold-400" /> Courier Partner: {trackedOrder.courierPartner || 'BlueDart Express'}
                </span>
                <p className="text-slate-300 font-mono text-xs">
                  Tracking Code: <strong>{trackedOrder.trackingNumber || 'BD7891234IN'}</strong>
                </p>
              </div>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(trackedOrder.courierPartner + ' tracking ' + trackedOrder.trackingNumber)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-gold-500/20 hover:bg-gold-500 hover:text-black text-gold-300 border border-gold-500/40 px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>External Courier Tracker</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Items & Shipping Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 text-xs">
            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Jewelry Items Included:</h4>
              <div className="space-y-2">
                {trackedOrder.items.map((it) => (
                  <div key={it.id} className="flex items-center space-x-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <img src={it.image} alt="" className="w-10 h-10 object-cover rounded bg-slate-950" />
                    <div>
                      <p className="text-white font-semibold line-clamp-1">{it.title}</p>
                      <span className="text-slate-400 text-[10px]">Qty: {it.quantity} x ₹{it.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment Meta */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Delivery & Verification Meta:</h4>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2 text-slate-300">
                <div>
                  <span className="text-slate-500 text-[10px] block">Shipping Address</span>
                  <p className="text-white font-medium">{trackedOrder.shippingAddress}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Customer Contact</span>
                  <p className="text-white font-medium">{trackedOrder.customerName} ({trackedOrder.customerPhone})</p>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Transaction Ref (UTR)</span>
                    <strong className="text-gold-300 font-mono">{trackedOrder.transactionId}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">Total Amount</span>
                    <strong className="text-white">₹{trackedOrder.total.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

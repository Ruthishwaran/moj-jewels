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
  ExternalLink,
  X
} from 'lucide-react';

export default function OrderTrackPage() {
  const { orders, products, setCurrentPage } = useStore();
  const safeOrders = Array.isArray(orders) ? orders : [];
  const [selectedTrackImage, setSelectedTrackImage] = useState(null);

  const [searchId, setSearchId] = useState(() => {
    try {
      return sessionStorage.getItem('moj_track_order_id') || localStorage.getItem('moj_last_placed_order_id') || '';
    } catch (e) {
      return '';
    }
  });

  const [trackedOrder, setTrackedOrder] = useState(() => {
    try {
      const saved = sessionStorage.getItem('moj_track_order_id') || localStorage.getItem('moj_last_placed_order_id');
      if (saved && Array.isArray(orders)) {
        const found = orders.find(o => o.id?.toUpperCase() === saved.trim().toUpperCase());
        if (found) {
          return found;
        }
      }
    } catch (e) {}
    return safeOrders[0] || null;
  });

  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem('moj_track_order_id') || localStorage.getItem('moj_last_placed_order_id');
      if (saved && safeOrders.length > 0) {
        const found = safeOrders.find(o => o.id?.toUpperCase() === saved.trim().toUpperCase());
        if (found) {
          setTrackedOrder(found);
          setSearchId(saved);
        }
      }
    } catch (e) {}
  }, [orders]);

  const [errorMsg, setErrorMsg] = useState('');

  const handleSearchOrder = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanId = searchId.trim().toUpperCase();
    const found = safeOrders.find(o => o.id?.toUpperCase() === cleanId);
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
                {(trackedOrder.items || []).map((it, idx) => {
                  const matchedProduct = (products || []).find(
                    p => String(p.id) === String(it.productId || it.id)
                  );
                  const itemImg = it.image || matchedProduct?.image || (matchedProduct?.images && matchedProduct.images[0]) || '/images/hero_banner.jpg';
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedTrackImage({
                        title: it.title || matchedProduct?.title || 'Jewelry Design',
                        image: itemImg,
                        price: Number(it.price || matchedProduct?.price || 0),
                        quantity: it.quantity || 1,
                        selectedColor: it.selectedColor,
                        selectedSize: it.selectedSize,
                        category: matchedProduct?.category,
                        description: matchedProduct?.description
                      })}
                      className="flex items-center space-x-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 hover:border-gold-500/50 cursor-pointer transition-all group"
                      title="Click to view full high-res jewelry design"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                        <img 
                          src={itemImg} 
                          alt={it.title || 'Jewelry item'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          onError={(e) => { e.target.src = '/images/hero_banner.jpg'; }}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Search className="w-4 h-4 text-gold-300" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold line-clamp-1 group-hover:text-gold-300 transition-colors">{it.title}</p>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                          <span>Qty: {it.quantity || 1} &bull; ₹{(Number(it?.price || matchedProduct?.price || 0)).toLocaleString()}</span>
                          {it.selectedColor && <span className="text-gold-400">&bull; {it.selectedColor}</span>}
                        </div>
                        <span className="text-[9px] text-gold-400/80 block mt-0.5">Click photo to view design</span>
                      </div>
                    </div>
                  );
                })}
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
                {trackedOrder.shippingFee !== undefined && Number(trackedOrder.shippingFee) > 0 && (
                  <div className="flex justify-between text-xs pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400">Insured Shipping Fee:</span>
                    <span className="text-gold-300 font-semibold">₹{Number(trackedOrder.shippingFee).toLocaleString()} ({trackedOrder.shippingState || 'Tamil Nadu'})</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex justify-between">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Transaction Ref (UTR)</span>
                    <strong className="text-gold-300 font-mono">{trackedOrder.transactionId}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">Total Amount</span>
                    <strong className="text-white">₹{(Number(trackedOrder?.total) || 0).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jewelry Product Image Full View Modal */}
      {selectedTrackImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="glass-modal max-w-lg w-full rounded-2xl border border-gold-500/40 p-5 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="min-w-0 pr-3">
                <h3 className="text-white font-serif font-bold text-base truncate">
                  {selectedTrackImage.title}
                </h3>
                {selectedTrackImage.category && (
                  <span className="text-[10px] text-gold-400 uppercase tracking-wider block">
                    {selectedTrackImage.category} Collection
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedTrackImage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-square w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
              <img
                src={selectedTrackImage.image}
                alt={selectedTrackImage.title}
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = '/images/hero_banner.jpg'; }}
              />
            </div>

            {selectedTrackImage.description && (
              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {selectedTrackImage.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-gold-400 font-bold text-base block">
                  ₹{(Number(selectedTrackImage.price) || 0).toLocaleString()}
                </span>
                <span className="text-slate-400 text-[11px]">
                  Ordered Qty: {selectedTrackImage.quantity || 1}
                  {selectedTrackImage.selectedColor && ` • Color: ${selectedTrackImage.selectedColor}`}
                  {selectedTrackImage.selectedSize && ` • Size: ${selectedTrackImage.selectedSize}`}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedTrackImage(null);
                    setCurrentPage('shop');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold"
                >
                  Shop More
                </button>
                <button
                  onClick={() => setSelectedTrackImage(null)}
                  className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-bold text-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

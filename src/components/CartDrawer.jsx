import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles, AlertCircle } from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    removeFromCart,
    subtotal,
    discountAmount,
    grandTotal,
    appliedCoupon,
    coupons,
    applyCouponCode,
    removeCoupon,
    setCurrentPage,
    user
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  const totalCartQty = (cart || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
  const isWholesaleAccount = user?.accountType === 'wholesale';
  const isWholesaleApproved = user?.isApproved !== false;

  // Wholesale constraint rule:
  // 1. Must be accepted/approved by Admin
  // 2. Must have min 5 total items AND min ₹25,000 subtotal
  let isWholesaleCanOrder = true;
  let wholesaleReason = '';

  if (isWholesaleAccount) {
    if (!isWholesaleApproved) {
      isWholesaleCanOrder = false;
      wholesaleReason = 'Pending Admin Acceptance';
    } else if (totalCartQty < 5 || subtotal < 25000) {
      isWholesaleCanOrder = false;
      wholesaleReason = 'Min 5 Items & ₹25k Required';
    }
  }

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCouponCode(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Overlay Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d121f] border-l border-gold-500/30 text-slate-100 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h2 className="text-xl font-serif font-bold">Your Shopping Bag ({cart.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-slate-300 font-serif font-semibold text-lg">Your bag is empty</h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Explore our royal collection of rings, necklaces, and emerald mastercrafts.
                </p>
                <button
                  onClick={() => { setIsCartOpen(false); setCurrentPage('shop'); }}
                  className="btn-gold-shimmer text-xs px-6 py-2.5 rounded-xl font-semibold inline-block"
                >
                  Browse Jewelry Catalog
                </button>
              </div>
            ) : (
              (cart || []).map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg bg-slate-950 border border-slate-800"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-white text-xs font-semibold line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-gold-400 font-medium">{item.karat}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-xs">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="text-slate-400 hover:text-white px-1"
                        >
                          -
                        </button>
                        <span className="px-2 text-white font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="text-slate-400 hover:text-white px-1"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-white font-bold text-sm">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Summary & Coupon */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/80 space-y-4">
              {/* Coupon Form */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. ROYAL10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-700/80 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gold-500/20 hover:bg-gold-500 hover:text-black text-gold-300 border border-gold-500/40 text-xs px-4 py-2 rounded-xl font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {couponFeedback && (
                  <div className={`mt-2 text-[11px] flex items-center gap-1 ${couponFeedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {couponFeedback.success ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    <span>{couponFeedback.message}</span>
                  </div>
                )}

                {appliedCoupon ? (
                  <div className="mt-2 flex items-center justify-between bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-2.5 text-xs">
                    <span className="text-emerald-300 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Code <strong>{appliedCoupon.code}</strong> Applied (-₹{discountAmount.toLocaleString()})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-400 text-[10px] font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  /* ── Available Store Coupons (1-Tap Select in Shopping Bag) ── */
                  Array.isArray(coupons) && coupons.filter(c => c.active !== false).length > 0 && (
                    <div className="mt-2 space-y-1">
                      <span className="text-[10px] text-gold-400 uppercase font-bold tracking-wider block">Tap to Select Coupon:</span>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-0.5">
                        {coupons.filter(c => c.active !== false).map((c) => {
                          const isEligible = subtotal >= (c.minAmount || 0);
                          return (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                const res = applyCouponCode(c.code);
                                setCouponFeedback(res);
                              }}
                              className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 transition-all ${
                                isEligible
                                  ? 'bg-slate-900 border-gold-500/40 text-gold-300 hover:bg-gold-500 hover:text-black'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
                              }`}
                              title={isEligible ? `Apply ${c.code}` : `Min order ₹${c.minAmount}`}
                            >
                              <Tag className="w-3 h-3" />
                              <span>{c.code} ({c.discountType === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Wholesale Account Notices */}
              {isWholesaleAccount && !isWholesaleApproved && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Wholesale Account Awaiting Admin Acceptance:</strong> Your wholesale account must be accepted by Admin before placing bulk orders. Contact WhatsApp <strong className="text-gold-300">+91 82488 75865</strong> for instant acceptance.
                  </p>
                </div>
              )}

              {isWholesaleAccount && isWholesaleApproved && !isWholesaleCanOrder && (
                <div className="bg-rose-500/20 border border-rose-500/40 p-2.5 rounded-xl text-[11px] text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Wholesale Bulk Requirement:</strong> Approved wholesale partners must order a minimum of <strong>5 items</strong> AND <strong>₹25,000 order total</strong> (Current: {totalCartQty} items, ₹{subtotal.toLocaleString()}).
                  </p>
                </div>
              )}

              {/* Summary Calculation */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount:</span>
                    <span>- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Shipping:</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Grand Total:</span>
                  <span className="gold-gradient-text text-lg">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={!isWholesaleCanOrder}
                className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-xl transition-all ${
                  isWholesaleCanOrder
                    ? 'btn-gold-shimmer text-black cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
                }`}
              >
                <span>{isWholesaleCanOrder ? 'Proceed to Checkout' : `Order Restricted (${wholesaleReason})`}</span>
                {isWholesaleCanOrder && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  MapPin,
  User,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Tag,
  X
} from 'lucide-react';

export default function CheckoutPage() {
  const {
    cart,
    subtotal,
    discountAmount,
    grandTotal,
    appliedCoupon,
    coupons,
    applyCouponCode,
    removeCoupon,
    paymentConfig,
    placeOrder,
    playOrderSuccessSound,
    setCurrentPage,
    user
  } = useStore();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">Your bag is empty</h2>
        <p className="text-slate-400 text-xs">Add items to your bag to proceed to checkout.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-semibold"
        >
          Browse Collection
        </button>
      </div>
    );
  }

  const totalCartQty = (cart || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
  const isWholesaleAccount = user?.accountType === 'wholesale';
  const isWholesaleApproved = user?.isApproved !== false;

  const handleNextToPayment = (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !city.trim() || !pincode.trim()) {
      alert('Please fill out all address details.');
      return;
    }

    // Validation 1: City must be letters & spaces only
    const cityRegex = /^[A-Za-z\s]+$/;
    if (!cityRegex.test(city.trim())) {
      alert('Invalid City Name: City must contain letters only (no numbers or special characters).');
      return;
    }

    // Validation 2: Pincode must be exactly 6 digits numbers only
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode.trim())) {
      alert('Invalid Pincode: Pincode must be a 6-digit number (e.g. 560001).');
      return;
    }

    if (isWholesaleAccount) {
      if (!isWholesaleApproved) {
        alert('Wholesale Account Pending Admin Acceptance: Your account must be accepted by Store Admin before placing bulk orders. Contact WhatsApp +91 82488 75865.');
        return;
      }
      if (totalCartQty < 5 || subtotal < 25000) {
        alert('Wholesale Bulk Requirement: Approved wholesale partners must order at least 5 total items AND ₹25,000 order total.');
        return;
      }
    }
    setStep(2);
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      alert('Please enter your 12-digit UTR / Transaction Reference ID from your UPI app.');
      return;
    }

    try {
      setIsPlacingOrder(true);
      const fullAddress = `${shippingAddress.trim()}, ${city.trim()} - ${pincode.trim()}`;
      const newOrd = await placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        shippingAddress: fullAddress,
        paymentMethod: 'Manual UPI QR',
        transactionId: transactionId.trim(),
        notes: notes || 'Submitted by customer'
      });

      setCreatedOrder(newOrd);
      if (playOrderSuccessSound) playOrderSuccessSound();
      setStep(3);
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('Order placement encountered an error. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(paymentConfig.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      {/* Checkout Progress Stepper */}
      {step !== 3 && (
        <div className="flex items-center justify-center space-x-4 md:space-x-12 border-b border-slate-800 pb-6 text-xs font-semibold">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-gold-400' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-gold-500 text-black font-bold' : 'bg-slate-800'}`}>
              1
            </span>
            <span>Shipping Details</span>
          </div>

          <div className="w-8 md:w-16 h-0.5 bg-slate-800" />

          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-gold-400' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-gold-500 text-black font-bold' : 'bg-slate-800'}`}>
              2
            </span>
            <span>Scan QR & Submit UTR</span>
          </div>
        </div>
      )}

      {/* STEP 1: Shipping Address Form */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 glass-card p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-400" /> Delivery Shipping Details
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter destination address for tamper-proof insured courier delivery.
              </p>
            </div>

            <form onSubmit={handleNextToPayment} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Mobile Number (For Courier Updates)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="customer@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Flat / House No / Street Address</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Villa 42, Prestige Palms, M.G. Road"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value.replace(/[^A-Za-z\s]/g, ''))}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Letters & spaces only</span>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 560001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold-400 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">6-digit number</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-gold-shimmer py-3.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 shadow-xl"
              >
                <span>Proceed to Scan Payment QR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-5 space-y-4">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-serif font-bold text-white border-b border-slate-800 pb-3">
                Order Summary ({cart.length} items)
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt="" className="w-10 h-10 object-cover rounded bg-slate-900" />
                      <div>
                        <p className="text-white font-semibold line-clamp-1">{item.title}</p>
                        <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-slate-200 font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* ── COUPON DISCOUNTS SECTION ── */}
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gold-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-gold-400" /> Apply Promo Code
                  </span>
                </div>

                {appliedCoupon ? (
                  <div className="bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-300 font-bold font-mono">{appliedCoupon.code} Applied!</span>
                      <span className="text-[10px] text-emerald-400 block">
                        Saved ₹{discountAmount.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => { removeCoupon(); setCouponMsg(null); }}
                      className="text-slate-400 hover:text-rose-400 p-1"
                      title="Remove Coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!couponInput.trim()) return;
                      const res = applyCouponCode(couponInput);
                      setCouponMsg(res);
                      if (res.success) setCouponInput('');
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-gold-400"
                    />
                    <button
                      type="submit"
                      className="bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponMsg && !appliedCoupon && (
                  <p className={`text-[11px] font-semibold ${couponMsg.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {couponMsg.message}
                  </p>
                )}

                {/* Eligible Coupons List for 1-Tap Apply */}
                {Array.isArray(coupons) && coupons.filter(c => c.active !== false).length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Available Store Coupons:</span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {coupons.filter(c => c.active !== false).map((c) => {
                        const isEligible = subtotal >= (c.minAmount || 0);
                        const isCurrent = appliedCoupon?.code === c.code;

                        return (
                          <div
                            key={c.code}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                              isCurrent
                                ? 'bg-emerald-950/40 border-emerald-500/50'
                                : isEligible
                                ? 'bg-slate-900/80 border-gold-500/30 hover:border-gold-400'
                                : 'bg-slate-950/50 border-slate-800 opacity-60'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-white text-xs">{c.code}</span>
                                <span className="text-emerald-400 font-bold text-[10px]">
                                  {c.discountType === 'percent' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 block">
                                Min order ₹{(c.minAmount || 0).toLocaleString()}
                              </span>
                            </div>

                            {isCurrent ? (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                                Active ✓
                              </span>
                            ) : isEligible ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const res = applyCouponCode(c.code);
                                  setCouponMsg(res);
                                }}
                                className="bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-black border border-gold-500/40 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all"
                              >
                                Apply 1-Tap
                              </button>
                            ) : (
                              <span className="text-[9px] text-slate-500">
                                Need ₹{((c.minAmount || 0) - subtotal).toLocaleString()} more
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Insured Express Shipping</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount Payable</span>
                  <span className="gold-gradient-text">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Manual QR Code Payment & Transaction ID Entry */}
      {step === 2 && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-gold-500/40 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-gold-400 hover:underline flex items-center gap-1 mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Address
              </button>
              <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <QrCode className="w-6 h-6 text-gold-400" /> Pay via Manual UPI QR Code
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Exact Amount to Pay</span>
              <span className="text-2xl font-bold gold-gradient-text">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Store QR Code Image Frame */}
            <div className="md:col-span-5 text-center space-y-3 bg-slate-950 p-6 rounded-2xl border border-gold-500/30">
              <span className="bg-gold-500 text-black text-[10px] font-bold px-3 py-1 rounded-full">
                OFFICIAL MOJ JEWELS QR
              </span>
              <div className="w-56 h-56 mx-auto bg-white p-2 rounded-xl gold-border-glow">
                <img
                  src={paymentConfig.qrImageUrl}
                  alt="MOJ Jewels Payment QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Scan with GPay, PhonePe, Paytm, BHIM or any banking app
              </p>
            </div>

            {/* Bank & UPI Details */}
            <div className="md:col-span-7 space-y-5">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Official UPI ID:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-gold-300 font-mono text-sm">{paymentConfig.upiId}</strong>
                    <button
                      onClick={copyUpiId}
                      className="p-1 text-gold-400 hover:text-white bg-slate-800 rounded"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Payee Name</span>
                    <strong>{paymentConfig.payeeName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Bank Name</span>
                    <strong>{paymentConfig.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Account Number</span>
                    <strong>{paymentConfig.accountNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">IFSC Code</span>
                    <strong>{paymentConfig.ifscCode}</strong>
                  </div>
                </div>
              </div>

              {/* UTR Input Form */}
              <form onSubmit={handleCompleteOrder} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs text-gold-300 font-semibold block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Enter 12-Digit Transaction / UTR Ref ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 426918371902 or UPI Ref No"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-gold-500/60 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-gold-400 shadow-inner"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    You can copy the UTR / Ref ID from your payment app after completing the transfer.
                  </span>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Optional Payment Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Paid via Google Pay from HDFC Bank"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Manual Verification Notice:</strong> Once submitted, our Admin team will manually check your transaction ID and mark your order status as <strong>Confirmed</strong> within 15-30 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full btn-gold-shimmer py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-2xl"
                >
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>Submit Payment & Finalize Order</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Order Confirmation Screen */}
      {step === 3 && createdOrder && (
        <div className="glass-card p-8 md:p-10 rounded-2xl border-2 border-emerald-500/50 text-center space-y-6 max-w-xl mx-auto animate-fade-in shadow-2xl relative overflow-hidden">
          {/* Animated Glowing Ripple Blue/Emerald Tick Badge */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl flex items-center justify-center relative z-10">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 stroke-[2.5]" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ORDER PLACED & PAYMENT RECORDED
            </span>
            <h2 className="text-3xl font-serif font-bold text-white">
              Thank You, {createdOrder.customerName}! 🎉
            </h2>
            <p className="text-xs text-slate-300">
              Your order has been recorded under Order ID <strong className="text-gold-400 font-mono text-sm">{createdOrder.id}</strong>
            </p>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 text-left text-xs space-y-3">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Order Reference:</span>
              <strong className="text-gold-300 font-mono text-sm">{createdOrder.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction ID / UTR:</span>
              <span className="text-white font-mono font-bold">{createdOrder.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Amount Paid:</span>
              <span className="gold-gradient-text font-bold text-base">₹{createdOrder.total?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Shipping Address:</span>
              <span className="text-slate-200 max-w-[220px] text-right line-clamp-2">{createdOrder.shippingAddress}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-slate-400">Payment Verification:</span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-bold text-[10px]">
                {createdOrder.paymentStatus}
              </span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 text-left">
            <span className="text-gold-400 font-bold text-[11px] block">📦 What Happens Next?</span>
            <p className="text-slate-400 text-[11px]">
              Our Admin team will verify your payment UTR within 15–30 minutes and update your order to <strong className="text-white">Confirmed</strong>. Insured express courier dispatch will follow.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentPage('track')}
              className="flex-1 btn-gold-shimmer py-3.5 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Track Order Status Live</span>
            </button>
            <button
              onClick={() => setCurrentPage('shop')}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 py-3.5 rounded-xl text-xs font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

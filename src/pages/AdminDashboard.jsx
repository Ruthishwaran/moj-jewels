import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Check,
  X,
  Plus,
  Trash2,
  Edit,
  QrCode,
  Tag,
  Package,
  Truck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Search,
  Sparkles,
  Settings
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    orders,
    verifyOrderPayment,
    updateOrderStatus,
    products,
    addProduct,
    editProduct,
    deleteProduct,
    coupons,
    addCoupon,
    toggleCouponStatus,
    deleteCoupon,
    paymentConfig,
    setPaymentConfig,
    categories,
    addCategory,
    deleteCategory,
    registeredUsers,
    deleteUserAccount,
    banners
  } = useStore();

  const [activeTab, setActiveTab] = useState('payments'); // 'payments', 'orders', 'products', 'categories', 'customers', 'coupons', 'qr-settings'

  // Dynamic Category State
  const [newCatInput, setNewCatInput] = useState('');

  // Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories && categories[1] ? categories[1] : 'Rings');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('');
  const [newProdKarat, setNewProdKarat] = useState('18k Gold & VVS Diamond');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdImage, setNewProdImage] = useState('/images/hero_banner.jpg');
  const [newProdImages, setNewProdImages] = useState([]); // Base64 images array from local storage file picker
  const [newProdDesc, setNewProdDesc] = useState('');

  // Order Tab Filter State
  const [orderFilterTab, setOrderFilterTab] = useState('All'); // 'All', 'Pending Verification', 'Verified', 'Packaging', 'Shipped', 'Delivered', 'Rejected', 'Returned'

  // Coupon Modal State
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState('percentage');
  const [couponVal, setCouponVal] = useState('10');
  const [couponMin, setCouponMin] = useState('20000');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponExpiry, setCouponExpiry] = useState('2026-12-31');

  // QR Settings State
  const [editUpiId, setEditUpiId] = useState(paymentConfig.upiId);
  const [editPayeeName, setEditPayeeName] = useState(paymentConfig.payeeName);
  const [editBankName, setEditBankName] = useState(paymentConfig.bankName);
  const [editAccountNo, setEditAccountNo] = useState(paymentConfig.accountNumber);
  const [editIfsc, setEditIfsc] = useState(paymentConfig.ifscCode);
  const [editQrImg, setEditQrImg] = useState(paymentConfig.qrImageUrl);
  const [qrSaveMsg, setQrSaveMsg] = useState('');

  // Local Storage QR Code Image Reader
  const handleQrFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditQrImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Shipping Modal State
  const [editingOrderForShipping, setEditingOrderForShipping] = useState(null);
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [trackingCode, setTrackingCode] = useState('');

  // Calculate Metrics
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCoupons = Array.isArray(coupons) ? coupons : [];

  const pendingVerifications = safeOrders.filter(o => o?.paymentStatus === 'Pending Verification');
  const verifiedOrders = safeOrders.filter(o => o?.paymentStatus === 'Verified' || o?.orderStatus === 'Shipped' || o?.orderStatus === 'Delivered');
  const shippedOrders = safeOrders.filter(o => o?.orderStatus === 'Shipped');
  const deliveredOrders = safeOrders.filter(o => o?.orderStatus === 'Delivered');
  const rejectedOrders = safeOrders.filter(o => o?.paymentStatus === 'Rejected');

  // Profit & Loss Financial Calculations
  const totalRevenue = verifiedOrders.reduce((acc, o) => acc + (o?.total || 0), 0);
  const estimatedCOGS = Math.round(totalRevenue * 0.62); // 62% estimated Cost of Goods
  const grossProfit = totalRevenue - estimatedCOGS;
  const marginPercent = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;
  const avgOrderValue = verifiedOrders.length > 0 ? Math.round(totalRevenue / verifiedOrders.length) : 0;

  // Handle Local File Selection (Laptop / Mobile Local Storage)
  const handleImageFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProdImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedImage = (index) => {
    setNewProdImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const finalImages = newProdImages.length > 0 ? newProdImages : [newProdImage || '/images/hero_banner.jpg'];
    addProduct({
      title: newProdTitle,
      category: newProdCategory,
      price: parseFloat(newProdPrice) || 50000,
      originalPrice: parseFloat(newProdOrigPrice) || parseFloat(newProdPrice) || 60000,
      karat: newProdKarat,
      stock: parseInt(newProdStock) || 5,
      image: finalImages[0],
      images: finalImages,
      description: newProdDesc || 'Crafted luxury jewelry piece.'
    });
    setIsAddProductOpen(false);
    setNewProdTitle('');
    setNewProdDesc('');
    setNewProdImages([]);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    addCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      value: parseFloat(couponVal) || 10,
      minAmount: parseFloat(couponMin) || 10000,
      description: couponDesc || `Get discount with ${couponCode}`,
      expiry: couponExpiry,
      active: true
    });
    setIsAddCouponOpen(false);
    setCouponCode('');
  };

  const handleSaveQrConfig = (e) => {
    e.preventDefault();
    setPaymentConfig({
      ...paymentConfig,
      upiId: editUpiId,
      payeeName: editPayeeName,
      bankName: editBankName,
      accountNumber: editAccountNo,
      ifscCode: editIfsc,
      qrImageUrl: editQrImg
    });
    setQrSaveMsg('Payment QR & Bank details saved successfully!');
    setTimeout(() => setQrSaveMsg(''), 3000);
  };

  const handleUpdateShipping = (e) => {
    e.preventDefault();
    if (editingOrderForShipping) {
      updateOrderStatus(
        editingOrderForShipping.id,
        'Shipped',
        courierName,
        trackingCode || `BD-${Math.floor(100000 + Math.random() * 900000)}`
      );
      setEditingOrderForShipping(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Admin Control Center</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">
            MOJ Jewels Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage manual QR payments, approve UTR transaction IDs, dispatch orders & update coupons.
          </p>
        </div>

        {/* Quick Analytics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-amber-500/30">
            <span className="text-slate-400 text-[10px] block">Pending Payments</span>
            <strong className="text-amber-400 text-lg font-bold">{pendingVerifications.length} Orders</strong>
          </div>
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-emerald-500/30">
            <span className="text-slate-400 text-[10px] block">Gross Revenue</span>
            <strong className="text-emerald-400 text-lg font-bold">₹{totalRevenue.toLocaleString()}</strong>
          </div>
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-gold-500/30">
            <span className="text-slate-400 text-[10px] block">Estimated Gross Profit</span>
            <strong className="text-gold-300 text-lg font-bold">₹{grossProfit.toLocaleString()}</strong>
            <span className="text-[10px] text-emerald-400 block font-semibold">Margin: {marginPercent}%</span>
          </div>
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Avg Order Value (AOV)</span>
            <strong className="text-white text-lg font-bold">₹{avgOrderValue.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Financial Profit & Loss Dashboard Banner */}
      <div className="glass-card p-5 rounded-2xl border border-gold-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-gold-400" />
            <h3 className="text-white font-serif font-bold text-sm">Financial Profit & Loss Analysis</h3>
          </div>
          <span className="text-[10px] bg-gold-500/20 text-gold-300 border border-gold-500/40 px-2 py-0.5 rounded-full font-bold uppercase">
            Real-Time Analytics
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-center">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Total Verified Sales</span>
            <strong className="text-emerald-400 font-bold text-sm">₹{totalRevenue.toLocaleString()}</strong>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Est. Cost of Goods (COGS)</span>
            <strong className="text-rose-400 font-bold text-sm">₹{estimatedCOGS.toLocaleString()}</strong>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Net Gross Profit</span>
            <strong className="text-gold-300 font-bold text-sm">₹{grossProfit.toLocaleString()}</strong>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Profit Margin %</span>
            <strong className="text-emerald-400 font-bold text-sm">{marginPercent}%</strong>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 col-span-2 md:col-span-1">
            <span className="text-slate-400 text-[10px] uppercase block">Orders Fulfilled</span>
            <strong className="text-white font-bold text-sm">{verifiedOrders.length} Orders</strong>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'payments'
              ? 'bg-amber-500 text-black shadow-lg'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Manual Payment Desk</span>
          {pendingVerifications.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {pendingVerifications.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'orders'
              ? 'bg-amber-500 text-black shadow-lg'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'products'
              ? 'bg-amber-500 text-black shadow-lg'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Product Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'categories'
              ? 'bg-amber-500 text-black shadow-lg'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4 text-amber-400" />
          <span>Categories ({categories?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'customers'
              ? 'bg-amber-500 text-black shadow-lg'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <User className="w-4 h-4 text-emerald-400" />
          <span>Customer Accounts ({registeredUsers?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'coupons'
              ? 'bg-amber-500 text-black shadow-lg'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Coupons & Banners</span>
        </button>

        <button
          onClick={() => setActiveTab('qr-settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'qr-settings'
              ? 'bg-amber-500 text-black shadow-lg'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>GPay QR & Bank Config</span>
        </button>
      </div>

      {/* TAB 1: Manual Payment Verification Desk */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-400" /> Pending UTR Transaction Verifications
            </h2>
            <span className="text-xs text-slate-400">
              Inspect customer submitted transaction IDs and approve orders.
            </span>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-2">
              <Check className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-white font-semibold">No Pending Payment Verifications</h3>
              <p className="text-xs text-slate-400">All customer orders have been verified!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingVerifications.map((ord) => (
                <div
                  key={ord.id}
                  className="glass-card p-6 rounded-2xl border border-amber-500/40 space-y-4 shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-2 text-xs">
                    <div>
                      <span className="text-gold-400 font-mono font-bold text-sm mr-3">Order ID: {ord.id}</span>
                      <span className="text-slate-400">Submitted at {new Date(ord.date).toLocaleString()}</span>
                    </div>

                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-0.5 rounded-full font-semibold text-[11px]">
                      Pending Verification
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-xs">
                    {/* Customer Info */}
                    <div className="md:col-span-4 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-semibold">Customer Details</span>
                      <p className="text-white font-bold">{ord.customerName}</p>
                      <p className="text-slate-300">{ord.customerPhone}</p>
                      <p className="text-slate-400">{ord.customerEmail}</p>
                      <p className="text-slate-400 text-[11px] line-clamp-2 mt-1">{ord.shippingAddress}</p>
                    </div>

                    {/* Transaction UTR & Amount */}
                    <div className="md:col-span-4 bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-semibold block">Customer Submitted UTR / Ref ID</span>
                        <strong className="text-gold-300 font-mono text-base block">{ord.transactionId}</strong>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                        <span className="text-slate-400">Total Amount:</span>
                        <span className="text-white font-bold text-sm">₹{ord.total.toLocaleString()}</span>
                      </div>
                      {ord.notes && (
                        <p className="text-[10px] text-slate-400 italic">Note: "{ord.notes}"</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-4 space-y-2">
                      <button
                        onClick={() => verifyOrderPayment(ord.id, 'Verified', 'Payment Verified & Approved by Admin')}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Payment & Confirm Order</span>
                      </button>

                      <button
                        onClick={() => {
                          const reason = prompt('Reason for rejecting payment:', 'Transaction ID not found in bank statement');
                          if (reason) verifyOrderPayment(ord.id, 'Rejected', reason);
                        }}
                        className="w-full bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject Payment</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Order Management */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-gold-400" /> Order Management & Tracking
            </h2>

            {/* Categorized Order Status Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
              {[
                { key: 'All', label: `All (${safeOrders.length})` },
                { key: 'Pending Verification', label: `Pending (${pendingVerifications.length})` },
                { key: 'Verified', label: `Verified (${verifiedOrders.length})` },
                { key: 'Shipped', label: `Shipped (${shippedOrders.length})` },
                { key: 'Delivered', label: `Delivered (${deliveredOrders.length})` },
                { key: 'Rejected', label: `Rejected (${rejectedOrders.length})` }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setOrderFilterTab(tab.key)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    orderFilterTab === tab.key
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {safeOrders
              .filter(ord => {
                if (orderFilterTab === 'All') return true;
                if (orderFilterTab === 'Pending Verification') return ord.paymentStatus === 'Pending Verification';
                if (orderFilterTab === 'Verified') return ord.paymentStatus === 'Verified';
                if (orderFilterTab === 'Shipped') return ord.orderStatus === 'Shipped';
                if (orderFilterTab === 'Delivered') return ord.orderStatus === 'Delivered';
                if (orderFilterTab === 'Rejected') return ord.paymentStatus === 'Rejected';
                return true;
              })
              .map((ord) => (
              <div key={ord.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-2 text-xs">
                  <div>
                    <span className="text-gold-400 font-mono font-bold text-sm mr-3">Order ID: {ord.id}</span>
                    <span className="text-slate-300 font-medium">{ord.customerName} ({ord.customerPhone})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.paymentStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      Payment: {ord.paymentStatus}
                    </span>

                    {/* Change Order Status Select */}
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-gold-300 text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>

                    <button
                      onClick={() => setEditingOrderForShipping(ord)}
                      className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1 rounded-lg text-slate-200 flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5 text-gold-400" /> Assign Courier
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between text-xs text-slate-300 gap-4">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Items</span>
                    <p className="font-semibold text-white">
                      {ord.items.map(i => `${i.title} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">UTR Transaction Ref</span>
                    <span className="font-mono text-gold-300">{ord.transactionId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Courier Details</span>
                    <span className="text-white">
                      {ord.courierPartner ? `${ord.courierPartner} (${ord.trackingNumber})` : 'Not dispatched yet'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">Total</span>
                    <strong className="text-white font-bold text-sm">₹{ord.total.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Courier Assignment Modal */}
          {editingOrderForShipping && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="glass-modal border border-gold-500/40 p-6 rounded-2xl max-w-md w-full space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-white font-serif font-bold text-lg">
                    Dispatch Courier for {editingOrderForShipping.id}
                  </h3>
                  <button onClick={() => setEditingOrderForShipping(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateShipping} className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Courier Partner</label>
                    <input
                      type="text"
                      required
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. BlueDart Express, Delhivery"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Tracking Number / AWB</label>
                    <input
                      type="text"
                      required
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      placeholder="e.g. BD7891234IN"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-gold-shimmer py-3 rounded-xl font-semibold"
                  >
                    Save & Mark as Shipped
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Product Catalog Management */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" /> Jewelry Product Inventory
            </h2>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add New Jewelry Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="glass-card p-4 rounded-xl border border-slate-800 flex gap-4 items-center">
                <img src={p.image} alt="" className="w-20 h-20 object-cover rounded-lg bg-slate-950 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] text-gold-400 uppercase font-semibold">{p.category}</span>
                  <h4 className="text-white font-semibold text-xs truncate">{p.title}</h4>
                  <p className="text-slate-300 font-bold text-xs">₹{p.price.toLocaleString()}</p>
                  <span className="text-[10px] text-emerald-400 block">Stock: {p.stock} units</span>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete "${p.title}"?`)) deleteProduct(p.id);
                  }}
                  className="p-2 text-slate-500 hover:text-rose-400 bg-slate-900 rounded-lg"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Product Modal */}
          {isAddProductOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="glass-modal border border-gold-500/40 p-6 rounded-2xl max-w-lg w-full space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-white font-serif font-bold text-lg">Add New Fine Jewelry Item</h3>
                  <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Ruby Solitaire Ring"
                      value={newProdTitle}
                      onChange={(e) => setNewProdTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Category</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                      >
                        <option value="Rings">Rings</option>
                        <option value="Necklaces">Necklaces</option>
                        <option value="Earrings">Earrings</option>
                        <option value="Bracelets">Bracelets</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="75000"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Gold Karat / Gem Info</label>
                      <input
                        type="text"
                        placeholder="22k Gold BIS Hallmarked"
                        value={newProdKarat}
                        onChange={(e) => setNewProdKarat(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        placeholder="10"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-300 font-semibold block text-xs">
                      Product Photos (Select from Phone/Laptop Storage)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFileUpload}
                      className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold-500 file:text-black hover:file:bg-gold-400 cursor-pointer bg-slate-900 border border-slate-700 rounded-xl p-1"
                    />

                    {newProdImages.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
                        {newProdImages.map((img, idx) => (
                          <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gold-500/40 shrink-0 group">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(idx)}
                              className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full p-0.5 text-[9px]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 block mb-1">Or Default Fallback Image URL:</span>
                      <input
                        type="text"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Detailed item description..."
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-gold-shimmer py-3 rounded-xl font-semibold"
                  >
                    Save Product to Catalog
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Coupons Management */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-gold-400" /> Active Store Coupon Codes
            </h2>

            <button
              onClick={() => setIsAddCouponOpen(true)}
              className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Create Coupon Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.code} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gold-300 font-mono font-bold text-base">{c.code}</span>
                  <button
                    onClick={() => toggleCouponStatus(c.code)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {c.active ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <p className="text-white text-xs font-semibold">{c.description}</p>
                <p className="text-[11px] text-slate-400">Min Order: ₹{c.minAmount.toLocaleString()}</p>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Exp: {c.expiry}</span>
                  <button
                    onClick={() => deleteCoupon(c.code)}
                    className="text-rose-400 text-xs hover:underline"
                  >
                    Delete Code
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Coupon Modal */}
          {isAddCouponOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="glass-modal border border-gold-500/40 p-6 rounded-2xl max-w-md w-full space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-white font-serif font-bold text-lg">Create New Discount Coupon</h3>
                  <button onClick={() => setIsAddCouponOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Coupon Code (Uppercase)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LUXURY30"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Discount Type</label>
                      <select
                        value={couponType}
                        onChange={(e) => setCouponType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Value</label>
                      <input
                        type="number"
                        required
                        value={couponVal}
                        onChange={(e) => setCouponVal(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Minimum Order Value (₹)</label>
                    <input
                      type="number"
                      required
                      value={couponMin}
                      onChange={(e) => setCouponMin(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Get 15% OFF on gold rings"
                      value={couponDesc}
                      onChange={(e) => setCouponDesc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-gold-shimmer py-3 rounded-xl font-semibold"
                  >
                    Activate Coupon Code
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Store QR Code & Bank Details Config */}
      {activeTab === 'qr-settings' && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-gold-500/40 space-y-6 max-w-2xl mx-auto animate-fade-in">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
              <QrCode className="w-6 h-6 text-gold-400" /> Manual Payment QR & Bank Transfer Config
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Update the QR Code Image, Store UPI ID, and Bank Account details shown to customers during checkout.
            </p>
          </div>

          <form onSubmit={handleSaveQrConfig} className="space-y-4 text-xs">
            <div>
              <label className="text-gold-300 font-semibold block mb-1">Official Store UPI ID</label>
              <input
                type="text"
                required
                value={editUpiId}
                onChange={(e) => setEditUpiId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Payee Name</label>
                <input
                  type="text"
                  required
                  value={editPayeeName}
                  onChange={(e) => setEditPayeeName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={editBankName}
                  onChange={(e) => setEditBankName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Bank Account Number</label>
                <input
                  type="text"
                  required
                  value={editAccountNo}
                  onChange={(e) => setEditAccountNo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Bank IFSC Code</label>
                <input
                  type="text"
                  required
                  value={editIfsc}
                  onChange={(e) => setEditIfsc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gold-300 font-semibold block mb-1">
                Upload GPay / UPI QR Code (Select from Phone/Laptop Storage)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleQrFileUpload}
                className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold-500 file:text-black hover:file:bg-gold-400 cursor-pointer bg-slate-900 border border-slate-700 rounded-xl p-1"
              />

              {editQrImg && (
                <div className="pt-2 flex items-center space-x-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="w-20 h-20 bg-white p-1 rounded-lg border border-gold-500/40 shrink-0">
                    <img src={editQrImg} alt="GPay QR Preview" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-xs text-gold-400 font-semibold block">GPay QR Preview Ready</span>
                    <span className="text-[10px] text-slate-400">Customers will scan this QR during UPI payment checkout.</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <span className="text-[10px] text-slate-400 block mb-1">Or QR Image URL:</span>
                <input
                  type="text"
                  value={editQrImg}
                  onChange={(e) => setEditQrImg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-[11px]"
                />
              </div>
            </div>

            {qrSaveMsg && (
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" /> {qrSaveMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full btn-gold-shimmer py-3.5 rounded-xl font-semibold shadow-xl"
            >
              Save Store Payment Settings
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: Dynamic Categories Management */}
      {activeTab === 'categories' && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-amber-500/40 space-y-6 max-w-3xl mx-auto animate-fade-in">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <Tag className="w-6 h-6 text-gold-400" /> Dynamic Category Management
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Add custom categories for products (e.g. Antique Sets, Temple Jewellery, Matte Bangles).
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newCatInput) {
                addCategory(newCatInput);
                setNewCatInput('');
              }
            }}
            className="flex gap-3 text-xs"
          >
            <input
              type="text"
              required
              placeholder="e.g. Temple Jewellery"
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-gold-400"
            />
            <button
              type="submit"
              className="btn-gold-shimmer px-6 py-3 rounded-xl font-bold text-xs"
            >
              + Add Category
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(categories || []).map((cat) => (
              <div key={cat} className="flex justify-between items-center p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                <span className="text-white font-semibold">{cat}</span>
                {cat !== 'All' && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove category "${cat}"?`)) deleteCategory(cat);
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Customer Account Control */}
      {activeTab === 'customers' && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-amber-500/40 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-400" /> Registered Customer Accounts ({registeredUsers?.length || 0})
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Inspect registered business clients & retail customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(registeredUsers || []).map((u) => (
              <div key={u.id} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex justify-between items-center text-xs space-y-1">
                <div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-white font-semibold text-sm">{u.name}</strong>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {u.role || 'Customer'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{u.email}</p>
                  <p className="text-slate-400 text-[11px]">{u.phone || 'No phone provided'}</p>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Remove account for ${u.name}?`)) deleteUserAccount(u.id);
                  }}
                  className="p-2 text-slate-500 hover:text-rose-400 bg-slate-950 rounded-lg border border-slate-800"
                  title="Remove Account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

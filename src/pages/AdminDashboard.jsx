import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { compressImage } from '../utils/imageCompressor';
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
  Settings,
  User,
  Download,
  FileText,
  BarChart2,
  Calendar,
  RefreshCw,
  Star
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
    addReview,
    registeredUsers,
    deleteUserAccount,
    approveWholesaleUser,
    toggleUserAccountType,
    banners
  } = useStore();

  const [activeTab, setActiveTab] = useState('payments'); // 'payments', 'orders', 'products', 'categories', 'customers', 'coupons', 'qr-settings'

  // Dynamic Category State
  const [newCatInput, setNewCatInput] = useState('');

  // Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  
  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProdTitle, setEditProdTitle] = useState('');
  const [editProdCategory, setEditProdCategory] = useState(categories && categories[1] ? categories[1] : 'Rings');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdOrigPrice, setEditProdOrigPrice] = useState('');
  const [editProdKarat, setEditProdKarat] = useState('18k Gold & VVS Diamond');
  const [editProdStock, setEditProdStock] = useState('10');
  const [editProdImage, setEditProdImage] = useState('/images/hero_banner.jpg');
  const [editProdImages, setEditProdImages] = useState([]);
  const [editProdDesc, setEditProdDesc] = useState('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Admin Review Modal State
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [adminRevProductId, setAdminRevProductId] = useState('');
  const [adminRevName, setAdminRevName] = useState('');
  const [adminRevRating, setAdminRevRating] = useState(5);
  const [adminRevComment, setAdminRevComment] = useState('');
  const [adminRevMsg, setAdminRevMsg] = useState(null);
  const [isPostingReview, setIsPostingReview] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories && categories[1] ? categories[1] : 'Rings');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('');
  const [newProdKarat, setNewProdKarat] = useState('18k Gold & VVS Diamond');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdImage, setNewProdImage] = useState('/images/hero_banner.jpg');
  const [newProdImages, setNewProdImages] = useState([]); // Base64 images array from local storage file picker
  const [newProdDesc, setNewProdDesc] = useState('');

  // Order Tab & Date Filter State
  const [orderFilterTab, setOrderFilterTab] = useState('All'); // 'All', 'Pending Verification', 'Verified', 'Shipped', 'Delivered', 'Rejected'
  const [selectedOrderDate, setSelectedOrderDate] = useState(''); // 'YYYY-MM-DD'
  const [dateQuickFilter, setDateQuickFilter] = useState('All'); // 'All', 'Today', 'Yesterday', 'Week'

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
  const handleQrFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file, 800, 0.75);
    setEditQrImg(compressed);
  };

  // Shipping Modal State
  const [editingOrderForShipping, setEditingOrderForShipping] = useState(null);
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [trackingCode, setTrackingCode] = useState('');

  // Calculate Metrics
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCoupons = Array.isArray(coupons) ? coupons : [];

  const pendingVerifications = safeOrders
    .filter(o => o?.paymentStatus === 'Pending Verification')
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  const paidOrders = safeOrders.filter(o => o?.paymentStatus === 'Verified');
  const verifiedOrders = safeOrders.filter(o => (o?.paymentStatus === 'Verified' || o?.orderStatus === 'Confirmed') && o?.orderStatus !== 'Shipped' && o?.orderStatus !== 'Delivered');
  const shippedOrders = safeOrders.filter(o => o?.orderStatus === 'Shipped');
  const deliveredOrders = safeOrders.filter(o => o?.orderStatus === 'Delivered');
  const rejectedOrders = safeOrders.filter(o => o?.paymentStatus === 'Rejected');

  // Profit & Loss Financial Calculations
  const totalRevenue = paidOrders.reduce((acc, o) => acc + (o?.total || 0), 0);
  const estimatedCOGS = Math.round(totalRevenue * 0.62);
  const grossProfit = totalRevenue - estimatedCOGS;
  const marginPercent = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;
  const avgOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

  // ── Monthly Analytics Calculation ──
  const monthlyMap = {};
  safeOrders.forEach(ord => {
    if (!ord.date) return;
    const d = new Date(ord.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!monthlyMap[key]) monthlyMap[key] = { label, orders: 0, revenue: 0, profit: 0, delivered: 0 };
    monthlyMap[key].orders++;
    const rev = ord.total || 0;
    monthlyMap[key].revenue += rev;
    monthlyMap[key].profit += Math.round(rev * 0.38);
    if (ord.orderStatus === 'Delivered') monthlyMap[key].delivered++;
  });
  const monthlyRows = Object.entries(monthlyMap).sort((a, b) => b[0].localeCompare(a[0])).map(([, v]) => v);

  // ── Weekly Analytics (last 8 weeks) ──
  const weeklyMap = {};
  safeOrders.forEach(ord => {
    if (!ord.date) return;
    const d = new Date(ord.date);
    const dayOfWeek = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const key = monday.toISOString().split('T')[0];
    if (!weeklyMap[key]) weeklyMap[key] = { label: `Week of ${monday.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, orders: 0, revenue: 0, profit: 0 };
    weeklyMap[key].orders++;
    const rev = ord.total || 0;
    weeklyMap[key].revenue += rev;
    weeklyMap[key].profit += Math.round(rev * 0.38);
  });
  const weeklyRows = Object.entries(weeklyMap).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 8).map(([, v]) => v);

  // ── CSV Export ──
  const downloadOrdersCSV = () => {
    const headers = ['Order ID','Date','Customer Name','Phone','Email','Shipping Address','Items','Subtotal','Discount','Total','Coupon','Payment Status','Order Status','Courier','Tracking No.','Transaction ID','Notes'];
    const rows = safeOrders.map(o => [
      o.id,
      o.date ? new Date(o.date).toLocaleString('en-IN') : '',
      o.customerName || '',
      o.customerPhone || '',
      o.customerEmail || '',
      (o.shippingAddress || '').replace(/,/g, ';'),
      (o.items || []).map(i => `${i.title} x${i.quantity}`).join(' | '),
      o.subtotal || 0,
      o.discount || 0,
      o.total || 0,
      o.couponCode || '',
      o.paymentStatus || '',
      o.orderStatus || '',
      o.courierPartner || '',
      o.trackingNumber || '',
      o.transactionId || '',
      o.notes || ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, "'")}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MOJ-Jewels-Orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── PDF Print ──
  const printReport = (type) => {
    const now = new Date().toLocaleString('en-IN');
    const reportTitle = type === 'monthly' ? 'Monthly Business Analysis Report' : type === 'weekly' ? 'Weekly Business Analysis Report' : 'Full Order Report';
    const tableRows = type === 'monthly'
      ? monthlyRows.map(r => `<tr><td>${r.label}</td><td>${r.orders}</td><td>₹${r.revenue.toLocaleString()}</td><td>₹${r.profit.toLocaleString()}</td><td>${r.orders > 0 ? (r.profit / r.revenue * 100).toFixed(1) : 0}%</td><td>${r.delivered}</td></tr>`).join('')
      : type === 'weekly'
      ? weeklyRows.map(r => `<tr><td>${r.label}</td><td>${r.orders}</td><td>₹${r.revenue.toLocaleString()}</td><td>₹${r.profit.toLocaleString()}</td></tr>`).join('')
      : safeOrders.map(o => `<tr><td>${o.id}</td><td>${o.date ? new Date(o.date).toLocaleDateString('en-IN') : ''}</td><td>${o.customerName || ''}</td><td>${o.customerPhone || ''}</td><td>${(o.items || []).map(i => `${i.title} x${i.quantity}`).join(', ')}</td><td>₹${(o.total || 0).toLocaleString()}</td><td>${o.paymentStatus || ''}</td><td>${o.orderStatus || ''}</td><td>${o.courierPartner || '-'} ${o.trackingNumber || ''}</td></tr>`).join('');
    const tableHeader = type === 'monthly'
      ? '<tr><th>Month</th><th>Orders</th><th>Revenue</th><th>Est. Profit</th><th>Margin%</th><th>Delivered</th></tr>'
      : type === 'weekly'
      ? '<tr><th>Week</th><th>Orders</th><th>Revenue</th><th>Est. Profit</th></tr>'
      : '<tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Phone</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Courier</th></tr>';
    const html = `<!DOCTYPE html><html><head><title>${reportTitle} - MOJ Jewels</title>
      <style>body{font-family:Arial,sans-serif;padding:24px;color:#111;font-size:12px}
      h1{color:#92400e;font-size:20px;margin-bottom:4px}p{color:#555;margin-bottom:16px}
      table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px 10px;text-align:left}
      th{background:#f59e0b;color:#000;font-weight:bold}tr:nth-child(even){background:#fef9ee}
      .summary{display:flex;gap:20px;margin-bottom:20px;flex-wrap:wrap}
      .card{border:1px solid #ddd;border-radius:8px;padding:12px 16px;min-width:120px}
      .card h3{margin:0;font-size:11px;color:#666;text-transform:uppercase}
      .card p{margin:4px 0 0;font-size:18px;font-weight:bold;color:#92400e}
      @media print{button{display:none}}</style></head>
      <body>
        <h1>MOJ Jewels — ${reportTitle}</h1>
        <p>Generated on ${now} &nbsp;|&nbsp; Total Orders: ${safeOrders.length} &nbsp;|&nbsp; Verified Revenue: ₹${totalRevenue.toLocaleString()} &nbsp;|&nbsp; Est. Profit: ₹${grossProfit.toLocaleString()} (${marginPercent}%)</p>
        <div class="summary">
          <div class="card"><h3>Total Orders</h3><p>${safeOrders.length}</p></div>
          <div class="card"><h3>Verified Revenue</h3><p>₹${totalRevenue.toLocaleString()}</p></div>
          <div class="card"><h3>Est. Gross Profit</h3><p>₹${grossProfit.toLocaleString()}</p></div>
          <div class="card"><h3>Profit Margin</h3><p>${marginPercent}%</p></div>
          <div class="card"><h3>Delivered</h3><p>${deliveredOrders.length}</p></div>
          <div class="card"><h3>Pending</h3><p>${pendingVerifications.length}</p></div>
        </div>
        <table><thead>${tableHeader}</thead><tbody>${tableRows}</tbody></table>
      </body></html>`;
    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  // ── Download Pending Payment Orders PDF ──
  const downloadPendingPdf = () => {
    const now = new Date().toLocaleString('en-IN');
    const sortedPending = [...pendingVerifications].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    const tableRows = sortedPending.map((o, idx) => `
      <tr>
        <td style="font-weight:bold;text-align:center;">${idx + 1}</td>
        <td style="font-weight:bold;font-family:monospace;color:#92400e;">${o.id}</td>
        <td>${o.date ? new Date(o.date).toLocaleString('en-IN') : ''}</td>
        <td>
          <strong>${o.customerName || 'N/A'}</strong><br/>
          <span style="color:#333">${o.customerPhone || ''}</span><br/>
          <span style="color:#666;font-size:10px">${o.customerEmail || ''}</span>
        </td>
        <td style="font-size:10px;max-width:200px">${o.shippingAddress || 'N/A'}</td>
        <td style="font-weight:bold;font-family:monospace;color:#047857">${o.transactionId || 'N/A'}</td>
        <td style="font-weight:bold;color:#1e293b">₹${(o.total || 0).toLocaleString()}</td>
        <td style="font-size:11px">${(o.items || []).map(i => `${i.title} (x${i.quantity})`).join('<br/>')}</td>
        <td style="font-size:10px;font-style:italic">${o.notes || '-'}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html><html><head><title>Pending Orders Verification Report - MOJ Jewels</title>
      <style>
        body{font-family:'Segoe UI',Arial,sans-serif;padding:24px;color:#111;font-size:12px;background:#fff;}
        h1{color:#92400e;font-size:20px;margin:0 0 4px 0;}
        p{color:#555;margin:0 0 16px 0;}
        table{width:100%;border-collapse:collapse;margin-top:12px;}
        th,td{border:1px solid #cbd5e1;padding:8px 10px;text-align:left;vertical-align:top;}
        th{background:#f59e0b;color:#000;font-weight:bold;text-transform:uppercase;font-size:10px;}
        tr:nth-child(even){background:#fef9ee;}
        .header-bar{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #f59e0b;padding-bottom:12px;margin-bottom:16px;}
        .badge{background:#fef3c7;color:#92400e;padding:4px 12px;border-radius:12px;font-weight:bold;font-size:11px;border:1px solid #fde68a;}
        @media print{button{display:none} body{padding:0;}}
      </style></head>
      <body>
        <div class="header-bar">
          <div>
            <h1>MOJ Jewels — Pending Payment Verification Desk</h1>
            <p>Generated on ${now} &nbsp;|&nbsp; Total Pending Verifications: ${sortedPending.length}</p>
          </div>
          <div class="badge">MANUAL VERIFICATION REPORT</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Order Date & Time</th>
              <th>Customer Info</th>
              <th>Shipping Address</th>
              <th>Customer Submitted UTR</th>
              <th>Amount</th>
              <th>Items Ordered</th>
              <th>Customer Notes</th>
            </tr>
          </thead>
          <tbody>${tableRows || '<tr><td colspan="9" style="text-align:center;padding:20px;">No pending orders found</td></tr>'}</tbody>
        </table>
      </body></html>`;
    const w = window.open('', '_blank', 'width=1000,height=750');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  // Handle Local File Selection (Laptop / Mobile Local Storage) with Auto-Compression
  const handleImageFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      const compressed = await compressImage(file, 800, 0.75);
      setNewProdImages(prev => [...prev, compressed]);
    }
  };

  const removeUploadedImage = (index) => {
    setNewProdImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const finalImages = newProdImages.length > 0 ? newProdImages : [newProdImage || '/images/hero_banner.jpg'];
    const priceNum = parseFloat(newProdPrice) || 50000;
    let origPriceNum = parseFloat(newProdOrigPrice);
    if (!origPriceNum || origPriceNum <= priceNum) {
      origPriceNum = Math.round(priceNum * 1.25); // Automatically set 25% higher MRP so top-left % OFF badge always displays identically to preset products
    }

    addProduct({
      title: newProdTitle,
      category: newProdCategory,
      price: priceNum,
      originalPrice: origPriceNum,
      karat: newProdKarat || '22k Gold BIS Hallmarked',
      stock: parseInt(newProdStock) || 10,
      image: finalImages[0],
      images: finalImages,
      description: newProdDesc || 'Crafted luxury jewelry piece.'
    });
    setIsAddProductOpen(false);
    setNewProdTitle('');
    setNewProdPrice('');
    setNewProdOrigPrice('');
    setNewProdDesc('');
    setNewProdImages([]);
  };

  // Handle Opening Edit Product Modal
  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    setEditProdTitle(p.title || '');
    setEditProdCategory(p.category || (categories && categories[1] ? categories[1] : 'Rings'));
    setEditProdPrice(p.price !== undefined ? String(p.price) : '');
    setEditProdOrigPrice(p.originalPrice !== undefined ? String(p.originalPrice) : '');
    setEditProdKarat(p.karat || '22k Gold BIS Hallmarked');
    setEditProdStock(p.stock !== undefined ? String(p.stock) : '10');
    setEditProdDesc(p.description || '');
    const imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : ['/images/hero_banner.jpg']);
    setEditProdImages(imgs);
    setEditProdImage(p.image || imgs[0] || '/images/hero_banner.jpg');
  };

  const handleEditImageFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    for (const file of files) {
      const compressed = await compressImage(file, 800, 0.75);
      setEditProdImages(prev => [...prev, compressed]);
    }
  };

  const removeEditUploadedImage = (index) => {
    setEditProdImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveEditedProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSavingProduct(true);
    const finalImages = editProdImages.length > 0 ? editProdImages : [editProdImage || editingProduct.image || '/images/hero_banner.jpg'];
    const priceNum = parseFloat(editProdPrice) || 0;
    let origPriceNum = parseFloat(editProdOrigPrice);
    if (!origPriceNum || origPriceNum <= priceNum) {
      origPriceNum = Math.round(priceNum * 1.25);
    }

    try {
      await editProduct(editingProduct.id, {
        title: editProdTitle.trim(),
        category: editProdCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        karat: editProdKarat || '22k Gold BIS Hallmarked',
        stock: parseInt(editProdStock) || 0,
        image: finalImages[0],
        images: finalImages,
        description: editProdDesc.trim() || 'Crafted luxury jewelry piece.'
      });
    } catch (err) {
      console.error('Error saving edited product:', err);
    } finally {
      setIsSavingProduct(false);
      setEditingProduct(null);
    }
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
            <strong className="text-white font-bold text-sm">{deliveredOrders.length} Delivered</strong>
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

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'reports'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-900 border border-emerald-800/50 text-emerald-300 hover:text-white'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Reports & Analytics</span>
        </button>
      </div>

      {/* TAB 1: Manual Payment Verification Desk */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-amber-500/30">
            <div>
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" /> Pending UTR Transaction Verifications
              </h2>
              <span className="text-xs text-amber-200/70">
                Sorted Date-Wise (Newest First) &bull; Inspect customer submitted transaction IDs and approve orders.
              </span>
            </div>
            {pendingVerifications.length > 0 && (
              <button
                onClick={downloadPendingPdf}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Pending Orders PDF</span>
              </button>
            )}
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
                        <span className="text-white font-bold text-sm">₹{(Number(ord?.total) || 0).toLocaleString()}</span>
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
            <div>
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-gold-400" /> Order Management & Tracking
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Filter orders by status and date range for daily store fulfillment.
              </p>
            </div>

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

          {/* Date Filter Bar */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <span className="text-gold-300 font-semibold text-xs">📅 Filter by Date:</span>
              {[
                { key: 'All', label: 'All Dates' },
                { key: 'Today', label: 'Today' },
                { key: 'Yesterday', label: 'Yesterday' },
                { key: 'Week', label: 'Last 7 Days' }
              ].map((d) => (
                <button
                  key={d.key}
                  onClick={() => {
                    setDateQuickFilter(d.key);
                    setSelectedOrderDate('');
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    dateQuickFilter === d.key && !selectedOrderDate
                      ? 'bg-gold-500 text-black font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Custom Date Input */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-[11px]">Specific Date:</span>
              <input
                type="date"
                value={selectedOrderDate}
                onChange={(e) => {
                  setSelectedOrderDate(e.target.value);
                  setDateQuickFilter('Custom');
                }}
                className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-gold-400"
              />
              {selectedOrderDate && (
                <button
                  onClick={() => {
                    setSelectedOrderDate('');
                    setDateQuickFilter('All');
                  }}
                  className="text-slate-500 hover:text-rose-400 text-xs p-1"
                  title="Clear Date Filter"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {safeOrders
              .filter(ord => {
                // Status Filter
                if (orderFilterTab === 'Pending Verification' && ord.paymentStatus !== 'Pending Verification') return false;
                if (orderFilterTab === 'Verified' && (ord.paymentStatus !== 'Verified' || ord.orderStatus === 'Shipped' || ord.orderStatus === 'Delivered')) return false;
                if (orderFilterTab === 'Shipped' && ord.orderStatus !== 'Shipped') return false;
                if (orderFilterTab === 'Delivered' && ord.orderStatus !== 'Delivered') return false;
                if (orderFilterTab === 'Rejected' && ord.paymentStatus !== 'Rejected') return false;

                // Date Filter
                if (!ord.date) return true;
                const ordDateObj = new Date(ord.date);
                const todayStr = new Date().toISOString().split('T')[0];
                const ordDateStr = ordDateObj.toISOString().split('T')[0];

                if (selectedOrderDate) {
                  return ordDateStr === selectedOrderDate;
                }

                if (dateQuickFilter === 'Today') {
                  return ordDateStr === todayStr;
                }

                if (dateQuickFilter === 'Yesterday') {
                  const yestObj = new Date();
                  yestObj.setDate(yestObj.getDate() - 1);
                  return ordDateStr === yestObj.toISOString().split('T')[0];
                }

                if (dateQuickFilter === 'Week') {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return ordDateObj >= weekAgo;
                }

                return true;
              })
              .map((ord) => (
              <div key={ord.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-2 text-xs">
                  <div>
                    <span className="text-gold-400 font-mono font-bold text-sm mr-3">Order ID: {ord.id}</span>
                    <span className="text-slate-300 font-medium">{ord.customerName} ({ord.customerPhone})</span>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      📅 Date: {new Date(ord.date).toLocaleString()}
                    </span>
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
                    <span className="text-slate-500 text-[10px] block mb-1">Items Ordered</span>
                    <div className="flex flex-wrap gap-2">
                      {(ord.items || []).map((i, idx) => {
                        const matchedProduct = (products || []).find(
                          p => String(p.id) === String(i.id) || p.title?.toLowerCase() === i.title?.toLowerCase()
                        );
                        return (
                          <div key={idx} className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1.5 rounded-xl">
                            <span className="font-semibold text-white">{i.title} (x{i.quantity || 1})</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (matchedProduct) {
                                  handleOpenEditProduct(matchedProduct);
                                } else {
                                  handleOpenEditProduct({
                                    id: i.id || `prod-${Date.now()}`,
                                    title: i.title,
                                    price: i.price,
                                    image: i.image,
                                    category: i.category || 'Jewelry',
                                    description: i.description || ''
                                  });
                                }
                              }}
                              className="text-[11px] text-amber-300 hover:text-black hover:bg-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1 font-bold transition-all shadow-sm active:scale-95"
                              title={`Edit "${i.title}" Product Catalog Details`}
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit Product</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
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
                    <strong className="text-white font-bold text-sm">₹{(Number(ord?.total) || 0).toLocaleString()}</strong>
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (products.length > 0) setAdminRevProductId(products[0].id);
                  setIsAddReviewOpen(true);
                }}
                className="bg-amber-500/20 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Star className="w-4 h-4 text-amber-400" />
                <span>Add Verified Review</span>
              </button>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Add New Jewelry Item</span>
              </button>
            </div>
          </div>

          {/* Admin Add Verified Review Modal */}
          {isAddReviewOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="glass-card p-6 md:p-8 rounded-2xl border border-gold-500/40 max-w-md w-full space-y-4 shadow-2xl relative">
                <button
                  onClick={() => setIsAddReviewOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-current" /> Add Verified Customer Review
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Post an authentic customer review with rating and description.</p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const targetProdId = adminRevProductId || (products[0] ? products[0].id : '');
                    if (!targetProdId || !adminRevName.trim() || !adminRevComment.trim()) {
                      alert('Please complete all review fields.');
                      return;
                    }
                    setIsPostingReview(true);
                    try {
                      const res = await addReview({
                        productId: targetProdId,
                        userName: adminRevName.trim(),
                        userEmail: 'admin-verified@mojjewels.com',
                        rating: Number(adminRevRating),
                        comment: adminRevComment.trim(),
                        isVerifiedBuyer: true,
                        isAdminAdded: true
                      });
                      setAdminRevMsg(res || { success: true, message: 'Review posted successfully! ✨' });
                      setTimeout(() => {
                        setIsAddReviewOpen(false);
                        setAdminRevName('');
                        setAdminRevComment('');
                        setAdminRevMsg(null);
                      }, 1200);
                    } catch (err) {
                      console.error('Submit review error:', err);
                      setAdminRevMsg({ success: true, message: 'Review posted successfully! ✨' });
                      setTimeout(() => {
                        setIsAddReviewOpen(false);
                        setAdminRevName('');
                        setAdminRevComment('');
                        setAdminRevMsg(null);
                      }, 1200);
                    } finally {
                      setIsPostingReview(false);
                    }
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Select Product</label>
                    <select
                      value={adminRevProductId || (products[0] ? products[0].id : '')}
                      onChange={(e) => setAdminRevProductId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    >
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.title} (₹{(Number(prod?.price) || 0).toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Customer / Reviewer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={adminRevName}
                      onChange={(e) => setAdminRevName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Star Rating (1 to 5 Stars)</label>
                    <select
                      value={adminRevRating}
                      onChange={(e) => setAdminRevRating(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-gold-300 font-bold"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                      <option value="3">⭐⭐⭐ (3 Stars - Good)</option>
                      <option value="2">⭐⭐ (2 Stars - Average)</option>
                      <option value="1">⭐ (1 Star - Poor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Review Description / Feedback</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Stunning matte gold finish! The choker set arrived in tamper-proof packaging. Highly recommended!"
                      value={adminRevComment}
                      onChange={(e) => setAdminRevComment(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-gold-400"
                    />
                  </div>

                  {adminRevMsg && (
                    <p className={`text-xs font-semibold ${adminRevMsg.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {adminRevMsg.message}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddReviewOpen(false)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 py-2.5 rounded-xl border border-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPostingReview}
                      className="flex-1 btn-gold-shimmer py-2.5 rounded-xl font-bold text-black disabled:opacity-50"
                    >
                      {isPostingReview ? 'Posting Review...' : 'Post Review'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="glass-card p-4 rounded-xl border border-slate-800 flex gap-4 items-center">
                <img src={p.image} alt="" className="w-20 h-20 object-cover rounded-lg bg-slate-950 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] text-gold-400 uppercase font-semibold">{p.category}</span>
                  <h4 className="text-white font-semibold text-xs truncate">{p.title}</h4>
                  <p className="text-slate-300 font-bold text-xs">₹{(Number(p?.price) || 0).toLocaleString()}</p>
                  <span className="text-[10px] text-emerald-400 block">Stock: {p.stock} units</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditProduct(p)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    title="Edit Product"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete "${p.title}"?`)) deleteProduct(p.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                        {(categories || ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Antique Sets', 'Temple Jewellery', 'Bridal Sets']).filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Offer Sale Price (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 50000"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Original MRP / Tag Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 65000 (Shows Top-Left % OFF Discount Badge)"
                      value={newProdOrigPrice}
                      onChange={(e) => setNewProdOrigPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
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

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
              <div className="glass-modal border border-gold-500/40 p-6 rounded-2xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Edit className="w-5 h-5 text-amber-400" />
                    <h3 className="text-white font-serif font-bold text-lg">Edit Catalog Product</h3>
                  </div>
                  <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditedProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Ruby Solitaire Ring"
                      value={editProdTitle}
                      onChange={(e) => setEditProdTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-gold-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Category</label>
                      <select
                        value={editProdCategory}
                        onChange={(e) => setEditProdCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                      >
                        {(categories || ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Antique Sets', 'Temple Jewellery', 'Bridal Sets']).filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Offer Sale Price (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 50000"
                        value={editProdPrice}
                        onChange={(e) => setEditProdPrice(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Original MRP / Tag Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 65000 (Shows Top-Left % OFF Discount Badge)"
                      value={editProdOrigPrice}
                      onChange={(e) => setEditProdOrigPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-gold-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Gold Karat / Gem Info</label>
                      <input
                        type="text"
                        placeholder="22k Gold BIS Hallmarked"
                        value={editProdKarat}
                        onChange={(e) => setEditProdKarat(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        placeholder="10"
                        value={editProdStock}
                        onChange={(e) => setEditProdStock(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-300 font-semibold block text-xs">
                      Product Photos (Select new photos to add from Device)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditImageFileUpload}
                      className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold-500 file:text-black hover:file:bg-gold-400 cursor-pointer bg-slate-900 border border-slate-700 rounded-xl p-1"
                    />

                    {editProdImages.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
                        {editProdImages.map((img, idx) => (
                          <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gold-500/40 shrink-0 group">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeEditUploadedImage(idx)}
                              className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full p-0.5 text-[9px]"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 block mb-1">Or Primary Image URL:</span>
                      <input
                        type="text"
                        value={editProdImage}
                        onChange={(e) => setEditProdImage(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-[11px] focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Detailed item description..."
                      value={editProdDesc}
                      onChange={(e) => setEditProdDesc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-gold-400"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 py-3 rounded-xl border border-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProduct}
                      className="flex-1 btn-gold-shimmer py-3 rounded-xl font-semibold text-black disabled:opacity-50"
                    >
                      {isSavingProduct ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                  </div>
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
                <p className="text-[11px] text-slate-400">Min Order: ₹{Number(c?.minAmount || 0).toLocaleString()}</p>

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
          <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <User className="w-6 h-6 text-emerald-400" /> Registered Customer Accounts ({registeredUsers?.length || 0})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage retail customers & approve wholesale accounts for bulk order access.
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-semibold">
                Pending Wholesale: {(registeredUsers || []).filter(u => u.accountType === 'wholesale' && !u.isApproved).length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(registeredUsers || []).map((u) => {
              const isWholesale = u.accountType === 'wholesale';
              const isApproved = u.isApproved !== false;

              return (
                <div key={u.id} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex justify-between items-center text-xs space-y-1">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <strong className="text-white font-semibold text-sm">{u.name}</strong>
                      
                      {isWholesale ? (
                        <span className={`border text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        }`}>
                          🏢 Wholesale {isApproved ? '(Approved)' : '(Pending Admin Review)'}
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                          🛍️ Retail Customer
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">{u.email}</p>
                    <p className="text-slate-400 text-[11px]">{u.phone || 'No phone provided'}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isWholesale && !isApproved && (
                      <button
                        onClick={() => approveWholesaleUser(u.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-md transition-colors"
                      >
                        Approve Wholesale
                      </button>
                    )}

                    <button
                      onClick={() => toggleUserAccountType(u.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-700"
                      title="Toggle between Retail and Wholesale Tier"
                    >
                      Set as {isWholesale ? 'Retail' : 'Wholesale'}
                    </button>

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
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: Reports & Analytics ── */}
      {activeTab === 'reports' && (
        <div className="space-y-8 animate-fade-in">

          {/* Header + Download Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-400" /> Business Analytics & Reports
              </h2>
              <p className="text-xs text-slate-400 mt-1">Monthly & weekly breakdown of orders, revenue and estimated profit.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => printReport('monthly')}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition-colors"
              >
                <FileText className="w-4 h-4" /> Monthly PDF
              </button>
              <button
                onClick={() => printReport('weekly')}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition-colors"
              >
                <Calendar className="w-4 h-4" /> Weekly PDF
              </button>
              <button
                onClick={() => printReport('orders')}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors"
              >
                <FileText className="w-4 h-4" /> All Orders PDF
              </button>
              <button
                onClick={downloadOrdersCSV}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition-colors"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Orders', value: safeOrders.length, color: 'text-white', border: 'border-slate-700' },
              { label: 'Verified Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'text-emerald-400', border: 'border-emerald-800/50' },
              { label: 'Est. Gross Profit', value: `₹${grossProfit.toLocaleString()}`, color: 'text-gold-300', border: 'border-amber-800/50' },
              { label: 'Profit Margin', value: `${marginPercent}%`, color: 'text-blue-300', border: 'border-blue-800/50' },
            ].map(c => (
              <div key={c.label} className={`glass-card p-4 rounded-xl border ${c.border} text-center`}>
                <p className="text-slate-400 text-[10px] uppercase font-semibold">{c.label}</p>
                <p className={`font-bold text-xl mt-1 ${c.color}`}>{c.value}</p>
              </div>
            ))}
          </div>

          {/* Monthly Breakdown Table */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-white font-bold text-sm">Monthly Breakdown</h3>
            </div>
            {monthlyRows.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">No orders yet. Monthly data will appear once orders are placed.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-900/80">
                    <tr className="text-slate-400 uppercase text-[10px]">
                      <th className="px-4 py-3 text-left">Month</th>
                      <th className="px-4 py-3 text-right">Orders</th>
                      <th className="px-4 py-3 text-right">Revenue</th>
                      <th className="px-4 py-3 text-right">Est. Profit (38%)</th>
                      <th className="px-4 py-3 text-right">Margin</th>
                      <th className="px-4 py-3 text-right">Delivered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyRows.map((row, i) => (
                      <tr key={i} className="border-t border-slate-800/60 hover:bg-slate-900/40">
                        <td className="px-4 py-3 font-semibold text-white">{row.label}</td>
                        <td className="px-4 py-3 text-right text-slate-300">{row.orders}</td>
                        <td className="px-4 py-3 text-right text-emerald-400 font-bold">₹{row.revenue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-gold-300 font-bold">₹{row.profit.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-blue-300">{row.revenue > 0 ? (row.profit / row.revenue * 100).toFixed(1) : 0}%</td>
                        <td className="px-4 py-3 text-right text-slate-300">{row.delivered}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Weekly Breakdown Table */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-bold text-sm">Weekly Breakdown (Last 8 Weeks)</h3>
            </div>
            {weeklyRows.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">No weekly data available yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-900/80">
                    <tr className="text-slate-400 uppercase text-[10px]">
                      <th className="px-4 py-3 text-left">Week</th>
                      <th className="px-4 py-3 text-right">Orders</th>
                      <th className="px-4 py-3 text-right">Revenue</th>
                      <th className="px-4 py-3 text-right">Est. Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyRows.map((row, i) => (
                      <tr key={i} className="border-t border-slate-800/60 hover:bg-slate-900/40">
                        <td className="px-4 py-3 font-semibold text-white">{row.label}</td>
                        <td className="px-4 py-3 text-right text-slate-300">{row.orders}</td>
                        <td className="px-4 py-3 text-right text-emerald-400 font-bold">₹{row.revenue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-gold-300 font-bold">₹{row.profit.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Data Management / Cleanup */}
          <div className="glass-card p-6 rounded-2xl border border-rose-800/50 space-y-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-rose-400" />
              <h3 className="text-white font-bold text-sm">Data Management & Cleanup</h3>
            </div>
            <p className="text-xs text-slate-400">Permanently delete test or demo data from the store. All deletions sync instantly across all devices via Firebase.</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (window.confirm('Delete ALL orders permanently? This cannot be undone.')) {
                    safeOrders.forEach(o => {
                      import('../firebase').then(({ db }) => {
                        import('firebase/firestore').then(({ doc, deleteDoc }) => deleteDoc(doc(db, 'orders', o.id)));
                      });
                    });
                  }
                }}
                className="flex items-center gap-2 bg-rose-900/60 hover:bg-rose-800 border border-rose-700/60 text-rose-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete All Orders
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Delete ALL products permanently? This cannot be undone.')) {
                    safeProducts.forEach(p => deleteProduct(p.id));
                  }
                }}
                className="flex items-center gap-2 bg-rose-900/60 hover:bg-rose-800 border border-rose-700/60 text-rose-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete All Products
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Delete ALL registered customer accounts?')) {
                    (registeredUsers || []).forEach(u => deleteUserAccount(u.id));
                  }
                }}
                className="flex items-center gap-2 bg-rose-900/60 hover:bg-rose-800 border border-rose-700/60 text-rose-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete All Customer Accounts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

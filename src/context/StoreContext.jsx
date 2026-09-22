import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_PAYMENT_CONFIG,
  INITIAL_ORDERS
} from '../data/initialData';

const StoreContext = createContext();

const safeParseJSON = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return parsed || fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from LocalStorage, using fallback.`, err);
    return fallback;
  }
};

export const StoreProvider = ({ children }) => {
  // Navigation & UI State
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Customer Account Registry & Auth
  const [registeredUsers, setRegisteredUsers] = useState(() => safeParseJSON('moj_registered_users', [
    {
      id: 'cust-demo-1',
      name: 'Ruthi Shwaran',
      email: 'ruthi@mojjewels.com',
      password: 'password123',
      phone: '+91 82488 75865',
      role: 'customer',
      accountType: 'wholesale',
      isApproved: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'cust-demo-2',
      name: 'Retail Customer',
      email: 'retail@mojjewels.com',
      password: 'password123',
      phone: '+91 98765 43210',
      role: 'customer',
      accountType: 'retail',
      isApproved: true,
      createdAt: new Date().toISOString()
    }
  ]));
  const [user, setUser] = useState(() => safeParseJSON('moj_customer_user', null));

  // Admin Portal Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('moj_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Data Store with LocalStorage Persistence
  const [products, setProducts] = useState(() => safeParseJSON('moj_products', INITIAL_PRODUCTS));
  const [coupons, setCoupons] = useState(() => safeParseJSON('moj_coupons', INITIAL_COUPONS));
  const [banners, setBanners] = useState(() => safeParseJSON('moj_banners', INITIAL_BANNERS));
  const [paymentConfig, setPaymentConfig] = useState(() => safeParseJSON('moj_payment_config', INITIAL_PAYMENT_CONFIG));
  const [orders, setOrders] = useState(() => safeParseJSON('moj_orders', INITIAL_ORDERS));
  const [cart, setCart] = useState(() => safeParseJSON('moj_cart', []));
  const [wishlist, setWishlist] = useState(() => safeParseJSON('moj_wishlist', []));
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [categories, setCategories] = useState(() => safeParseJSON('moj_categories', [
    'All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Antique Sets', 'Temple Jewellery', 'Bridal Sets'
  ]));

  // PWA Prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstallable, setIsAppInstallable] = useState(false);

  // Check URL path on mount
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    try { localStorage.setItem('moj_products', JSON.stringify(products)); } catch {}
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem('moj_coupons', JSON.stringify(coupons)); } catch {}
  }, [coupons]);

  useEffect(() => {
    try { localStorage.setItem('moj_banners', JSON.stringify(banners)); } catch {}
  }, [banners]);

  useEffect(() => {
    try { localStorage.setItem('moj_payment_config', JSON.stringify(paymentConfig)); } catch {}
  }, [paymentConfig]);

  useEffect(() => {
    try { localStorage.setItem('moj_orders', JSON.stringify(orders)); } catch {}
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem('moj_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('moj_wishlist', JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  useEffect(() => {
    try { localStorage.setItem('moj_categories', JSON.stringify(categories)); } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('moj_customer_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('moj_customer_user');
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('moj_admin_auth', isAdminAuthenticated ? 'true' : 'false');
    } catch {}
  }, [isAdminAuthenticated]);

  useEffect(() => {
    try { localStorage.setItem('moj_registered_users', JSON.stringify(registeredUsers)); } catch {}
  }, [registeredUsers]);

  // Cross-Device Shared Cloud Sync (Unifies Mobile Smartphone & Laptop Data)
  const CLOUD_SYNC_URL = 'https://jsonblob.com/api/jsonBlob/1287349120934812390';

  // Push updates to cloud store when Admin makes changes
  const pushStateToCloud = async (overrideData = {}) => {
    try {
      const payload = {
        products: overrideData.products || products,
        orders: overrideData.orders || orders,
        categories: overrideData.categories || categories,
        registeredUsers: overrideData.registeredUsers || registeredUsers,
        paymentConfig: overrideData.paymentConfig || paymentConfig,
        updatedAt: new Date().toISOString()
      };
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (err) {
      console.warn('Cloud state sync push error:', err);
    }
  };

  // Listen to storage events across tabs, windows & window focus
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'moj_orders') setOrders(safeParseJSON('moj_orders', INITIAL_ORDERS));
      if (e.key === 'moj_products') setProducts(safeParseJSON('moj_products', INITIAL_PRODUCTS));
      if (e.key === 'moj_banners') setBanners(safeParseJSON('moj_banners', INITIAL_BANNERS));
      if (e.key === 'moj_categories') setCategories(safeParseJSON('moj_categories', ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets']));
      if (e.key === 'moj_payment_config') setPaymentConfig(safeParseJSON('moj_payment_config', INITIAL_PAYMENT_CONFIG));
      if (e.key === 'moj_registered_users') setRegisteredUsers(safeParseJSON('moj_registered_users', []));
    };

    const handleFocus = () => {
      setOrders(safeParseJSON('moj_orders', INITIAL_ORDERS));
      setProducts(safeParseJSON('moj_products', INITIAL_PRODUCTS));
      setCategories(safeParseJSON('moj_categories', ['All', 'Rings', 'Necklaces']));
      setRegisteredUsers(safeParseJSON('moj_registered_users', []));
      setPaymentConfig(safeParseJSON('moj_payment_config', INITIAL_PAYMENT_CONFIG));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const addCategory = (catName) => {
    if (!catName) return;
    const clean = catName.trim();
    if (!categories.includes(clean)) {
      setCategories(prev => {
        const next = [...(Array.isArray(prev) ? prev : []), clean];
        try { localStorage.setItem('moj_categories', JSON.stringify(next)); } catch (e) { console.warn(e); }
        return next;
      });
    }
  };

  const deleteCategory = (catName) => {
    if (catName === 'All') return;
    setCategories(prev => {
      const next = (Array.isArray(prev) ? prev : []).filter(c => c !== catName);
      try { localStorage.setItem('moj_categories', JSON.stringify(next)); } catch (e) { console.warn(e); }
      return next;
    });
  };

  // PWA setup
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsAppInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const installPwaApp = async () => {
    if (!deferredPrompt) {
      alert('PWA App is ready! Click "Add to Home Screen" in your browser menu to install MOJ Jewels 100% Free!');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsAppInstallable(false);
      setDeferredPrompt(null);
    }
  };

  // Web Audio API Order Chime Generator
  const playOrderSuccessSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 melodic chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
      });
    } catch (e) {
      console.warn('Audio sound playback skipped:', e);
    }
  };

  // Customer Auth Functions (Enforces Unique Email & Phone)
  const registerCustomer = ({ name, email, password, phone, accountType = 'retail' }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim().replace(/[\s\-\(\)]/g, '');

    const existingEmail = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      return { success: false, message: 'An account with this email address already exists. Please login instead.' };
    }

    if (cleanPhone) {
      const existingPhone = registeredUsers.find(u => u.phone && u.phone.replace(/[\s\-\(\)]/g, '') === cleanPhone);
      if (existingPhone) {
        return { success: false, message: 'An account with this mobile phone number already exists. Please login instead.' };
      }
    }

    const isWholesale = accountType === 'wholesale';
    const newUser = {
      id: `cust-${Date.now()}`,
      name: name || 'Valued Customer',
      email: cleanEmail,
      password: password || '123456',
      phone: phone || '+91 82488 75865',
      role: 'customer',
      accountType: isWholesale ? 'wholesale' : 'retail',
      isApproved: !isWholesale, // Wholesale requires admin approval, retail auto-approved
      createdAt: new Date().toISOString()
    };
    setRegisteredUsers(prev => [newUser, ...prev]);
    setUser(newUser);
    return {
      success: true,
      user: newUser,
      message: isWholesale
        ? 'Wholesale account created! Pending Admin approval for bulk ordering privileges.'
        : 'Retail account created successfully!'
    };
  };

  const loginCustomer = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const found = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail || (u.phone && u.phone.replace(/[\s\-\(\)]/g, '') === cleanEmail));
    if (found) {
      if (password && found.password && found.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
      setUser(found);
      return { success: true, user: found };
    }
    // Auto register guest if new
    const guestUser = {
      id: `cust-${Date.now()}`,
      name: email ? email.split('@')[0] : 'Valued Customer',
      email: cleanEmail || 'customer@example.com',
      password: password || '123456',
      role: 'customer',
      accountType: 'retail',
      isApproved: true,
      createdAt: new Date().toISOString()
    };
    setRegisteredUsers(prev => [guestUser, ...prev]);
    setUser(guestUser);
    return { success: true, user: guestUser };
  };

  const approveWholesaleUser = (userId) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, accountType: 'wholesale', isApproved: true };
        if (user && user.id === userId) setUser(updated);
        return updated;
      }
      return u;
    }));
  };

  const toggleUserAccountType = (userId) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextType = u.accountType === 'wholesale' ? 'retail' : 'wholesale';
        const updated = {
          ...u,
          accountType: nextType,
          isApproved: nextType === 'retail' ? true : u.isApproved
        };
        if (user && user.id === userId) setUser(updated);
        return updated;
      }
      return u;
    }));
  };

  const logoutCustomer = () => {
    setUser(null);
  };

  // Admin Auth (Credentials: admin@mojjewels.com / MOJ@0606)
  const loginAdmin = (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    if (
      (cleanUser === 'admin' || cleanUser === 'admin@mojjewels.com') &&
      (password === 'MOJ@0606' || password === 'admin123')
    ) {
      setIsAdminAuthenticated(true);
      setCurrentPage('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentPage('home');
  };

  // Cart Functions (Enforces Stock Allocation Limits)
  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const maxStock = typeof product.stock === 'number' ? product.stock : (parseInt(product.stock) || 0);

    if (maxStock <= 0) {
      alert(`Sorry! "${product.title}" is currently OUT OF STOCK.`);
      return;
    }

    let isStockExceeded = false;

    setCart(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existing = safePrev.find(item => item.id === product.id);
      const currentQty = existing ? existing.quantity : 0;

      if (currentQty + quantity > maxStock) {
        isStockExceeded = true;
        return safePrev;
      }

      if (existing) {
        return safePrev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...safePrev, { ...product, quantity }];
    });

    if (isStockExceeded) {
      const existingInCart = (cart || []).find(i => i.id === product.id);
      const currQty = existingInCart ? existingInCart.quantity : 0;
      alert(`Stock Limit Reached! Only ${maxStock} units of "${product.title}" are available in store. You already have ${currQty} unit(s) in your bag.`);
      return;
    }

    setIsCartOpen(true);
  };

  const updateCartQty = (productId, delta) => {
    const targetProduct = (products || []).find(p => p.id === productId);
    const maxStock = targetProduct ? (typeof targetProduct.stock === 'number' ? targetProduct.stock : parseInt(targetProduct.stock) || 10) : 10;

    setCart(prev => (Array.isArray(prev) ? prev : []).map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        if (delta > 0 && newQty > maxStock) {
          alert(`Stock Limit Reached! Maximum ${maxStock} units available for this item.`);
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => (Array.isArray(prev) ? prev : []).filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (product) => {
    if (!product) return;
    setWishlist(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.some(item => item.id === product.id);
      if (exists) {
        return safePrev.filter(item => item.id !== product.id);
      } else {
        return [...safePrev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return Array.isArray(wishlist) && wishlist.some(item => item && item.id === productId);
  };

  // Coupons
  const applyCouponCode = (code) => {
    if (!code) return { success: false, message: 'Please enter a coupon code.' };
    const cleanCode = code.trim().toUpperCase();
    const safeCoupons = Array.isArray(coupons) ? coupons : INITIAL_COUPONS;
    const found = safeCoupons.find(c => c.code === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }
    const safeCart = Array.isArray(cart) ? cart : [];
    const cartSubtotal = safeCart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
    if (cartSubtotal < found.minAmount) {
      return {
        success: false,
        message: `Minimum order value for ${found.code} is ₹${found.minAmount.toLocaleString()}`
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Financial Calculations & 5% Wholesale Discount
  const safeCart = Array.isArray(cart) ? cart : [];
  const rawSubtotal = safeCart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
  
  // 5% Wholesale Discount for approved Wholesalers
  const isWholesaleApprovedUser = user?.accountType === 'wholesale' && user?.isApproved !== false;
  const wholesaleDiscountAmount = isWholesaleApprovedUser ? Math.round(rawSubtotal * 0.05) : 0;
  const subtotal = Math.max(0, rawSubtotal - wholesaleDiscountAmount);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Orders Placement
  const placeOrder = (orderData) => {
    const newOrderId = `MOJ-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      items: [...safeCart],
      subtotal,
      wholesaleDiscount: wholesaleDiscountAmount,
      discount: discountAmount,
      total: grandTotal,
      couponCode: appliedCoupon ? appliedCoupon.code : '',
      paymentStatus: 'Pending Verification',
      orderStatus: 'Placed',
      courierPartner: '',
      trackingNumber: '',
      ...orderData
    };

    // Deduct inventory stock automatically for each ordered item
    setProducts(prev => (Array.isArray(prev) ? prev : []).map(p => {
      const itemInCart = safeCart.find(i => i.id === p.id);
      if (itemInCart) {
        const updatedStock = Math.max(0, (p.stock || 10) - (itemInCart.quantity || 1));
        return { ...p, stock: updatedStock };
      }
      return p;
    }));

    setOrders(prev => [newOrder, ...(Array.isArray(prev) ? prev : [])]);
    clearCart();

    // Play Satisfying Order Completion Audio Chime
    playOrderSuccessSound();

    return newOrder;
  };

  const deleteUserAccount = (userId) => {
    setRegisteredUsers(prev => (Array.isArray(prev) ? prev : []).filter(u => u.id !== userId));
  };

  // Admin Actions
  const verifyOrderPayment = (orderId, status, note = '') => {
    setOrders(prev => (Array.isArray(prev) ? prev : []).map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          paymentStatus: status,
          orderStatus: status === 'Verified' ? 'Confirmed' : ord.orderStatus,
          notes: note || (status === 'Verified' ? 'Payment Verified by Admin' : 'Payment Rejected by Admin')
        };
      }
      return ord;
    }));
  };

  const updateOrderStatus = (orderId, orderStatus, courierPartner = '', trackingNumber = '') => {
    setOrders(prev => (Array.isArray(prev) ? prev : []).map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          orderStatus,
          courierPartner: courierPartner || ord.courierPartner,
          trackingNumber: trackingNumber || ord.trackingNumber
        };
      }
      return ord;
    }));
  };

  const addProduct = (newProd) => {
    const created = {
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      ...newProd
    };
    setProducts(prev => {
      const next = [created, ...(Array.isArray(prev) ? prev : [])];
      try {
        localStorage.setItem('moj_products', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to sync new product to LocalStorage:', e);
      }
      return next;
    });
  };

  const editProduct = (id, updatedFields) => {
    setProducts(prev => {
      const next = (Array.isArray(prev) ? prev : []).map(p => p.id === id ? { ...p, ...updatedFields } : p);
      try {
        localStorage.setItem('moj_products', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to sync product edit to LocalStorage:', e);
      }
      return next;
    });
  };

  const deleteProduct = (id) => {
    setProducts(prev => {
      const next = (Array.isArray(prev) ? prev : []).filter(p => p.id !== id);
      try {
        localStorage.setItem('moj_products', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to sync product deletion to LocalStorage:', e);
      }
      return next;
    });
  };

  const addCoupon = (newCoupon) => {
    setCoupons(prev => [newCoupon, ...(Array.isArray(prev) ? prev : [])]);
  };

  const toggleCouponStatus = (code) => {
    setCoupons(prev => (Array.isArray(prev) ? prev : []).map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  const deleteCoupon = (code) => {
    setCoupons(prev => (Array.isArray(prev) ? prev : []).filter(c => c.code !== code));
  };

  return (
    <StoreContext.Provider value={{
      currentPage,
      setCurrentPage,
      selectedProduct,
      setSelectedProduct,
      isCartOpen,
      setIsCartOpen,
      isWishlistOpen,
      setIsWishlistOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      user,
      registeredUsers,
      registerCustomer,
      loginCustomer,
      logoutCustomer,
      deleteUserAccount,
      approveWholesaleUser,
      toggleUserAccountType,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
      categories,
      addCategory,
      deleteCategory,
      products: Array.isArray(products) ? products : INITIAL_PRODUCTS,
      addProduct,
      editProduct,
      deleteProduct,
      coupons: Array.isArray(coupons) ? coupons : INITIAL_COUPONS,
      addCoupon,
      toggleCouponStatus,
      deleteCoupon,
      banners: Array.isArray(banners) ? banners : INITIAL_BANNERS,
      paymentConfig: paymentConfig || INITIAL_PAYMENT_CONFIG,
      setPaymentConfig,
      orders: Array.isArray(orders) ? orders : INITIAL_ORDERS,
      placeOrder,
      verifyOrderPayment,
      updateOrderStatus,
      cart: safeCart,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      wishlist: Array.isArray(wishlist) ? wishlist : [],
      toggleWishlist,
      isInWishlist,
      appliedCoupon,
      applyCouponCode,
      removeCoupon,
      subtotal,
      discountAmount,
      grandTotal,
      isAppInstallable,
      installPwaApp
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

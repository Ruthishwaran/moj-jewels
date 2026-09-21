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

  // Customer Account Auth
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

  // Customer Auth
  const loginCustomer = (email, name) => {
    const customerObj = {
      id: `cust-${Date.now()}`,
      name: name || 'Valued Customer',
      email: email || 'customer@example.com',
      role: 'customer'
    };
    setUser(customerObj);
    return customerObj;
  };

  const logoutCustomer = () => {
    setUser(null);
  };

  // Admin Auth
  const loginAdmin = (username, password) => {
    if ((username === 'admin' || username === 'admin@mojjewels.com') && password === 'admin123') {
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

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    setCart(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existing = safePrev.find(item => item.id === product.id);
      if (existing) {
        return safePrev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...safePrev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => (Array.isArray(prev) ? prev : []).map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
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

  // Calculation
  const safeCart = Array.isArray(cart) ? cart : [];
  const subtotal = safeCart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Orders
  const placeOrder = (orderData) => {
    const newOrderId = `MOJ-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      items: [...safeCart],
      subtotal,
      discount: discountAmount,
      total: grandTotal,
      couponCode: appliedCoupon ? appliedCoupon.code : '',
      paymentStatus: 'Pending Verification',
      orderStatus: 'Placed',
      courierPartner: '',
      trackingNumber: '',
      ...orderData
    };

    setOrders(prev => [newOrder, ...(Array.isArray(prev) ? prev : [])]);
    clearCart();
    return newOrder;
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
    setProducts(prev => [created, ...(Array.isArray(prev) ? prev : [])]);
  };

  const editProduct = (id, updatedFields) => {
    setProducts(prev => (Array.isArray(prev) ? prev : []).map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => (Array.isArray(prev) ? prev : []).filter(p => p.id !== id));
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
      loginCustomer,
      logoutCustomer,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc,
  getDocs, writeBatch
} from 'firebase/firestore';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_PAYMENT_CONFIG
} from '../data/initialData';

const StoreContext = createContext();

// Only used for session/device data (not shared)
const safeParseJSON = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return parsed || fallback;
  } catch {
    return fallback;
  }
};

export const StoreProvider = ({ children }) => {
  // ===== UI / Navigation State (local per session) =====
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ===== Session State (stays per device in localStorage) =====
  const [user, setUser] = useState(() => safeParseJSON('moj_customer_user', null));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try { return localStorage.getItem('moj_admin_auth') === 'true'; } catch { return false; }
  });
  const [cart, setCart] = useState(() => safeParseJSON('moj_cart', []));
  const [wishlist, setWishlist] = useState(() => safeParseJSON('moj_wishlist', []));
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ===== PWA State =====
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstallable, setIsAppInstallable] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // ===== Cloud State (Firestore — SAME across ALL devices) =====
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [usedCoupons, setUsedCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([
    'All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Antique Sets', 'Temple Jewellery', 'Bridal Sets'
  ]);
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [paymentConfig, setPaymentConfigState] = useState(INITIAL_PAYMENT_CONFIG);

  // ===== URL path detection =====
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  // ===== Sync session-only data to localStorage =====
  useEffect(() => {
    try {
      if (user) localStorage.setItem('moj_customer_user', JSON.stringify(user));
      else localStorage.removeItem('moj_customer_user');
    } catch {}
  }, [user]);

  useEffect(() => {
    try { localStorage.setItem('moj_admin_auth', isAdminAuthenticated ? 'true' : 'false'); } catch {}
  }, [isAdminAuthenticated]);

  useEffect(() => {
    try { localStorage.setItem('moj_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('moj_wishlist', JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  // ===== FIRESTORE REAL-TIME LISTENERS + INITIAL SEEDING =====
  useEffect(() => {
    const unsubs = [];

    // Seed Firestore with initial data if empty
    const seedIfEmpty = async () => {
      try {
        // Seed products
        const prodSnap = await getDocs(collection(db, 'products'));
        if (prodSnap.empty) {
          const batch = writeBatch(db);
          INITIAL_PRODUCTS.forEach(p => {
            batch.set(doc(db, 'products', p.id), { ...p, createdAt: Date.now() });
          });
          await batch.commit();
        }

        // Seed coupons
        const couponSnap = await getDocs(collection(db, 'coupons'));
        if (couponSnap.empty) {
          const batch = writeBatch(db);
          INITIAL_COUPONS.forEach(c => {
            batch.set(doc(db, 'coupons', c.code), c);
          });
          await batch.commit();
        }

        // Seed config (categories, banners, payment)
        const cfgSnap = await getDocs(collection(db, 'config'));
        if (cfgSnap.empty) {
          await setDoc(doc(db, 'config', 'main'), {
            categories: ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Antique Sets', 'Temple Jewellery', 'Bridal Sets'],
            banners: INITIAL_BANNERS,
            payment: INITIAL_PAYMENT_CONFIG,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Firestore seeding error:', err);
      }
    };

    seedIfEmpty();

    // Real-time listener: Products
    const prodUnsub = onSnapshot(
      collection(db, 'products'),
      snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setProducts(data);
        setIsLoading(false);
      },
      err => {
        console.warn('Products listener error:', err);
        setIsLoading(false);
      }
    );
    unsubs.push(prodUnsub);

    // Real-time listener: Orders
    const ordUnsub = onSnapshot(
      collection(db, 'orders'),
      snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(data);
      },
      err => console.warn('Orders listener error:', err)
    );
    unsubs.push(ordUnsub);

    // Real-time listener: Registered Users
    const usrUnsub = onSnapshot(
      collection(db, 'users'),
      snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        setRegisteredUsers(data);

        // Auto logout & redirect if logged-in user account was deleted by Admin
        try {
          const savedStr = localStorage.getItem('moj_customer_user');
          if (savedStr) {
            const savedUser = JSON.parse(savedStr);
            if (savedUser && savedUser.id) {
              const exists = data.some(
                u => u.id === savedUser.id || (u.email && u.email.toLowerCase() === savedUser.email?.toLowerCase())
              );
              if (!exists) {
                localStorage.removeItem('moj_customer_user');
                setUser(null);
                setIsAuthModalOpen(true);
                setCurrentPage('home');
                alert('Your account has been deleted by Store Admin. Please create an account to continue.');
              }
            }
          }
        } catch (e) {
          console.warn('User deletion check error:', e);
        }
      },
      err => console.warn('Users listener error:', err)
    );
    unsubs.push(usrUnsub);

    // Real-time listener: Coupons
    const cupUnsub = onSnapshot(
      collection(db, 'coupons'),
      snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        setCoupons(data);
      },
      err => console.warn('Coupons listener error:', err)
    );
    unsubs.push(cupUnsub);

    // Real-time listener: Used Coupons
    const ucUnsub = onSnapshot(
      collection(db, 'usedCoupons'),
      snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        setUsedCoupons(data);
      },
      err => console.warn('UsedCoupons listener error:', err)
    );
    unsubs.push(ucUnsub);

    // Real-time listener: Reviews
    const revUnsub = onSnapshot(
      collection(db, 'reviews'),
      snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setReviews(data);
      },
      err => console.warn('Reviews listener error:', err)
    );
    unsubs.push(revUnsub);

    // Real-time listener: Config (categories, banners, payment)
    const cfgUnsub = onSnapshot(
      doc(db, 'config', 'main'),
      snap => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
          if (data.banners && Array.isArray(data.banners)) setBanners(data.banners);
          if (data.payment) setPaymentConfigState(data.payment);
        }
      },
      err => console.warn('Config listener error:', err)
    );
    unsubs.push(cfgUnsub);

    return () => unsubs.forEach(u => u());
  }, []);

  // ===== PRODUCT CRUD (Firestore) =====
  const addProduct = async (newProd) => {
    try {
      const id = `prod-${Date.now()}`;
      const created = {
        ...newProd,
        id,
        rating: 5.0,
        reviewsCount: 1,
        createdAt: Date.now()
      };
      await setDoc(doc(db, 'products', id), created);
    } catch (err) {
      console.error('addProduct error:', err);
      alert('Failed to add product. Please check your internet connection.');
    }
  };

  const editProduct = async (id, updatedFields) => {
    try {
      await setDoc(doc(db, 'products', id), { ...updatedFields, updatedAt: Date.now() }, { merge: true });
    } catch (err) {
      console.error('editProduct error:', err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error('deleteProduct error:', err);
    }
  };

  // ===== CATEGORY CRUD (Firestore) =====
  const addCategory = async (catName) => {
    if (!catName) return;
    const clean = catName.trim();
    if (!categories.includes(clean)) {
      const newCats = [...categories, clean];
      try {
        await setDoc(doc(db, 'config', 'main'), { categories: newCats, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.error('addCategory error:', err);
      }
    }
  };

  const deleteCategory = async (catName) => {
    if (catName === 'All') return;
    const newCats = categories.filter(c => c !== catName);
    try {
      await setDoc(doc(db, 'config', 'main'), { categories: newCats, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.error('deleteCategory error:', err);
    }
  };

  // ===== PAYMENT CONFIG (Firestore) =====
  const setPaymentConfig = async (config) => {
    try {
      await setDoc(doc(db, 'config', 'main'), { payment: config, updatedAt: new Date().toISOString() }, { merge: true });
      setPaymentConfigState(config);
    } catch (err) {
      console.error('setPaymentConfig error:', err);
    }
  };

  // ===== COUPON CRUD (Firestore) =====
  const addCoupon = async (newCoupon) => {
    try {
      await setDoc(doc(db, 'coupons', newCoupon.code), newCoupon);
    } catch (err) {
      console.error('addCoupon error:', err);
    }
  };

  const toggleCouponStatus = async (code) => {
    try {
      const coupon = coupons.find(c => c.code === code);
      if (coupon) {
        await setDoc(doc(db, 'coupons', code), { active: !coupon.active }, { merge: true });
      }
    } catch (err) {
      console.error('toggleCouponStatus error:', err);
    }
  };

  const deleteCoupon = async (code) => {
    try {
      await deleteDoc(doc(db, 'coupons', code));
    } catch (err) {
      console.error('deleteCoupon error:', err);
    }
  };

  // ===== CUSTOMER AUTH (Firestore) =====
  const registerCustomer = async ({ name, email, password, phone, accountType = 'retail' }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim().replace(/[\s\-\(\)]/g, '');

    const existingEmail = registeredUsers.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      return { success: false, message: 'An account with this email already exists. Please login instead.' };
    }

    if (cleanPhone) {
      const existingPhone = registeredUsers.find(u => u.phone && u.phone.replace(/[\s\-\(\)]/g, '') === cleanPhone);
      if (existingPhone) {
        return { success: false, message: 'An account with this phone number already exists. Please login instead.' };
      }
    }

    const isWholesale = accountType === 'wholesale';
    const newUser = {
      id: `cust-${Date.now()}`,
      name: name || 'Valued Customer',
      email: cleanEmail,
      password: password || '123456',
      phone: cleanPhone || '',
      role: 'customer',
      accountType: isWholesale ? 'wholesale' : 'retail',
      isApproved: !isWholesale,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', newUser.id), newUser);
      setUser(newUser);
      return {
        success: true,
        user: newUser,
        message: isWholesale
          ? 'Wholesale account created! Pending Admin approval for bulk ordering privileges.'
          : 'Account created successfully! Welcome to MOJ Jewels! 🎉'
      };
    } catch (err) {
      console.error('registerCustomer error:', err);
      return { success: false, message: 'Registration failed. Please check your internet connection.' };
    }
  };

  const loginCustomer = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const found = registeredUsers.find(u =>
      (u.email && u.email.toLowerCase() === cleanEmail) ||
      (u.phone && u.phone.replace(/[\s\-\(\)]/g, '') === cleanEmail)
    );

    if (!found) {
      return { success: false, message: 'No account found with this email/phone. Please register first.' };
    }
    if (password && found.password && found.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }
    setUser(found);
    return { success: true, user: found };
  };

  const approveWholesaleUser = async (userId) => {
    try {
      await setDoc(doc(db, 'users', userId), { isApproved: true, accountType: 'wholesale' }, { merge: true });
      if (user && user.id === userId) {
        setUser(prev => ({ ...prev, isApproved: true, accountType: 'wholesale' }));
      }
    } catch (err) {
      console.error('approveWholesaleUser error:', err);
    }
  };

  const toggleUserAccountType = async (userId) => {
    const target = registeredUsers.find(u => u.id === userId);
    if (!target) return;
    const nextType = target.accountType === 'wholesale' ? 'retail' : 'wholesale';
    try {
      await setDoc(doc(db, 'users', userId), {
        accountType: nextType,
        isApproved: nextType === 'retail' ? true : target.isApproved
      }, { merge: true });
      if (user && user.id === userId) {
        setUser(prev => ({ ...prev, accountType: nextType }));
      }
    } catch (err) {
      console.error('toggleUserAccountType error:', err);
    }
  };

  const logoutCustomer = () => setUser(null);

  const deleteUserAccount = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (err) {
      console.error('deleteUserAccount error:', err);
    }
  };

  // ===== ADMIN AUTH =====
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

  // ===== CART FUNCTIONS (session only, device-local) =====
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
        return safePrev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...safePrev, { ...product, quantity }];
    });

    if (isStockExceeded) {
      const existingInCart = (cart || []).find(i => i.id === product.id);
      const currQty = existingInCart ? existingInCart.quantity : 0;
      alert(`Stock Limit Reached! Only ${maxStock} units available. You already have ${currQty} in your bag.`);
      return;
    }
    setIsCartOpen(true);
  };

  const updateCartQty = (productId, delta) => {
    const targetProduct = (products || []).find(p => p.id === productId);
    const maxStock = targetProduct
      ? (typeof targetProduct.stock === 'number' ? targetProduct.stock : parseInt(targetProduct.stock) || 10)
      : 10;

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

  // ===== WISHLIST =====
  const toggleWishlist = (product) => {
    if (!product) return;
    setWishlist(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.some(item => item.id === product.id);
      return exists
        ? safePrev.filter(item => item.id !== product.id)
        : [...safePrev, product];
    });
  };

  const isInWishlist = (productId) =>
    Array.isArray(wishlist) && wishlist.some(item => item && item.id === productId);

  // ===== REVIEWS SYSTEM =====
  const canUserReviewProduct = (productId) => {
    if (!user || !user.email) {
      return { allowed: false, reason: 'Please sign in to submit a customer review.' };
    }
    const userEmail = user.email.toLowerCase();
    const safeReviews = Array.isArray(reviews) ? reviews : [];
    const alreadyReviewed = safeReviews.some(
      r => String(r.productId) === String(productId) && r.userEmail?.toLowerCase() === userEmail
    );
    if (alreadyReviewed) {
      return { allowed: false, reason: 'You have already submitted a review for this product.' };
    }

    const safeOrders = Array.isArray(orders) ? orders : [];
    const hasDeliveredOrder = safeOrders.some(ord => {
      const isUserOrder = (ord.customerEmail?.toLowerCase() === userEmail) || (ord.email?.toLowerCase() === userEmail);
      const isDelivered = ord.orderStatus === 'Delivered' || ord.status === 'Delivered';
      const containsItem = Array.isArray(ord.items) && ord.items.some(it => String(it.id) === String(productId));
      return isUserOrder && isDelivered && containsItem;
    });

    if (!hasDeliveredOrder) {
      return {
        allowed: false,
        reason: 'Verified Buyer Requirement: You can only submit a review after your order for this item is marked Delivered.'
      };
    }

    return { allowed: true };
  };

  const addReview = async ({ productId, userName, userEmail, rating, comment, isVerifiedBuyer = true, isAdminAdded = false }) => {
    try {
      const newRevDoc = doc(collection(db, 'reviews'));
      const revData = {
        id: newRevDoc.id,
        productId: String(productId),
        userName: userName || user?.name || 'Customer',
        userEmail: userEmail || user?.email || '',
        rating: Number(rating) || 5,
        comment: comment || '',
        isVerifiedBuyer: Boolean(isVerifiedBuyer),
        isAdminAdded: Boolean(isAdminAdded),
        createdAt: Date.now(),
        dateStr: new Date().toLocaleDateString()
      };
      await setDoc(newRevDoc, revData);

      // Recalculate Product average rating & count
      const currentProds = Array.isArray(products) ? products : [];
      const prod = currentProds.find(p => String(p.id) === String(productId));
      if (prod) {
        const prodReviews = [...(reviews || []).filter(r => String(r.productId) === String(productId)), revData];
        const avgRating = (prodReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / prodReviews.length).toFixed(1);
        await updateDoc(doc(db, 'products', String(productId)), {
          rating: Number(avgRating),
          reviewsCount: prodReviews.length
        });
      }
      return { success: true, message: 'Thank you! Your review has been submitted successfully. ✨' };
    } catch (err) {
      console.error('Add review error:', err);
      return { success: false, message: 'Failed to submit review. Please try again.' };
    }
  };

  // ===== COUPONS APPLICATION =====
  const applyCouponCode = (code) => {
    if (!code) return { success: false, message: 'Please enter a coupon code.' };
    const cleanCode = code.trim().toUpperCase();
    const safeCoupons = Array.isArray(coupons) ? coupons : [];
    const found = safeCoupons.find(c => c.code === cleanCode && c.active);
    if (!found) return { success: false, message: 'Invalid or inactive coupon code.' };

    // Single-use enforcement
    const currentUserId = user?.email?.toLowerCase() || user?.id || 'guest';
    const hasBeenUsed = (Array.isArray(usedCoupons) ? usedCoupons : []).some(
      uc => uc.code === cleanCode && (uc.user === currentUserId || uc.email === user?.email?.toLowerCase())
    ) || (user?.usedCoupons && user.usedCoupons.includes(cleanCode));

    if (hasBeenUsed) {
      return {
        success: false,
        message: `Coupon "${found.code}" has already been redeemed on a previous order. Coupons can only be used once per customer.`
      };
    }

    const safeCart = Array.isArray(cart) ? cart : [];
    const cartSubtotal = safeCart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
    if (cartSubtotal < found.minAmount) {
      return { success: false, message: `Minimum order value for ${found.code} is ₹${found.minAmount.toLocaleString()}` };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied! 🎉` };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  // ===== FINANCIAL CALCULATIONS =====
  const safeCart = Array.isArray(cart) ? cart : [];
  const rawSubtotal = safeCart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
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

  // ===== ORDER SOUND =====
  const playOrderSuccessSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50];
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
      console.warn('Audio playback error:', e);
    }
  };

  // ===== ORDER PLACEMENT (Firestore) =====
  const placeOrder = async (orderData) => {
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

    try {
      // Write order to Firestore
      await setDoc(doc(db, 'orders', newOrderId), newOrder);

      // Record coupon usage (prevents double-redemption)
      if (appliedCoupon) {
        const ucId = `${appliedCoupon.code}_${user?.id || 'guest'}_${Date.now()}`;
        await setDoc(doc(db, 'usedCoupons', ucId), {
          code: appliedCoupon.code,
          user: user?.email?.toLowerCase() || user?.id || 'guest',
          email: user?.email?.toLowerCase() || '',
          orderId: newOrderId,
          usedAt: new Date().toISOString()
        });
        // Update user record
        if (user) {
          const updatedUser = { ...user, usedCoupons: [...(user.usedCoupons || []), appliedCoupon.code] };
          await setDoc(doc(db, 'users', user.id), { usedCoupons: updatedUser.usedCoupons }, { merge: true });
          setUser(updatedUser);
        }
      }

      // Deduct stock from each product (Firestore)
      const stockOps = safeCart.map(async (item) => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const newStock = Math.max(0, (product.stock || 0) - (item.quantity || 1));
          await setDoc(doc(db, 'products', item.id), { stock: newStock }, { merge: true });
        }
      });
      await Promise.all(stockOps);

    } catch (err) {
      console.error('placeOrder error:', err);
    }

    clearCart();
    playOrderSuccessSound();
    return newOrder;
  };

  // ===== ADMIN ORDER ACTIONS (Firestore) =====
  const verifyOrderPayment = async (orderId, status, note = '') => {
    try {
      const update = {
        paymentStatus: status,
        notes: note || (status === 'Verified' ? 'Payment Verified by Admin' : 'Payment Rejected by Admin')
      };
      if (status === 'Verified') update.orderStatus = 'Confirmed';
      await setDoc(doc(db, 'orders', orderId), update, { merge: true });
    } catch (err) {
      console.error('verifyOrderPayment error:', err);
    }
  };

  const updateOrderStatus = async (orderId, orderStatus, courierPartner = '', trackingNumber = '') => {
    try {
      const update = { orderStatus };
      if (courierPartner) update.courierPartner = courierPartner;
      if (trackingNumber) update.trackingNumber = trackingNumber;
      await setDoc(doc(db, 'orders', orderId), update, { merge: true });
    } catch (err) {
      console.error('updateOrderStatus error:', err);
    }
  };

  // ===== PWA Install =====
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
    if (!deferredPrompt) { setIsInstallModalOpen(true); return; }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') { setIsAppInstallable(false); setDeferredPrompt(null); }
      else { setIsInstallModalOpen(true); }
    } catch { setIsInstallModalOpen(true); }
  };

  // ===== CONTEXT VALUE =====
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
      isLoading,
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
      products: Array.isArray(products) ? products : [],
      addProduct,
      editProduct,
      deleteProduct,
      coupons: Array.isArray(coupons) ? coupons : [],
      addCoupon,
      toggleCouponStatus,
      deleteCoupon,
      banners: Array.isArray(banners) ? banners : INITIAL_BANNERS,
      paymentConfig: paymentConfig || INITIAL_PAYMENT_CONFIG,
      setPaymentConfig,
      orders: Array.isArray(orders) ? orders : [],
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
      reviews: Array.isArray(reviews) ? reviews : [],
      addReview,
      canUserReviewProduct,
      isAppInstallable,
      installPwaApp,
      isInstallModalOpen,
      setIsInstallModalOpen,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      playOrderSuccessSound
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

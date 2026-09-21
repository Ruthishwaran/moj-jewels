export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Bridal Antique Gold & Kundan Choker Set',
    category: 'Bridal Sets',
    price: 8500,
    originalPrice: 12000,
    rating: 4.9,
    reviewsCount: 58,
    stock: 12,
    karat: 'Premium Imitation Gold & Kundan',
    weight: 'Heavy Bridal Wear',
    featured: true,
    bestseller: true,
    type: 'Wholesale & Retail',
    image: '/images/moj_banner_1.jpg',
    description: 'Exquisite bridal antique necklace with matching Jhumkas. Handcrafted premium imitation jewelry for wedding & royal festive occasions.'
  },
  {
    id: 'prod-2',
    title: 'Royal Temple Design Emerald Pendant Necklace',
    category: 'Antique & Temple',
    price: 4800,
    originalPrice: 6500,
    rating: 5.0,
    reviewsCount: 42,
    stock: 15,
    karat: '24k Matte Gold Plated Antique',
    weight: 'Medium Weight',
    featured: true,
    bestseller: true,
    type: 'Wholesale & Retail',
    image: '/images/moj_banner_2.jpg',
    description: 'Traditional temple jewelry featuring goddess motif and Zambian ruby-emerald stones with pearl drops.'
  },
  {
    id: 'prod-3',
    title: 'Rose Gold Floral Solitaire Diamond Ring',
    category: 'Rings',
    price: 2400,
    originalPrice: 3500,
    rating: 4.8,
    reviewsCount: 36,
    stock: 20,
    karat: 'Rose Gold & CZ Cubic Zirconia',
    weight: 'Daily Wear',
    featured: true,
    bestseller: false,
    type: 'Retail',
    image: '/images/moj_logo.jpg',
    description: 'Timeless floral design ring in rose gold finish holding a brilliant solitaire stone. Designed for daily elegance.'
  },
  {
    id: 'prod-4',
    title: 'Traditional Matte Gold Peacock Jhumka Earrings',
    category: 'Daily Wear & Earrings',
    price: 1800,
    originalPrice: 2500,
    rating: 4.9,
    reviewsCount: 74,
    stock: 30,
    karat: 'Matte Finish Gold',
    weight: 'Lightweight Jhumka',
    featured: true,
    bestseller: true,
    type: 'Wholesale & Retail',
    image: '/images/moj_banner_1.jpg',
    description: 'Classic South Indian peacock carved Jhumkas with pearl tassels. Hypoallergenic premium brass alloy.'
  },
  {
    id: 'prod-5',
    title: 'Antique Lakshmi Ruby Bangle Set (Set of 4)',
    category: 'Bangles & Bracelets',
    price: 3200,
    originalPrice: 4500,
    rating: 4.7,
    reviewsCount: 29,
    stock: 18,
    karat: 'High Polish Micro Gold',
    weight: 'Standard Size 2.4/2.6/2.8',
    featured: false,
    bestseller: true,
    type: 'Wholesale & Retail',
    image: '/images/moj_banner_2.jpg',
    description: 'Set of 4 handcrafted antique gold bangles studded with kemp ruby stones. Perfect for festive sarees.'
  },
  {
    id: 'prod-6',
    title: 'Contemporary Layered AD Diamond Choker',
    category: 'Bridal Sets',
    price: 6500,
    originalPrice: 8900,
    rating: 4.9,
    reviewsCount: 31,
    stock: 10,
    karat: 'Rhodium & American Diamond',
    weight: 'Partywear Special',
    featured: false,
    bestseller: false,
    type: 'Wholesale & Retail',
    image: '/images/moj_banner_1.jpg',
    description: 'Dazzling American Diamond choker set with matching drop earrings. Platinum rhodium polish for diamond-like shine.'
  }
];

export const INITIAL_COUPONS = [
  {
    code: 'ROYAL10',
    discountType: 'percentage',
    value: 10,
    minAmount: 2000,
    description: '10% OFF on all Wholesale & Retail orders',
    expiry: '2026-12-31',
    active: true
  },
  {
    code: 'MOJGLAM20',
    discountType: 'flat',
    value: 500,
    minAmount: 3000,
    description: 'Flat ₹500 OFF on orders above ₹3,000',
    expiry: '2026-11-30',
    active: true
  },
  {
    code: 'WELCOME500',
    discountType: 'flat',
    value: 300,
    minAmount: 1500,
    description: '₹300 OFF for new customer registrations',
    expiry: '2026-10-15',
    active: true
  }
];

export const INITIAL_BANNERS = [
  {
    id: 'banner-1',
    title: 'MOJ JEWELS - WHOLESALE & RETAIL',
    subtitle: 'Premium Imitation Jewellery • Bridal • Antique • Daily Wear',
    couponCode: 'ROYAL10',
    image: '/images/moj_banner_1.jpg',
    btnText: 'Explore New Weekly Collection'
  },
  {
    id: 'banner-2',
    title: 'TIMELESS BEAUTY MADE FOR YOU',
    subtitle: 'Follow Us For Exclusive Updates & Direct WhatsApp Orders',
    couponCode: 'MOJGLAM20',
    image: '/images/moj_banner_2.jpg',
    btnText: 'WhatsApp DM to Order'
  }
];

export const INITIAL_PAYMENT_CONFIG = {
  upiId: 'mojjewels@hdfcbank',
  payeeName: 'MOJ JEWELS PRIVATE LIMITED',
  bankName: 'HDFC Bank Ltd',
  accountNumber: '50100982736412',
  ifscCode: 'HDFC0001892',
  qrImageUrl: '/images/payment_qr.jpg',
  instructions: 'Scan QR code using Google Pay, PhonePe, Paytm or any UPI app. Pay exact total amount, then enter your 12-digit UTR/Transaction Reference ID below.'
};

export const INITIAL_ORDERS = [
  {
    id: 'MOJ-98421',
    date: '2026-09-20T10:30:00Z',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'ananya@example.com',
    shippingAddress: 'Flat 402, Royal Residency, M.G. Road, Bangalore, 560001',
    items: [
      {
        id: 'prod-1',
        title: 'Bridal Antique Gold & Kundan Choker Set',
        price: 8500,
        quantity: 1,
        image: '/images/moj_banner_1.jpg'
      }
    ],
    subtotal: 8500,
    discount: 850,
    total: 7650,
    couponCode: 'ROYAL10',
    paymentMethod: 'Manual UPI QR',
    transactionId: '426918371902',
    paymentStatus: 'Pending Verification',
    orderStatus: 'Placed',
    courierPartner: '',
    trackingNumber: '',
    notes: 'Paid via GPay at 10:28 AM'
  }
];

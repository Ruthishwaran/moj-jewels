// Demo/testing products removed permanently — only admin created products populate the catalog
export const INITIAL_PRODUCTS = [];

// Default sub-categories mapped per main jewelry category (admin can add/edit/delete from Admin Dashboard)
export const INITIAL_SUB_CATEGORIES = {
  'Necklace': ['AD Necklace', 'Matte Necklace', 'Choker', 'Long Haram', 'Temple Necklace', 'Antique Necklace', 'Bridal Necklace'],
  'Necklaces': ['AD Necklace', 'Matte Necklace', 'Choker', 'Long Haram', 'Temple Necklace', 'Antique Necklace', 'Bridal Necklace'],
  'Bangles': ['Premium Bangle', 'AD Bangle', 'Matte Bangle', 'Kada Bangle', 'Antique Bangle', 'Daily Wear Bangle'],
  'Bangles & Bracelets': ['Premium Bangle', 'AD Bangle', 'Matte Bangle', 'Kada Bangle', 'Antique Bangle', 'Daily Wear Bangle'],
  'Earrings': ['Jhumkas', 'Studs', 'Chandbali', 'Danglers', 'Ear Cuffs', 'Daily Wear Earrings'],
  'Daily Wear & Earrings': ['Jhumkas', 'Studs', 'Chandbali', 'Danglers', 'Daily Wear Earrings'],
  'Rings': ['Solitaire Ring', 'Floral Ring', 'AD Ring', 'Band Ring', 'Adjustable Ring'],
  'Bridal Sets': ['Choker Set', 'Full Bridal Set', 'Temple Bridal Set', 'AD Bridal Set', 'Antique Set'],
  'Antique Sets': ['Temple Antique Set', 'Goddess Motif Set', 'Kemp Antique Set'],
  'Antique & Temple': ['Temple Haram', 'Goddess Pendant', 'Antique Choker', 'Kemp Set'],
  'Temple Jewellery': ['Temple Haram', 'Kasumala', 'Goddess Pendant', 'Kemp Set'],
  'Bracelets': ['AD Bracelet', 'Chain Bracelet', 'Kada Bracelet']
};


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

// Orders start empty — all orders come from real customers via Firestore
export const INITIAL_ORDERS = [];

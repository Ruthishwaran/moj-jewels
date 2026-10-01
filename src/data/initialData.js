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
    code: 'WELCOM100',
    discountType: 'flat',
    value: 100,
    minAmount: 1000,
    description: 'Flat ₹100 OFF on orders above ₹1,000',
    expiry: '2026-12-31',
    active: true
  }
];

export const INITIAL_BANNERS = [
  {
    id: 'banner-1',
    title: 'MOJ JEWELS - WHOLESALE & RETAIL',
    subtitle: 'Premium Imitation Jewellery • Bridal • Antique • Daily Wear',
    couponCode: 'WELCOM100',
    image: '/images/moj_banner_1.jpg',
    btnText: 'Explore New Weekly Collection'
  },
  {
    id: 'banner-2',
    title: 'TIMELESS BEAUTY MADE FOR YOU',
    subtitle: 'Follow Us For Exclusive Updates & Direct WhatsApp Orders',
    couponCode: 'WELCOM100',
    image: '/images/moj_banner_2.jpg',
    btnText: 'WhatsApp DM to Order'
  }
];

export const INITIAL_PAYMENT_CONFIG = {
  upiId: 'harishramesh67-2@okhdfcbank',
  payeeName: 'HARISH RAMESH',
  bankName: 'HDFC Bank Ltd',
  accountNumber: '50100518787919',
  ifscCode: 'HDFC0009593',
  qrImageUrl: '/images/payment_qr.jpg',
  instructions: 'Scan QR code using Google Pay, PhonePe, Paytm or any UPI app. Pay exact total amount, then enter your 12-digit UTR/Transaction Reference ID below.'
};

// Orders start empty — all orders come from real customers via Firestore
export const INITIAL_ORDERS = [];

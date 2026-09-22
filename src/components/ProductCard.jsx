import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Star, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';

export default function ProductCard({ product }) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
    setCurrentPage,
    setIsCartOpen
  } = useStore();

  if (!product) return null;

  const id = product.id || `prod-${Math.random()}`;
  const title = product.title || 'MOJ Fine Jewelry';
  const category = product.category || 'Jewelry';
  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
  const originalPrice = typeof product.originalPrice === 'number' ? product.originalPrice : (parseFloat(product.originalPrice) || price);
  const rating = product.rating || 5.0;
  const reviewsCount = product.reviewsCount || 1;
  const stock = product.stock || 5;
  const karat = product.karat || 'Premium Hallmarked';

  const imageList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || '/images/moj_logo.jpg'];

  const [currentImgIdx, setCurrentImgIdx] = React.useState(0);
  const [addedFlash, setAddedFlash] = React.useState(false);

  React.useEffect(() => {
    if (imageList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImgIdx(prev => (prev + 1) % imageList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [imageList.length]);

  const activeImage = imageList[currentImgIdx] || imageList[0];
  const isWishlisted = isInWishlist(id);
  const discountPercent = (originalPrice > price && originalPrice > 0)
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 2500);
  };


  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-gold-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/10 group flex flex-col h-full">

      {/* ── Product Image ── */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-square overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={activeImage}
          alt={title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          onError={(e) => { e.target.src = '/images/moj_logo.jpg'; }}
        />

        {/* Image dots */}
        {imageList.length > 1 && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {imageList.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${idx === currentImgIdx ? 'bg-gold-400 w-4' : 'bg-white/50 w-1.5'}`}
              />
            ))}
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-gold-500 text-black font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider z-10">
            {discountPercent}% OFF
          </span>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[11px] px-3 py-1 rounded-full shadow-lg uppercase tracking-wider animate-pulse z-10">
            OUT OF STOCK
          </span>
        )}



        {/* ── ADD TO BAG / CHECKOUT STRIP — Bottom of image, always visible ── */}
        {addedFlash ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPage('checkout');
            }}
            className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-2 py-3 font-bold text-sm bg-emerald-500 text-white animate-pulse"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Added! Go to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-2 py-3 font-bold text-sm transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-800/90 text-slate-500 cursor-not-allowed'
                : 'bg-gold-500/95 hover:bg-gold-400 text-black backdrop-blur-sm active:scale-98'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
        )}

      </div>

      {/* ── Product Info ── */}
      <div
        className="p-4 flex flex-col flex-1 justify-between space-y-2 cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gold-400 font-medium uppercase tracking-wider text-[10px]">{category}</span>
            <span className="flex items-center text-amber-400 gap-1 font-semibold">
              <Star className="w-3 h-3 fill-current" />
              {rating} <span className="text-slate-500 font-normal">({reviewsCount})</span>
            </span>
          </div>

          <h3 className="text-white font-serif font-semibold text-sm line-clamp-2 hover:text-gold-300 transition-colors leading-snug">
            {title}
          </h3>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span className="line-clamp-1">{karat}</span>
          </div>
        </div>

        {/* Price row */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-white font-bold text-base font-sans">
                ₹{price.toLocaleString()}
              </span>
              {originalPrice > price && (
                <span className="text-slate-500 line-through text-xs">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {isOutOfStock ? (
              <span className="text-[10px] text-rose-400 font-bold uppercase">Out of Stock</span>
            ) : (
              <span className="text-[10px] text-emerald-400">{stock} units left</span>
            )}
          </div>

          {/* Small wishlist echo at bottom */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            className={`p-2 rounded-full border transition-all ${
              isWishlisted
                ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                : 'border-slate-700 text-slate-500 hover:border-rose-400 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

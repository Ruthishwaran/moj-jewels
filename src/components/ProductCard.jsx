import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Star, Eye, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product }) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct
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
  const image = product.image || '/images/moj_logo.jpg';

  const isWishlisted = isInWishlist(id);

  const discountPercent = (originalPrice > price && originalPrice > 0)
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const isOutOfStock = stock <= 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-gold-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/10 group flex flex-col h-full">
      {/* Product Image Area */}
      <div 
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-square overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          onError={(e) => { e.target.src = '/images/moj_logo.jpg'; }}
        />

        {/* Discount Badge */}
        {discountPercent > 0 && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-gold-500 text-black font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        )}

        {/* Out of Stock Red Badge */}
        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[11px] px-3 py-1 rounded-full shadow-lg uppercase tracking-wider animate-pulse">
            OUT OF STOCK
          </span>
        )}

        {/* Wishlist Heart Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-transform active:scale-90 shadow-md ${
            isWishlisted
              ? 'bg-rose-500/90 text-white'
              : 'bg-black/40 text-slate-300 hover:text-white hover:bg-black/70'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-white' : ''}`} />
        </button>

        {/* View Details Hover Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={() => setSelectedProduct(product)}
            className="bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="text-gold-400 font-medium uppercase tracking-wider text-[10px]">{category}</span>
            <span className="flex items-center text-amber-400 gap-1 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
              {rating} <span className="text-slate-500 font-normal">({reviewsCount})</span>
            </span>
          </div>

          <h3 
            onClick={() => setSelectedProduct(product)}
            className="text-white font-serif font-semibold text-base line-clamp-1 hover:text-gold-300 cursor-pointer transition-colors"
          >
            {title}
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{karat}</span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-white font-bold text-lg font-sans">
                ₹{price.toLocaleString()}
              </span>
              {originalPrice > price && (
                <span className="text-slate-500 line-through text-xs">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {isOutOfStock ? (
              <span className="text-[10px] text-rose-400 font-bold uppercase">Out of Stock (0 units)</span>
            ) : (
              <span className="text-[10px] text-emerald-400">In Stock ({stock} units)</span>
            )}
          </div>

          <button
            onClick={() => !isOutOfStock && addToCart(product)}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                : 'bg-gold-500/10 hover:bg-gold-500 hover:text-black text-gold-400 border border-gold-500/40 active:scale-95'
            }`}
            title={isOutOfStock ? 'Item Out of Stock' : 'Add to Cart'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

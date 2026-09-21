import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Star, ShieldCheck, Truck } from 'lucide-react';

export default function ProductModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto 5-second slideshow for multi-image gallery
  React.useEffect(() => {
    if (!selectedProduct) return;
    const list = Array.isArray(selectedProduct?.images) && selectedProduct.images.length > 0
      ? selectedProduct.images
      : [selectedProduct?.image || '/images/moj_logo.jpg'];
    if (list.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveImgIndex(prev => (prev + 1) % list.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [selectedProduct, isPaused]);

  if (!selectedProduct) return null;

  const id = selectedProduct.id || `prod-${Math.random()}`;
  const title = selectedProduct.title || 'MOJ Fine Jewelry';
  const category = selectedProduct.category || 'Jewelry';
  const price = typeof selectedProduct.price === 'number' ? selectedProduct.price : (parseFloat(selectedProduct.price) || 0);
  const originalPrice = typeof selectedProduct.originalPrice === 'number' ? selectedProduct.originalPrice : (parseFloat(selectedProduct.originalPrice) || price);
  const rating = selectedProduct.rating || 5.0;
  const reviewsCount = selectedProduct.reviewsCount || 1;
  const karat = selectedProduct.karat || 'Premium Hallmarked';
  const weight = selectedProduct.weight || 'Standard Weight';
  const description = selectedProduct.description || 'Crafted luxury jewelry artifact.';
  
  // Image list (supports array of images or fallback)
  const imageList = Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [selectedProduct.image || '/images/moj_logo.jpg'];
  const activeImage = imageList[activeImgIndex] || imageList[0];

  const stock = typeof selectedProduct.stock === 'number' ? selectedProduct.stock : (parseInt(selectedProduct.stock) || 0);
  const isOutOfStock = stock <= 0;

  const isWishlisted = isInWishlist(id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl glass-modal border border-gold-500/30 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-900/60 rounded-full backdrop-blur"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Multi-Image Gallery Container (5s Auto-slideshow with Pause on Hover) */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex flex-col bg-slate-950 p-4 space-y-3"
          >
            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
              <img
                src={activeImage}
                alt={title}
                className={`w-full h-full object-cover transition-all duration-300 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                onError={(e) => { e.target.src = '/images/moj_logo.jpg'; }}
              />
              <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gold-500/30">
                {karat}
              </span>
              {isOutOfStock && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase shadow-md animate-pulse">
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Thumbnails Row if multiple images exist */}
            {imageList.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      idx === activeImgIndex ? 'border-gold-400 scale-105 shadow-lg' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="text-gold-400 font-semibold uppercase">{category}</span>
                <span className="flex items-center text-amber-400 gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  {rating} ({reviewsCount} reviews)
                </span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                {title}
              </h2>

              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-2xl font-bold text-white">
                  ₹{price.toLocaleString()}
                </span>
                {originalPrice > price && (
                  <span className="text-slate-500 line-through text-sm">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="mb-4">
                {isOutOfStock ? (
                  <span className="text-xs text-rose-400 font-bold uppercase">Out of Stock (0 units remaining)</span>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold">Available Stock: {stock} units</span>
                )}
              </div>

              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                {description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs mb-6">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Karat / Quality</span>
                  <strong className="text-gold-300">{karat}</strong>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Weight Info</span>
                  <strong className="text-white">{weight}</strong>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Quality Inspected & Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-gold-400" />
                  <span>Insured Express Pan-India Courier</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="text-slate-400 hover:text-white px-2 font-bold disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-white font-semibold px-3 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= stock}
                    className="text-slate-400 hover:text-white px-2 font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all ${
                    isOutOfStock
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'btn-gold-shimmer text-black cursor-pointer'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Currently Out of Stock' : `Add to Bag - ₹${(price * quantity).toLocaleString()}`}</span>
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(selectedProduct)}
                className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-colors ${
                  isWishlisted
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
